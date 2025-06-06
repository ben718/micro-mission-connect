
import { create } from 'zustand';
import { missionService } from '../lib/supabase';
import type { Mission, MissionFilters } from '../lib/types';

interface MissionState {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  filters: MissionFilters;
  userMissions: string[];
  
  fetchMissions: () => Promise<void>;
  registerForMission: (missionId: string) => Promise<void>;
  cancelMissionRegistration: (missionId: string, reason?: string) => Promise<void>;
  setFilter: (key: keyof MissionFilters, value: any) => void;
  resetFilters: () => void;
}

const initialFilters: MissionFilters = {
  timing: null,
  duration: null,
  category: null,
  distance: null,
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  loading: false,
  error: null,
  filters: initialFilters,
  userMissions: [],
  
  fetchMissions: async () => {
    set({ loading: true, error: null });
    try {
      const missions = await missionService.getPublishedMissions();
      set({ missions: missions as Mission[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  registerForMission: async (missionId: string) => {
    try {
      await missionService.registerForMission(missionId);
      set({ 
        userMissions: [...get().userMissions, missionId] 
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  cancelMissionRegistration: async (missionId: string, reason?: string) => {
    try {
      await missionService.cancelRegistration(missionId, reason);
      set({ 
        userMissions: get().userMissions.filter(id => id !== missionId) 
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  setFilter: (key: keyof MissionFilters, value: any) => {
    set({
      filters: { ...get().filters, [key]: value }
    });
  },
  
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));

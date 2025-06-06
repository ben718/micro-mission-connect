
import { create } from 'zustand';
import type { Mission, MissionFilters } from '../lib/types';
import { supabase } from '../integrations/supabase/client';

interface MissionState {
  missions: Mission[];
  selectedMission: Mission | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchMissions: () => Promise<void>;
  getMissionById: (id: string) => Mission | null;
  applyToMission: (missionId: string, userId: string) => Promise<void>;
  setSelectedMission: (mission: Mission | null) => void;
}

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  selectedMission: null,
  loading: false,
  error: null,

  fetchMissions: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('available_missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ 
        missions: data || [], 
        loading: false 
      });
    } catch (error) {
      console.error('Erreur lors du chargement des missions:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue', 
        loading: false 
      });
    }
  },

  getMissionById: (id: string) => {
    const { missions } = get();
    return missions.find(mission => mission.id === id) || null;
  },

  applyToMission: async (missionId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('mission_registrations')
        .insert({
          mission_id: missionId,
          volunteer_id: userId,
          status: 'pending'
        });

      if (error) throw error;

      // Mettre à jour le store local si nécessaire
      const mission = get().getMissionById(missionId);
      if (mission && mission.spots) {
        mission.spots.taken += 1;
        set({ 
          missions: get().missions.map(m => 
            m.id === missionId ? mission : m
          )
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la mission:', error);
      throw error;
    }
  },

  setSelectedMission: (mission: Mission | null) => {
    set({ selectedMission: mission });
  },
}));

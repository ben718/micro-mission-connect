
import { create } from 'zustand';
import { missionService } from '../lib/supabase';
import type { SupabaseData } from '../lib/mappers';

// Types
interface MissionState {
  missions: SupabaseData[];
  userMissions: SupabaseData[];
  currentMission: SupabaseData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchMissions: () => Promise<SupabaseData[]>;
  fetchUserMissions: () => Promise<SupabaseData[]>;
  fetchMissionById: (id: string) => Promise<SupabaseData | null>;
  registerForMission: (missionId: string) => Promise<{ success: boolean; error?: string }>;
  cancelRegistration: (missionId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  
  // Alias pour compatibilité avec le code existant
  getUserMissions: () => Promise<SupabaseData[]>;
  cancelMissionRegistration: (missionId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

// Store
export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  userMissions: [],
  currentMission: null,
  isLoading: false,
  error: null,
  loading: false, // Alias pour compatibilité
  
  // Fetch all published missions
  fetchMissions: async () => {
    set({ isLoading: true, loading: true, error: null });
    
    try {
      const missions = await missionService.getPublishedMissions();
      set({ missions, isLoading: false, loading: false });
      return missions;
    } catch (error: any) {
      set({ 
        error: error.message || 'Une erreur est survenue lors de la récupération des missions.', 
        isLoading: false,
        loading: false
      });
      return [];
    }
  },
  
  // Fetch user's missions
  fetchUserMissions: async () => {
    set({ isLoading: true, loading: true, error: null });
    
    try {
      const missions = await missionService.getVolunteerMissions();
      set({ userMissions: missions, isLoading: false, loading: false });
      return missions;
    } catch (error: any) {
      set({ 
        error: error.message || 'Une erreur est survenue lors de la récupération de vos missions.', 
        isLoading: false,
        loading: false
      });
      return [];
    }
  },
  
  // Alias pour compatibilité
  getUserMissions: async () => {
    return get().fetchUserMissions();
  },
  
  // Fetch mission by ID
  fetchMissionById: async (id: string) => {
    set({ isLoading: true, loading: true, error: null, currentMission: null });
    
    try {
      const mission = await missionService.getMissionById(id);
      set({ currentMission: mission, isLoading: false, loading: false });
      return mission;
    } catch (error: any) {
      set({ 
        error: error.message || 'Une erreur est survenue lors de la récupération de la mission.', 
        isLoading: false,
        loading: false
      });
      return null;
    }
  },
  
  // Register for a mission
  registerForMission: async (missionId: string) => {
    set({ isLoading: true, loading: true, error: null });
    
    try {
      const result = await missionService.registerForMission(missionId);
      
      if (result.success) {
        // Update mission in the list
        const { missions, currentMission } = get();
        
        // Update missions list
        const updatedMissions = missions.map(mission => {
          if (mission.id === missionId) {
            return {
              ...mission,
              spots_taken: (mission.spots_taken || 0) + 1
            };
          }
          return mission;
        });
        
        // Update current mission if it exists and is the one being registered for
        let updatedCurrentMission = currentMission;
        if (currentMission && currentMission.id === missionId) {
          updatedCurrentMission = {
            ...currentMission,
            spots_taken: (currentMission.spots_taken || 0) + 1
          };
        }
        
        set({ 
          missions: updatedMissions, 
          currentMission: updatedCurrentMission, 
          isLoading: false,
          loading: false
        });
        
        return { success: true };
      } else {
        set({ 
          error: "Échec de l'inscription à la mission.", 
          isLoading: false,
          loading: false
        });
        return { 
          success: false, 
          error: "Échec de l'inscription à la mission."
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || "Une erreur est survenue lors de l'inscription à la mission.";
      set({ error: errorMessage, isLoading: false, loading: false });
      return { success: false, error: errorMessage };
    }
  },
  
  // Cancel registration for a mission
  cancelRegistration: async (missionId: string, reason?: string) => {
    set({ isLoading: true, loading: true, error: null });
    
    try {
      const result = await missionService.cancelRegistration(missionId, reason);
      
      if (result.success) {
        // Update mission in the list
        const { missions, currentMission, userMissions } = get();
        
        // Update missions list
        const updatedMissions = missions.map(mission => {
          if (mission.id === missionId) {
            return {
              ...mission,
              spots_taken: Math.max(0, (mission.spots_taken || 0) - 1)
            };
          }
          return mission;
        });
        
        // Update current mission if it exists and is the one being cancelled
        let updatedCurrentMission = currentMission;
        if (currentMission && currentMission.id === missionId) {
          updatedCurrentMission = {
            ...currentMission,
            spots_taken: Math.max(0, (currentMission.spots_taken || 0) - 1)
          };
        }
        
        // Remove from user missions
        const updatedUserMissions = userMissions.filter(mission => mission.id !== missionId);
        
        set({ 
          missions: updatedMissions, 
          currentMission: updatedCurrentMission,
          userMissions: updatedUserMissions,
          isLoading: false,
          loading: false
        });
        
        return { success: true };
      } else {
        set({ 
          error: "Échec de l'annulation de l'inscription.", 
          isLoading: false,
          loading: false
        });
        return { 
          success: false, 
          error: "Échec de l'annulation de l'inscription."
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || "Une erreur est survenue lors de l'annulation de l'inscription.";
      set({ error: errorMessage, isLoading: false, loading: false });
      return { success: false, error: errorMessage };
    }
  },
  
  // Alias pour compatibilité
  cancelMissionRegistration: async (missionId: string, reason?: string) => {
    return get().cancelRegistration(missionId, reason);
  }
}));

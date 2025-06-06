
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Mission } from '../lib/types';

interface AssociationMissionState {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  
  fetchAssociationMissions: () => Promise<void>;
  createMission: (missionData: Partial<Mission>) => Promise<boolean>;
  updateMission: (id: string, updates: Partial<Mission>) => Promise<boolean>;
  deleteMission: (id: string) => Promise<boolean>;
  publishMission: (id: string) => Promise<boolean>;
  unpublishMission: (id: string) => Promise<boolean>;
  completeMission: (id: string) => Promise<boolean>;
  getMissionVolunteers: (missionId: string) => Promise<any[]>;
  confirmVolunteer: (missionId: string, volunteerId: string) => Promise<boolean>;
  rejectVolunteer: (missionId: string, volunteerId: string) => Promise<boolean>;
}

export const useAssociationMissionStore = create<AssociationMissionState>((set, get) => ({
  missions: [],
  loading: false,
  error: null,
  
  fetchAssociationMissions: async () => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return;
      }
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('association_id', authData.session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        missions: data, 
        loading: false 
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des missions:", error);
      set({ 
        error: "Une erreur est survenue lors de la récupération des missions.", 
        loading: false 
      });
    }
  },
  
  createMission: async (missionData) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      const { data, error } = await supabase
        .from('missions')
        .insert({
          ...missionData,
          association_id: authData.session.user.id,
          spots_taken: 0,
          created_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      set({ 
        missions: [data[0], ...get().missions], 
        loading: false 
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la création de la mission:", error);
      set({ 
        error: "Une erreur est survenue lors de la création de la mission.", 
        loading: false 
      });
      return false;
    }
  },
  
  updateMission: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      const { data, error } = await supabase
        .from('missions')
        .update(updates)
        .eq('id', id)
        .eq('association_id', authData.session.user.id)
        .select();
      
      if (error) throw error;
      
      set({ 
        missions: get().missions.map(mission => 
          mission.id === id ? data[0] : mission
        ), 
        loading: false 
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la mission:", error);
      set({ 
        error: "Une erreur est survenue lors de la mise à jour de la mission.", 
        loading: false 
      });
      return false;
    }
  },
  
  deleteMission: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id)
        .eq('association_id', authData.session.user.id);
      
      if (error) throw error;
      
      set({ 
        missions: get().missions.filter(mission => mission.id !== id), 
        loading: false 
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la mission:", error);
      set({ 
        error: "Une erreur est survenue lors de la suppression de la mission.", 
        loading: false 
      });
      return false;
    }
  },
  
  publishMission: async (id) => {
    return get().updateMission(id, { status: 'published' });
  },
  
  unpublishMission: async (id) => {
    return get().updateMission(id, { status: 'draft' });
  },
  
  completeMission: async (id) => {
    return get().updateMission(id, { status: 'completed' });
  },
  
  getMissionVolunteers: async (missionId) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return [];
      }
      
      // Vérifier que la mission appartient à l'association
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('id')
        .eq('id', missionId)
        .eq('association_id', authData.session.user.id)
        .single();
      
      if (missionError || !missionData) {
        set({ loading: false, error: "Mission non trouvée" });
        return [];
      }
      
      // Récupérer les bénévoles inscrits à la mission
      const { data, error } = await supabase
        .from('mission_registrations')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('mission_id', missionId);
      
      if (error) throw error;
      
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des bénévoles:", error);
      set({ 
        error: "Une erreur est survenue lors de la récupération des bénévoles.", 
        loading: false 
      });
      return [];
    }
  },
  
  confirmVolunteer: async (missionId, volunteerId) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      // Vérifier que la mission appartient à l'association
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('id')
        .eq('id', missionId)
        .eq('association_id', authData.session.user.id)
        .single();
      
      if (missionError || !missionData) {
        set({ loading: false, error: "Mission non trouvée" });
        return false;
      }
      
      // Mettre à jour le statut de l'inscription
      const { error } = await supabase
        .from('mission_registrations')
        .update({ status: 'confirmed' })
        .eq('mission_id', missionId)
        .eq('user_id', volunteerId);
      
      if (error) throw error;
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erreur lors de la confirmation du bénévole:", error);
      set({ 
        error: "Une erreur est survenue lors de la confirmation du bénévole.", 
        loading: false 
      });
      return false;
    }
  },
  
  rejectVolunteer: async (missionId, volunteerId) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      // Vérifier que la mission appartient à l'association
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select('id')
        .eq('id', missionId)
        .eq('association_id', authData.session.user.id)
        .single();
      
      if (missionError || !missionData) {
        set({ loading: false, error: "Mission non trouvée" });
        return false;
      }
      
      // Mettre à jour le statut de l'inscription
      const { error } = await supabase
        .from('mission_registrations')
        .update({ status: 'cancelled' })
        .eq('mission_id', missionId)
        .eq('user_id', volunteerId);
      
      if (error) throw error;
      
      // Mettre à jour le nombre de places prises
      const { error: updateError } = await supabase.rpc('decrement_spots_taken', {
        mission_id: missionId,
      });
      
      if (updateError) throw updateError;
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erreur lors du rejet du bénévole:", error);
      set({ 
        error: "Une erreur est survenue lors du rejet du bénévole.", 
        loading: false 
      });
      return false;
    }
  }
}));

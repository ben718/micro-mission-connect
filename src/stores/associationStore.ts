import { create } from 'zustand';
import { supabase, Association } from '../lib/supabase';

interface AssociationState {
  association: Association | null;
  loading: boolean;
  error: string | null;
  
  fetchAssociationProfile: () => Promise<void>;
  updateAssociationProfile: (updates: Partial<Association>) => Promise<boolean>;
  updateNotificationPreferences: (preferences: any) => Promise<boolean>;
  inviteTeamMember: (email: string, role: string) => Promise<boolean>;
  removeTeamMember: (memberId: string) => Promise<boolean>;
}

export const useAssociationStore = create<AssociationState>((set, get) => ({
  association: null,
  loading: false,
  error: null,
  
  fetchAssociationProfile: async () => {
    set({ loading: true, error: null });
    try {
      // Dans une implémentation réelle, nous récupérerions les données depuis Supabase
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ 
          association: null, 
          loading: false 
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('associations')
        .select('*')
        .eq('id', authData.session.user.id)
        .single();
      
      if (error) throw error;
      
      set({ 
        association: data, 
        loading: false 
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil association:", error);
      set({ 
        error: "Une erreur est survenue lors de la récupération du profil.", 
        loading: false 
      });
    }
  },
  
  updateAssociationProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      const { data, error } = await supabase
        .from('associations')
        .update(updates)
        .eq('id', authData.session.user.id)
        .select();
      
      if (error) throw error;
      
      set({ 
        association: data[0], 
        loading: false 
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      set({ 
        error: "Une erreur est survenue lors de la mise à jour du profil.", 
        loading: false 
      });
      return false;
    }
  },
  
  updateNotificationPreferences: async (preferences) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      const { data, error } = await supabase
        .from('associations')
        .update({
          notification_preferences: preferences
        })
        .eq('id', authData.session.user.id)
        .select();
      
      if (error) throw error;
      
      set({ 
        association: {
          ...get().association!,
          notification_preferences: preferences
        }, 
        loading: false 
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences de notification:", error);
      set({ 
        error: "Une erreur est survenue lors de la mise à jour des préférences.", 
        loading: false 
      });
      return false;
    }
  },
  
  inviteTeamMember: async (email, role) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      // Dans une implémentation réelle, nous enverrions une invitation via Supabase
      const { data, error } = await supabase
        .from('association_members')
        .insert({
          association_id: authData.session.user.id,
          email,
          role,
          status: 'invited'
        });
      
      if (error) throw error;
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'invitation d'un membre:", error);
      set({ 
        error: "Une erreur est survenue lors de l'invitation.", 
        loading: false 
      });
      return false;
    }
  },
  
  removeTeamMember: async (memberId) => {
    set({ loading: true, error: null });
    try {
      const { data: authData } = await supabase.auth.getSession();
      
      if (!authData.session) {
        set({ loading: false, error: "Non authentifié" });
        return false;
      }
      
      const { error } = await supabase
        .from('association_members')
        .delete()
        .eq('id', memberId)
        .eq('association_id', authData.session.user.id);
      
      if (error) throw error;
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression d'un membre:", error);
      set({ 
        error: "Une erreur est survenue lors de la suppression du membre.", 
        loading: false 
      });
      return false;
    }
  }
}));

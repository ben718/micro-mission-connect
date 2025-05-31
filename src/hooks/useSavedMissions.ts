
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSavedMissions = (userId?: string, missionId?: string) => {
  const queryClient = useQueryClient();

  // Vérifier si la mission est sauvegardée
  const { data: isSaved, isLoading } = useQuery({
    queryKey: ['saved-mission', userId, missionId],
    queryFn: async () => {
      if (!userId || !missionId) return false;
      
      const { data, error } = await supabase
        .from('saved_missions')
        .select('id')
        .eq('user_id', userId)
        .eq('mission_id', missionId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!userId && !!missionId,
  });

  // Sauvegarder une mission
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !missionId) throw new Error('Missing user or mission ID');
      
      const { error } = await supabase
        .from('saved_missions')
        .insert([{
          user_id: userId,
          mission_id: missionId
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-mission', userId, missionId] });
      queryClient.invalidateQueries({ queryKey: ['saved-missions', userId] });
      toast.success('Mission sauvegardée');
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  // Supprimer une mission sauvegardée
  const unsaveMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !missionId) throw new Error('Missing user or mission ID');
      
      const { error } = await supabase
        .from('saved_missions')
        .delete()
        .eq('user_id', userId)
        .eq('mission_id', missionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-mission', userId, missionId] });
      queryClient.invalidateQueries({ queryKey: ['saved-missions', userId] });
      toast.success('Mission supprimée des favoris');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    }
  });

  return {
    isSaved,
    isLoading,
    save: saveMutation.mutate,
    unsave: unsaveMutation.mutate,
    isSaveLoading: saveMutation.isPending,
    isUnsaveLoading: unsaveMutation.isPending
  };
};

// Hook pour récupérer toutes les missions sauvegardées
export const useAllSavedMissions = (userId?: string) => {
  return useQuery({
    queryKey: ['saved-missions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('saved_missions')
        .select(`
          mission_id,
          missions (
            id,
            title,
            description,
            start_date,
            location,
            duration_minutes,
            status,
            organization_profiles (
              organization_name,
              logo_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.missions).filter(Boolean);
    },
    enabled: !!userId,
  });
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFollowOrganization = (userId?: string, organizationId?: string) => {
  const queryClient = useQueryClient();

  // Vérifier si l'utilisateur suit déjà cette organisation
  const { data: isFollowing, isLoading } = useQuery({
    queryKey: ['following', userId, organizationId],
    queryFn: async () => {
      if (!userId || !organizationId) return false;
      
      const { data, error } = await supabase
        .from('organization_followers')
        .select('id')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!userId && !!organizationId,
  });

  // Suivre une organisation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !organizationId) throw new Error('Missing user or organization ID');
      
      const { error } = await supabase
        .from('organization_followers')
        .insert([{
          user_id: userId,
          organization_id: organizationId
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', userId, organizationId] });
      queryClient.invalidateQueries({ queryKey: ['followed-organizations', userId] });
      toast.success('Vous suivez maintenant cette association');
    },
    onError: () => {
      toast.error('Erreur lors du suivi de l\'association');
    }
  });

  // Ne plus suivre une organisation
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !organizationId) throw new Error('Missing user or organization ID');
      
      const { error } = await supabase
        .from('organization_followers')
        .delete()
        .eq('user_id', userId)
        .eq('organization_id', organizationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', userId, organizationId] });
      queryClient.invalidateQueries({ queryKey: ['followed-organizations', userId] });
      toast.success('Vous ne suivez plus cette association');
    },
    onError: () => {
      toast.error('Erreur lors de l\'arrêt du suivi');
    }
  });

  return {
    isFollowing,
    isLoading,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowLoading: followMutation.isPending,
    isUnfollowLoading: unfollowMutation.isPending
  };
};

// Hook pour récupérer les organisations suivies
export const useFollowedOrganizations = (userId?: string) => {
  return useQuery({
    queryKey: ['followed-organizations', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('organization_followers')
        .select(`
          organization_id,
          organization_profiles (
            id,
            organization_name,
            logo_url
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return data.map(item => item.organization_profiles).filter(Boolean);
    },
    enabled: !!userId,
  });
};

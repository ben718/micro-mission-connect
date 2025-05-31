
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export interface MissionReview {
  id: string;
  mission_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    profile_picture_url?: string;
  };
  missions?: {
    title: string;
  };
  review_responses?: ReviewResponse[];
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  organization_id: string;
  response_text: string;
  created_at: string;
  organization_profiles?: {
    organization_name: string;
  };
}

export const useMissionReviews = (missionId?: string) => {
  return useQuery({
    queryKey: ['mission-reviews', missionId],
    queryFn: async () => {
      let query = supabase
        .from('mission_reviews')
        .select(`
          *,
          profiles:user_id(first_name, last_name, profile_picture_url),
          missions:mission_id(title),
          review_responses(
            *,
            organization_profiles:organization_id(organization_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (missionId) {
        query = query.eq('mission_id', missionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MissionReview[];
    },
    enabled: !!missionId
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reviewData: {
      mission_id: string;
      rating: number;
      comment?: string;
      is_anonymous?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const dataToInsert = {
        ...reviewData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('mission_reviews')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mission-reviews', variables.mission_id] });
      toast.success('Avis ajouté avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout de l\'avis');
      console.error('Error creating review:', error);
    }
  });
};

export const useCreateReviewResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (responseData: {
      review_id: string;
      organization_id: string;
      response_text: string;
    }) => {
      const { data, error } = await supabase
        .from('review_responses')
        .insert([responseData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-reviews'] });
      toast.success('Réponse ajoutée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'ajout de la réponse');
      console.error('Error creating response:', error);
    }
  });
};

export const useOrganizationReviews = (organizationId?: string) => {
  return useQuery({
    queryKey: ['organization-reviews', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from('mission_reviews')
        .select(`
          *,
          profiles:user_id(first_name, last_name, profile_picture_url),
          missions:mission_id(title, organization_id),
          review_responses(
            *,
            organization_profiles:organization_id(organization_name)
          )
        `)
        .eq('missions.organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MissionReview[];
    },
    enabled: !!organizationId
  });
};

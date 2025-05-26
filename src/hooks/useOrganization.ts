import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/types/mission';
import { OrganizationProfile } from '@/types/profile';
import { Database } from '@/integrations/supabase/types';

type MissionRow = Database["public"]["Tables"]["missions"]["Row"];

export const useOrganization = (organizationId?: string) => {
  const queryClient = useQueryClient();

  const { data: organization, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      const { data, error } = await supabase
        .from('organization_profiles')
        .select(`
          *,
          sectors!sector_id (
            id,
            name,
            description
          )
        `)
        .eq('id', organizationId)
        .single();
      
      if (error) throw error;
      return data as OrganizationProfile;
    },
    enabled: !!organizationId,
  });

  const { data: missions, isLoading: isLoadingMissions } = useQuery({
    queryKey: ['organization-missions', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          mission_skills(
            skill:skill_id(name)
          ),
          mission_registrations(count)
        `)
        .eq('organization_id', organizationId);
      
      if (error) throw error;
      
      return data.map(mission => ({
        ...mission,
        required_skills: mission.mission_skills?.map((ms: any) => ms.skill?.name).filter(Boolean) || [],
        participants_count: mission.mission_registrations?.length || 0,
        organization: organization || {} as OrganizationProfile
      })) as MissionRow[];
    },
    enabled: !!organizationId,
  });

  const updateMissionStatusMutation = useMutation({
    mutationFn: async ({ missionId, status }: { missionId: string; status: string }) => {
      const { error } = await supabase
        .from('missions')
        .update({ status })
        .eq('id', missionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-missions', organizationId] });
    }
  });

  const createMissionsMutation = useMutation({
    mutationFn: async (missionsData: Omit<MissionRow, 'id'>[]) => {
      const { data, error } = await supabase
        .from('missions')
        .insert(missionsData.map(mission => ({
          title: mission.title,
          description: mission.description,
          organization_id: mission.organization_id,
          start_date: mission.start_date,
          duration_minutes: mission.duration_minutes,
          available_spots: mission.available_spots || 1,
          format: mission.format || 'présentiel',
          difficulty_level: mission.difficulty_level || 'débutant',
          engagement_level: mission.engagement_level || 'petit coup de main'
        })))
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-missions', organizationId] });
    }
  });

  return {
    organization,
    missions,
    isLoading: isLoadingOrganization || isLoadingMissions,
    updateMissionStatus: updateMissionStatusMutation,
    createMissions: createMissionsMutation
  };
};

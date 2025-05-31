
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color_class: string;
  display_order: number;
}

export function usePlatformFeatures() {
  return useQuery({
    queryKey: ['platform-features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_platform_features');

      if (error) {
        console.error('Error fetching platform features:', error);
        throw error;
      }

      return data as PlatformFeature[];
    },
  });
}

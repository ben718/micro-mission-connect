
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
        .from('platform_features')
        .select('id, title, description, icon_name, color_class, display_order')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching platform features:', error);
        throw error;
      }

      return data as PlatformFeature[];
    },
  });
}

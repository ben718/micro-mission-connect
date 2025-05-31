
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  avatar_url: string | null;
  display_order: number;
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_testimonials');

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      return data as Testimonial[];
    },
  });
}

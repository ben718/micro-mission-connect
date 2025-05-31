
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
        .from('testimonials')
        .select('id, quote, author_name, author_role, avatar_url, display_order')
        .eq('is_visible', true)
        .not('quote', 'is', null)
        .not('author_name', 'is', null)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      return data as Testimonial[];
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  requirements: string;
  created_at: string;
  updated_at: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  acquisition_date: string;
  badge: Badge;
}

export const useBadges = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: badges, isLoading } = useQuery({
    queryKey: ["badges", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badge_id (
            id,
            name,
            description,
            image_url,
            requirements,
            created_at,
            updated_at
          )
        `)
        .eq("user_id", userId)
        .order("acquisition_date", { ascending: false });

      if (error) throw error;
      return data as UserBadge[];
    },
    enabled: !!userId,
  });

  const { data: availableBadges } = useQuery({
    queryKey: ["available-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Badge[];
    },
  });

  const checkAndAwardBadges = useMutation({
    mutationFn: async () => {
      if (!userId) return;

      // Vérifier les critères pour chaque badge disponible
      for (const badge of availableBadges || []) {
        const { data: existingBadge } = await supabase
          .from("user_badges")
          .select("id")
          .eq("user_id", userId)
          .eq("badge_id", badge.id)
          .single();

        if (!existingBadge) {
          // Vérifier les critères spécifiques pour chaque badge
          let shouldAward = false;

          switch (badge.name) {
            case "Bénévole engagé":
              const { count } = await supabase
                .from("mission_registrations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("status", "terminé");
              shouldAward = (count || 0) >= 5;
              break;

            case "Bénévole expert":
              const { count: expertCount } = await supabase
                .from("mission_registrations")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("status", "terminé");
              shouldAward = (expertCount || 0) >= 10;
              break;

            // Ajouter d'autres cas selon les badges disponibles
          }

          if (shouldAward) {
            await supabase
              .from("user_badges")
              .insert({
                user_id: userId,
                badge_id: badge.id,
                acquisition_date: new Date().toISOString(),
              });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges", userId] });
    },
  });

  return {
    badges,
    availableBadges,
    isLoading,
    checkAndAwardBadges,
  };
}; 
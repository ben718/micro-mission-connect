import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSkills() {
  const queryClient = useQueryClient();

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    }
  });

  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery({
    queryKey: ["userSkills"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("user_skills")
        .select(`
          *,
          skill:skills(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { mutate: addUserSkill, isPending: isAddingSkill } = useMutation({
    mutationFn: async ({ skillId, level }: { skillId: string; level: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase.from("user_skills").insert({
        user_id: user.id,
        skill_id: skillId,
        level
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSkills"] });
    }
  });

  const { mutate: updateUserSkill, isPending: isUpdatingSkill } = useMutation({
    mutationFn: async ({ skillId, level }: { skillId: string; level: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("user_skills")
        .update({ level })
        .eq("user_id", user.id)
        .eq("skill_id", skillId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSkills"] });
    }
  });

  const { mutate: removeUserSkill, isPending: isRemovingSkill } = useMutation({
    mutationFn: async (skillId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("user_skills")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", skillId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSkills"] });
    }
  });

  return {
    skills,
    userSkills,
    isLoadingSkills,
    isLoadingUserSkills,
    addUserSkill,
    updateUserSkill,
    removeUserSkill,
    isAddingSkill,
    isUpdatingSkill,
    isRemovingSkill
  };
}

export function useBadges() {
  const { data: badges, isLoading: isLoadingBadges } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    }
  });

  const { data: userBadges, isLoading: isLoadingUserBadges } = useQuery({
    queryKey: ["userBadges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badges(*)
        `)
        .eq("user_id", user.id)
        .order("acquisition_date", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return {
    badges,
    userBadges,
    isLoadingBadges,
    isLoadingUserBadges
  };
} 

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrganizationSector, MissionType, Skill } from "@/types";

export const useOrganizationSectors = () => {
  return useQuery({
    queryKey: ["organization-sectors"],
    queryFn: async (): Promise<OrganizationSector[]> => {
      const { data, error } = await supabase
        .from("organization_sectors")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useMissionTypes = () => {
  return useQuery({
    queryKey: ["mission-types"],
    queryFn: async (): Promise<MissionType[]> => {
      const { data, error } = await supabase
        .from("mission_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    },
  });
};

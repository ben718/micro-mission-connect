import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMissionTypes } from "./useMissionTypes";
import { useOrganizationSectors } from "./useOrganizationSectors";
import { useSkillCategories } from "./useSkillCategories";

export const useMissionFilters = () => {
  // Récupérer les types de missions
  const { data: missionTypes } = useMissionTypes();
  
  // Récupérer les secteurs d'organisation
  const { data: organizationSectors } = useOrganizationSectors();
  
  // Récupérer les catégories de compétences
  const { data: skillCategories } = useSkillCategories();

  // Récupérer les formats disponibles
  const { data: formats } = useQuery({
    queryKey: ["mission-formats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("format")
        .not("format", "is", null);

      if (error) throw error;
      return [...new Set(data.map(m => m.format))];
    },
  });

  // Récupérer les niveaux de difficulté disponibles
  const { data: difficultyLevels } = useQuery({
    queryKey: ["mission-difficulty-levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("difficulty_level")
        .not("difficulty_level", "is", null);

      if (error) throw error;
      return [...new Set(data.map(m => m.difficulty_level))];
    },
  });

  // Récupérer les niveaux d'engagement disponibles
  const { data: engagementLevels } = useQuery({
    queryKey: ["mission-engagement-levels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("engagement_level")
        .not("engagement_level", "is", null);

      if (error) throw error;
      return [...new Set(data.map(m => m.engagement_level))];
    },
  });

  // Récupérer les statuts disponibles
  const { data: statuses } = useQuery({
    queryKey: ["mission-statuses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("status")
        .not("status", "is", null);

      if (error) throw error;
      return [...new Set(data.map(m => m.status))];
    },
  });

  return {
    missionTypes,
    organizationSectors,
    skillCategories,
    formats,
    difficultyLevels,
    engagementLevels,
    statuses,
    isLoading: false, // À implémenter si nécessaire
  };
}; 
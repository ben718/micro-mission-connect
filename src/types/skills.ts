import { Database } from "@/integrations/supabase/types";

export type Skill = Database["public"]["Tables"]["skills"]["Row"];

// Le type SkillCategory sera déterminé dynamiquement depuis la base de données
export type SkillCategory = string;

export type UserSkill = Database["public"]["Tables"]["user_skills"]["Row"] & {
  skill?: Skill;
};

export type SkillWithLevel = Skill & {
  level: number;
  is_required: boolean;
};

// Types pour les filtres de recherche de compétences
export type SkillFilters = {
  query?: string;
  category?: SkillCategory;
  level?: number;
}; 
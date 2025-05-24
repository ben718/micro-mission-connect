
import { Database } from "@/integrations/supabase/types";

// Use Supabase generated types as a base
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Mission = Database['public']['Tables']['missions']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type MissionParticipant = Database['public']['Tables']['mission_participants']['Row'];

// Add any custom types here
export type MissionWithCategories = Mission & {
  categories: Category[];
};

export type ProfileWithBadges = Profile & {
  badges: Badge[];
};


import { Database } from "@/integrations/supabase/types";

// Use Supabase generated types as a base
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Mission = Database['public']['Tables']['missions']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type MissionRegistration = Database['public']['Tables']['mission_registrations']['Row'];

// Add any custom types here
export type MissionWithCategories = Mission & {
  mission_type?: Database['public']['Tables']['mission_types']['Row'];
};

export type ProfileWithBadges = Profile & {
  badges: Database['public']['Tables']['user_badges']['Row'][];
};

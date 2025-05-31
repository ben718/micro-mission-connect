
import { Database } from "@/integrations/supabase/types";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"] & {
  is_read: boolean;
  content: string;
  link_url?: string;
};

export type NotificationType = 
  | "inscription"
  | "annulation"
  | "annulation_organisation"
  | "confirmation"
  | "reminder"
  | "badge"
  | "skill_validation"
  | "mission_update"
  | "mission_cancelled"
  | "mission_completed"
  | "no_show";

export type NotificationWithDetails = Notification & {
  related_entity?: {
    id: string;
    type: "mission" | "badge" | "skill" | "user";
    name?: string;
  };
  source?: "user" | "organization" | "system";
};

// Types pour les filtres de notifications
export type NotificationFilters = {
  is_read?: boolean;
  type?: NotificationType;
  start_date?: Date;
  end_date?: Date;
  source?: "user" | "organization" | "system";
};

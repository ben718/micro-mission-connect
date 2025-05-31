
import { Database } from "@/integrations/supabase/types";

export type Notification = Database["public"]["Tables"]["notifications"]["Row"] & {
  is_read: boolean;
  content: string;
  link_url?: string;
};

export type NotificationType = 
  | "inscription"
  | "annulation"
  | "confirmation"
  | "reminder"
  | "badge"
  | "skill_validation"
  | "mission_update";

export type NotificationWithDetails = Notification & {
  type: NotificationType;
  related_entity?: {
    id: string;
    type: "mission" | "badge" | "skill" | "user";
    name?: string;
  };
};

// Types pour les filtres de notifications
export type NotificationFilters = {
  is_read?: boolean;
  type?: NotificationType;
  start_date?: Date;
  end_date?: Date;
};

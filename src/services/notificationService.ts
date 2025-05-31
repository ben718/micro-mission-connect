import { supabase } from "@/integrations/supabase/client";

export type NotificationType = 
  | "inscription"
  | "annulation"
  | "confirmation"
  | "reminder"
  | "badge"
  | "skill_validation"
  | "mission_update";

export interface NotificationWithDetails {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  link_url?: string;
}

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async createNotification(
    userId: string,
    title: string,
    content: string,
    linkUrl?: string
  ): Promise<boolean> {
    try {
      // Vérifier que l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("Impossible de créer une notification: utilisateur non connecté");
        return false;
      }

      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          title,
          content,
          link_url: linkUrl,
          is_read: false,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error("Erreur lors de la création de notification:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la création de notification:", error);
      return false;
    }
  }

  async notifyMissionRegistration(userId: string, missionTitle: string, missionId: string): Promise<void> {
    try {
      await this.createNotification(
        userId,
        "Inscription confirmée",
        `Vous êtes inscrit(e) à la mission "${missionTitle}"`,
        `/missions/${missionId}`
      );
    } catch (error) {
      console.error("Erreur lors de la notification d'inscription:", error);
    }
  }

  async notifyMissionCancellation(userId: string, missionTitle: string): Promise<void> {
    try {
      await this.createNotification(
        userId,
        "Inscription annulée",
        `Votre inscription à la mission "${missionTitle}" a été annulée`
      );
    } catch (error) {
      console.error("Erreur lors de la notification d'annulation:", error);
    }
  }

  async notifyMissionConfirmation(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "Participation confirmée",
      `Votre participation à "${missionTitle}" a été confirmée`,
      `/missions/${missionId}`
    );
  }

  async notifyMissionReminder(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "Rappel de mission",
      `Rappel: La mission "${missionTitle}" commence bientôt`,
      `/missions/${missionId}`
    );
  }

  async notifyBadgeEarned(userId: string, badgeName: string): Promise<void> {
    await this.createNotification(
      userId,
      "Nouveau badge",
      `Félicitations ! Vous avez obtenu le badge "${badgeName}"`,
      `/profile`
    );
  }

  async notifySkillValidation(userId: string, skillName: string): Promise<void> {
    await this.createNotification(
      userId,
      "Compétence validée",
      `Votre compétence "${skillName}" a été validée`,
      `/profile`
    );
  }

  async notifyMissionUpdate(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "Mission mise à jour",
      `La mission "${missionTitle}" a été mise à jour`,
      `/missions/${missionId}`
    );
  }
  
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      return !error;
    } catch (error) {
      console.error("Erreur lors du marquage de notification:", error);
      return false;
    }
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      return !error;
    } catch (error) {
      console.error("Erreur lors du marquage de toutes les notifications:", error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      return !error;
    } catch (error) {
      console.error("Erreur lors de la suppression de notification:", error);
      return false;
    }
  }

  async deleteAllNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      return !error;
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes les notifications:", error);
      return false;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      return error ? 0 : count || 0;
    } catch (error) {
      console.error("Erreur lors du comptage des notifications:", error);
      return 0;
    }
  }

  async getUserNotifications(userId: string, limit: number = 20): Promise<NotificationWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data as NotificationWithDetails[];
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  }
}

export const notificationService = NotificationService.getInstance();

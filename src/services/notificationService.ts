
import { supabase } from "@/integrations/supabase/client";
import { NotificationWithDetails, NotificationType } from "@/types/notifications";

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
    type: NotificationType,
    content: string,
    linkUrl?: string,
    relatedEntityId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type,
          content,
          link_url: linkUrl,
          related_entity_id: relatedEntityId,
          is_read: false,
          created_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error("Erreur lors de la création de notification:", error);
      return false;
    }
  }

  async notifyMissionRegistration(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "inscription",
      `Vous êtes inscrit(e) à la mission "${missionTitle}"`,
      `/missions/${missionId}`,
      missionId
    );
  }

  async notifyMissionCancellation(userId: string, missionTitle: string): Promise<void> {
    await this.createNotification(
      userId,
      "annulation",
      `La mission "${missionTitle}" a été annulée`,
      undefined,
      undefined
    );
  }

  async notifyMissionConfirmation(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "confirmation",
      `Votre participation à "${missionTitle}" a été confirmée`,
      `/missions/${missionId}`,
      missionId
    );
  }

  async notifyMissionReminder(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "reminder",
      `Rappel: La mission "${missionTitle}" commence bientôt`,
      `/missions/${missionId}`,
      missionId
    );
  }

  async notifyBadgeEarned(userId: string, badgeName: string, badgeId: string): Promise<void> {
    await this.createNotification(
      userId,
      "badge",
      `Félicitations ! Vous avez obtenu le badge "${badgeName}"`,
      `/profile`,
      badgeId
    );
  }

  async notifySkillValidation(userId: string, skillName: string, skillId: string): Promise<void> {
    await this.createNotification(
      userId,
      "skill_validation",
      `Votre compétence "${skillName}" a été validée`,
      `/profile`,
      skillId
    );
  }

  async notifyMissionUpdate(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "mission_update",
      `La mission "${missionTitle}" a été mise à jour`,
      `/missions/${missionId}`,
      missionId
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

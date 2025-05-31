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
        "✅ Inscription confirmée",
        `Votre inscription à la mission "${missionTitle}" a été enregistrée avec succès. L'organisation va examiner votre candidature et vous recevrez une confirmation prochainement.`,
        `/missions/${missionId}`
      );
    } catch (error) {
      console.error("Erreur lors de la notification d'inscription:", error);
    }
  }

  async notifyMissionCancellation(userId: string, missionTitle: string, cancelledByUser: boolean = true): Promise<void> {
    try {
      if (cancelledByUser) {
        await this.createNotification(
          userId,
          "❌ Vous avez annulé votre inscription",
          `Vous avez annulé votre inscription à la mission "${missionTitle}". Vous pouvez vous réinscrire à tout moment si des places sont disponibles et si vous n'avez pas atteint la limite d'annulations (2 maximum).`
        );
      } else {
        await this.createNotification(
          userId,
          "❌ Inscription annulée par l'organisation",
          `L'organisation a annulé votre inscription à la mission "${missionTitle}". Cela peut être dû à un changement dans les besoins ou les critères de la mission. Cette annulation ne compte pas dans votre limite personnelle.`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la notification d'annulation:", error);
    }
  }

  async notifyMissionConfirmation(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "🎉 Participation confirmée par l'organisation",
      `Excellente nouvelle ! L'organisation a validé votre participation à la mission "${missionTitle}". Vous recevrez bientôt les détails pratiques (lieu exact, horaires, contact, matériel nécessaire...). Rendez-vous le jour J !`,
      `/missions/${missionId}`
    );
  }

  async notifyMissionReminder(userId: string, missionTitle: string, missionId: string, startDate: string): Promise<void> {
    const formattedDate = new Date(startDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    await this.createNotification(
      userId,
      "⏰ Rappel : Mission dans 24h",
      `N'oubliez pas votre mission "${missionTitle}" qui commence demain le ${formattedDate}. Vérifiez l'adresse, préparez le matériel demandé et soyez ponctuel ! En cas d'empêchement de dernière minute, contactez rapidement l'organisation.`,
      `/missions/${missionId}`
    );
  }

  async notifyBadgeEarned(userId: string, badgeName: string): Promise<void> {
    await this.createNotification(
      userId,
      "🏆 Nouveau badge débloqué !",
      `Félicitations ! Vous venez de débloquer le badge "${badgeName}" grâce à votre engagement exceptionnel. Ce badge reconnaît vos compétences et votre contribution à la communauté. Continuez comme ça !`,
      `/profile`
    );
  }

  async notifySkillValidation(userId: string, skillName: string, validatorName?: string): Promise<void> {
    const validatorText = validatorName ? ` par ${validatorName}` : " par un superviseur";
    await this.createNotification(
      userId,
      "✨ Compétence officiellement validée",
      `Excellente nouvelle ! Votre compétence "${skillName}" a été officiellement validée${validatorText}. Cette validation enrichit votre profil et vous donnera accès à plus de missions correspondant à vos talents.`,
      `/profile`
    );
  }

  async notifyMissionUpdate(userId: string, missionTitle: string, missionId: string, updateType: string): Promise<void> {
    const updateMessages = {
      'date': 'Les dates et horaires ont été modifiés',
      'location': 'Le lieu de rendez-vous a changé',
      'description': 'La description et les tâches ont été enrichies',
      'requirements': 'Les prérequis et compétences demandées ont été précisés',
      'general': 'Des informations importantes ont été mises à jour'
    };

    const message = updateMessages[updateType as keyof typeof updateMessages] || updateMessages.general;

    await this.createNotification(
      userId,
      "📝 Mission modifiée - Action requise",
      `La mission "${missionTitle}" a été mise à jour : ${message}. Consultez les nouveaux détails pour vous assurer que vous pouvez toujours participer. Si les changements vous posent problème, contactez l'organisation.`,
      `/missions/${missionId}`
    );
  }

  async notifyMissionCancelledByOrganization(userId: string, missionTitle: string, reason?: string): Promise<void> {
    const reasonText = reason ? ` Motif communiqué : ${reason}` : '';
    await this.createNotification(
      userId,
      "🚫 Mission annulée par l'organisation",
      `Nous sommes désolés de vous informer que la mission "${missionTitle}" a été annulée par l'organisation.${reasonText} Cette annulation ne compte pas dans votre limite personnelle d'annulations. Nous vous préviendrons dès qu'il y aura de nouvelles opportunités similaires.`
    );
  }

  async notifyMissionSpotAvailable(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "🎯 Place disponible - Opportunité !",
      `Bonne nouvelle ! Une place s'est libérée pour la mission "${missionTitle}" qui correspond à votre profil. Cette mission vous intéresse ? Inscrivez-vous rapidement car les places se remplissent vite !`,
      `/missions/${missionId}`
    );
  }

  async notifyRegistrationRejected(userId: string, missionTitle: string, reason?: string): Promise<void> {
    const reasonText = reason ? ` Motif : ${reason}` : '';
    await this.createNotification(
      userId,
      "❌ Inscription non retenue",
      `Votre inscription à la mission "${missionTitle}" n'a pas été retenue par l'organisation.${reasonText} Ce n'est pas un reflet de vos compétences, mais plutôt des besoins spécifiques de cette mission. Continuez à postuler, d'autres opportunités vous attendent !`
    );
  }

  async notifyMissionCompleted(userId: string, missionTitle: string, missionId: string): Promise<void> {
    await this.createNotification(
      userId,
      "🎉 Mission accomplie avec succès !",
      `Bravo ! Vous avez terminé la mission "${missionTitle}" avec succès. Votre contribution fait une vraie différence. Vous pouvez maintenant laisser un avis sur cette expérience et découvrir de nouvelles missions.`,
      `/missions/${missionId}`
    );
  }

  async notifyNoShow(userId: string, missionTitle: string): Promise<void> {
    await this.createNotification(
      userId,
      "⚠️ Absence signalée",
      `Vous avez été marqué(e) comme absent(e) à la mission "${missionTitle}". Si c'est une erreur ou si vous avez eu un empêchement, contactez rapidement l'organisation pour clarifier la situation. Les absences répétées peuvent affecter votre accès aux futures missions.`
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

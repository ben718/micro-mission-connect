import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  link_url: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des notifications:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la notification:", error);
      setError(error.message);
      toast.error("Erreur lors de la mise à jour de la notification");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);

      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des notifications:", error);
      setError(error.message);
      toast.error("Erreur lors de la mise à jour des notifications");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
      setUnreadCount(prev =>
        Math.max(0, prev - (notifications.find(n => n.id === notificationId)?.is_read ? 0 : 1))
      );

      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la notification:", error);
      setError(error.message);
      toast.error("Erreur lors de la suppression de la notification");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAllNotifications = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);

      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la suppression des notifications:", error);
      setError(error.message);
      toast.error("Erreur lors de la suppression des notifications");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        payload => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info(newNotification.title, {
            description: newNotification.content,
            action: {
              label: "Voir",
              onClick: () => window.location.href = newNotification.link_url,
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
}; 
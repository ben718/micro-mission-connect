
import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  link_url?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      // Simuler un appel API
      setNotifications([]);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setIsMarkingAsRead(true);
    try {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      setError('Erreur lors du marquage');
    } finally {
      setIsMarkingAsRead(false);
    }
  }, []);

  const markAllAsRead = useCallback(async (userId: string) => {
    setIsMarkingAllAsRead(true);
    try {
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      setError('Erreur lors du marquage');
    } finally {
      setIsMarkingAllAsRead(false);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setIsDeleting(true);
    try {
      setNotifications(prev =>
        prev.filter(n => n.id !== notificationId)
      );
    } catch (err) {
      setError('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const deleteAllNotifications = useCallback(async (userId: string) => {
    setIsDeletingAll(true);
    try {
      setNotifications([]);
    } catch (err) {
      setError('Erreur lors de la suppression');
    } finally {
      setIsDeletingAll(false);
    }
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
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
    isDeletingAll
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
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
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Add missing properties
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const fetchNotifications = async (userId: string) => {
    try {
      setLoading(true);
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setIsMarkingAsRead(true);
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const markAllAsRead = async (userId: string) => {
    try {
      setIsMarkingAllAsRead(true);
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAllNotifications = async (userId: string) => {
    try {
      setIsDeletingAll(true);
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeletingAll(false);
    }
  };

  return {
    notifications,
    loading,
    isLoading,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
    isDeletingAll,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};

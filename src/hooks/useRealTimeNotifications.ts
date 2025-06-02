import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Types pour les notifications
interface Notification {
  id: string;
  type: 'mission_match' | 'mission_urgent' | 'mission_reminder' | 'mission_update' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
  email: boolean;
  types: {
    mission_match: boolean;
    mission_urgent: boolean;
    mission_reminder: boolean;
    mission_update: boolean;
    system: boolean;
  };
}

// Hook pour les notifications temps réel
export const useRealTimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true,
    email: false,
    types: {
      mission_match: true,
      mission_urgent: true,
      mission_reminder: true,
      mission_update: true,
      system: true
    }
  });

  // Demander la permission pour les notifications desktop
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Afficher une notification desktop
  const showDesktopNotification = useCallback((notification: Notification) => {
    if (!settings.desktop || !settings.enabled) return;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      const desktopNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high',
        silent: !settings.sound
      });

      desktopNotif.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        desktopNotif.close();
      };

      // Auto-fermer après 5 secondes sauf pour les notifications haute priorité
      if (notification.priority !== 'high') {
        setTimeout(() => desktopNotif.close(), 5000);
      }
    }
  }, [settings]);

  // Jouer un son de notification
  const playNotificationSound = useCallback((priority: 'low' | 'medium' | 'high') => {
    if (!settings.sound || !settings.enabled) return;

    // Créer un son basé sur la priorité
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Fréquences différentes selon la priorité
    const frequencies = {
      low: 400,
      medium: 600,
      high: 800
    };

    oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [settings]);

  // Vibration pour mobile
  const triggerVibration = useCallback((priority: 'low' | 'medium' | 'high') => {
    if (!settings.vibration || !settings.enabled) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        low: [100],
        medium: [100, 50, 100],
        high: [200, 100, 200, 100, 200]
      };
      navigator.vibrate(patterns[priority]);
    }
  }, [settings]);

  // Ajouter une nouvelle notification
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!settings.enabled || !settings.types[notificationData.type]) return;

    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Déclencher les effets de notification
    showDesktopNotification(notification);
    playNotificationSound(notification.priority);
    triggerVibration(notification.priority);

    return notification.id;
  }, [settings, showDesktopNotification, playNotificationSound, triggerVibration]);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(notif => notif.id !== notificationId);
    });
  }, []);

  // Supprimer toutes les notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Mettre à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Simuler des notifications de test (pour le développement)
  const sendTestNotifications = useCallback(() => {
    const testNotifications = [
      {
        type: 'mission_match' as const,
        title: 'Nouvelle mission trouvée !',
        message: 'Une mission "Distribution alimentaire" correspond à vos critères à 800m',
        priority: 'medium' as const,
        actionUrl: '/missions/1',
        actionLabel: 'Voir la mission'
      },
      {
        type: 'mission_urgent' as const,
        title: 'Mission urgente !',
        message: 'Aide nécessaire immédiatement pour une distribution alimentaire',
        priority: 'high' as const,
        actionUrl: '/missions/urgent',
        actionLabel: 'Aider maintenant'
      },
      {
        type: 'mission_reminder' as const,
        title: 'Rappel de mission',
        message: 'Votre mission "Accompagnement personnes âgées" commence dans 30 minutes',
        priority: 'medium' as const,
        actionUrl: '/dashboard',
        actionLabel: 'Voir mes missions'
      }
    ];

    testNotifications.forEach((notif, index) => {
      setTimeout(() => addNotification(notif), index * 2000);
    });
  }, [addNotification]);

  // Initialisation des permissions
  useEffect(() => {
    if (settings.desktop) {
      requestNotificationPermission();
    }
  }, [settings.desktop, requestNotificationPermission]);

  // Simulation de notifications en temps réel (WebSocket en production)
  useEffect(() => {
    if (!user || !settings.enabled) return;

    // Simuler des notifications périodiques pour la démo
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'mission_match' as const,
          title: 'Nouvelle mission disponible',
          message: 'Une mission correspond à vos préférences près de chez vous',
          priority: 'medium' as const,
          actionUrl: '/map',
          actionLabel: 'Voir sur la carte'
        },
        {
          type: 'mission_urgent' as const,
          title: 'Aide urgente demandée',
          message: 'Une association a besoin d\'aide immédiatement',
          priority: 'high' as const,
          actionUrl: '/missions',
          actionLabel: 'Aider maintenant'
        }
      ];

      // 20% de chance de recevoir une notification toutes les 2 minutes
      if (Math.random() < 0.2) {
        const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        addNotification(randomNotif);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [user, settings.enabled, addNotification]);

  return {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    requestNotificationPermission,
    sendTestNotifications
  };
};


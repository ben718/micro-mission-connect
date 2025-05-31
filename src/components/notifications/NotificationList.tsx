
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const NotificationList: React.FC = () => {
  const { user } = useAuth();
  const {
    notifications,
    isLoading,
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
  } = useNotifications(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id, fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      markAllAsRead(user.id);
    }
  };

  const handleDeleteAll = async () => {
    if (user?.id) {
      deleteAllNotifications(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Chargement des notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Erreur lors du chargement des notifications: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </h2>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllAsRead || unreadCount === 0}
            >
              {isMarkingAllAsRead ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-1" />
              )}
              Tout marquer lu
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
            >
              {isDeletingAll ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Tout supprimer
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune notification</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.is_read ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.is_read && (
                        <Badge variant="destructive" className="text-xs">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                      {notification.link_url && (
                        <Link
                          to={notification.link_url}
                          className="text-blue-600 hover:underline"
                        >
                          Voir détails
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={isMarkingAsRead}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNotification(notification.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;

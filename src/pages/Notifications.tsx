
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { user } = useAuth();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  } = useNotifications(user?.id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-bleu" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => user && markAllAsRead(user.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          
          {notifications.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => user && deleteAllNotifications(user.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BellOff className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-600">
              Vous n'avez aucune notification pour le moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.is_read ? 'border-l-4 border-l-bleu bg-blue-50/30' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <Badge variant="default" className="text-xs bg-bleu">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">
                      {notification.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {format(new Date(notification.created_at), 'PPP à p', { locale: fr })}
                      </span>
                      
                      {notification.link_url && (
                        <Link
                          to={notification.link_url}
                          className="text-bleu hover:underline"
                        >
                          Voir détails
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
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

export default NotificationsPage;

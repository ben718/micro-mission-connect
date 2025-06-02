import React, { useState } from 'react';
import { Bell, X, Settings, Check, CheckCheck, Trash2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composant pour une notification individuelle
const NotificationItem: React.FC<{
  notification: any;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}> = ({ notification, onMarkAsRead, onRemove }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mission_match':
        return '🎯';
      case 'mission_urgent':
        return '🚨';
      case 'mission_reminder':
        return '⏰';
      case 'mission_update':
        return '📝';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
      notification.read ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
              {notification.message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: fr })}
              </span>
              {notification.actionUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = notification.actionUrl}
                >
                  {notification.actionLabel || 'Voir'}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="h-8 w-8 p-0"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(notification.id)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Composant principal du centre de notifications
const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    sendTestNotifications
  } = useRealTimeNotifications();

  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* Bouton de notifications dans le header */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:w-96 p-0">
          <SheetHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  {unreadCount > 0 
                    ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                    : 'Aucune nouvelle notification'
                  }
                </SheetDescription>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={markAllAsRead} disabled={unreadCount === 0}>
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Tout marquer comme lu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearAllNotifications} disabled={notifications.length === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer tout
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={sendTestNotifications}>
                    <Bell className="w-4 h-4 mr-2" />
                    Test notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetHeader>

          <Separator />

          {/* Liste des notifications */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-sm">Aucune notification</p>
                <p className="text-xs mt-1">Vous serez alerté des nouvelles missions</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Modal des paramètres */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Paramètres de notifications</SheetTitle>
            <SheetDescription>
              Configurez vos préférences de notifications
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Activation générale */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Activer les notifications</label>
                    <p className="text-xs text-gray-500">Recevoir toutes les notifications</p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => updateSettings({ enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Types de notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Types de notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Missions correspondantes</label>
                    <p className="text-xs text-gray-500">Nouvelles missions qui vous correspondent</p>
                  </div>
                  <Switch
                    checked={settings.types.mission_match}
                    onCheckedChange={(checked) => 
                      updateSettings({ types: { ...settings.types, mission_match: checked } })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Missions urgentes</label>
                    <p className="text-xs text-gray-500">Aide nécessaire immédiatement</p>
                  </div>
                  <Switch
                    checked={settings.types.mission_urgent}
                    onCheckedChange={(checked) => 
                      updateSettings({ types: { ...settings.types, mission_urgent: checked } })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Rappels de missions</label>
                    <p className="text-xs text-gray-500">Rappels pour vos missions planifiées</p>
                  </div>
                  <Switch
                    checked={settings.types.mission_reminder}
                    onCheckedChange={(checked) => 
                      updateSettings({ types: { ...settings.types, mission_reminder: checked } })
                    }
                    disabled={!settings.enabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Méthodes de notification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Méthodes de notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <div>
                      <label className="text-sm font-medium">Son</label>
                      <p className="text-xs text-gray-500">Jouer un son</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => updateSettings({ sound: checked })}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Vibration</label>
                    <p className="text-xs text-gray-500">Vibrer sur mobile</p>
                  </div>
                  <Switch
                    checked={settings.vibration}
                    onCheckedChange={(checked) => updateSettings({ vibration: checked })}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Notifications desktop</label>
                    <p className="text-xs text-gray-500">Afficher sur le bureau</p>
                  </div>
                  <Switch
                    checked={settings.desktop}
                    onCheckedChange={(checked) => updateSettings({ desktop: checked })}
                    disabled={!settings.enabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NotificationCenter;


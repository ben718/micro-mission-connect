import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export function NotificationList() {
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting,
    isDeletingAll
  } = useNotifications();

  if (isLoading) {
    return <div>Chargement des notifications...</div>;
  }

  if (!notifications?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune notification</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllAsRead}
          >
            <Check className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteAllNotifications()}
            disabled={isDeletingAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Tout supprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.is_read ? "bg-background" : "bg-muted"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), "PPp", {
                        locale: fr
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        disabled={isMarkingAsRead}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {notification.link_url && (
                  <Link
                    to={notification.link_url}
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Voir plus
                  </Link>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 
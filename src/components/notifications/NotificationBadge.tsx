
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  className?: string;
}

export const NotificationBadge = ({ className }: NotificationBadgeProps) => {
  const { user } = useAuth();
  const { unreadCount, fetchNotifications } = useNotifications(user?.id);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  if (!user) return null;

  return (
    <div className={cn("relative", className)}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  );
};

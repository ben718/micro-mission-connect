import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Trash2, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterType = "all" | "unread" | "read";
type SortType = "newest" | "oldest";

const ITEMS_PER_PAGE = 10;

export const NotificationPage = () => {
  const { user } = useAuth();
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortType>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  if (!user) return null;

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM à HH:mm", { locale: fr });
  };

  const filteredNotifications = notifications
    .filter((notification) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !notification.is_read) ||
        (filter === "read" && notification.is_read);

      const matchesSearch =
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sort === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-4">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsRead(user.id)}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => deleteAllNotifications(user.id)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher dans les notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="unread">Non lues</SelectItem>
            <SelectItem value="read">Lues</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value) => setSort(value as SortType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récentes</SelectItem>
            <SelectItem value="oldest">Plus anciennes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune notification trouvée
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-6 rounded-lg border bg-card hover:bg-muted/50 transition-colors",
                  !notification.is_read && "bg-muted/30"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.is_read && (
                        <Badge variant="secondary">Non lue</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{notification.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(notification.created_at)}
                    </p>
                    {notification.link_url && (
                      <Button
                        variant="link"
                        className="h-auto p-0"
                        onClick={() => window.location.href = notification.link_url}
                      >
                        Voir plus
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}; 
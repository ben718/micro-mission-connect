
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Settings, BarChart3, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const MissionNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isOrganization = profile?.is_association;

  const navigationItems = isOrganization ? [
    {
      title: "Créer une mission",
      href: "/missions/create",
      icon: Plus,
      description: "Publier une nouvelle mission de bénévolat",
      variant: "default" as const
    },
    {
      title: "Mes missions",
      href: "/missions/management",
      icon: Calendar,
      description: "Gérer mes missions et participants"
    },
    {
      title: "Statistiques",
      href: "/dashboard",
      icon: BarChart3,
      description: "Voir les statistiques de mon organisation"
    }
  ] : [
    {
      title: "Découvrir",
      href: "/missions",
      icon: Calendar,
      description: "Toutes les missions disponibles"
    },
    {
      title: "Mes missions",
      href: "/missions/my",
      icon: Users,
      description: "Mes inscriptions et historique"
    },
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: BarChart3,
      description: "Mes statistiques de bénévolat"
    }
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Missions</h2>
            {isOrganization && (
              <Badge variant="secondary">Organisation</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive(item.href) ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex items-center gap-2",
                    isActive(item.href) && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "p-4 rounded-lg border transition-colors hover:bg-accent",
                  isActive(item.href) && "border-blue-200 bg-blue-50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionNavigation;

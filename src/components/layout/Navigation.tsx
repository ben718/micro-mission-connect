import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Calendar,
  Building2,
  Heart,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const isAssociation = profile?.type === "organization";

  const associationLinks = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Missions",
      href: "/missions",
      icon: Calendar,
    },
    {
      title: "Bénévoles",
      href: "/volunteers",
      icon: Users,
    },
    {
      title: "Impact social",
      href: "/impact",
      icon: Heart,
    },
    {
      title: "Statistiques",
      href: "/statistics",
      icon: BarChart2,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
  ];

  const volunteerLinks = [
    {
      title: "Accueil",
      href: "/",
      icon: Home,
    },
    {
      title: "Missions",
      href: "/missions",
      icon: Calendar,
    },
    {
      title: "Associations",
      href: "/organizations",
      icon: Building2,
    },
    {
      title: "Mes engagements",
      href: "/my-engagements",
      icon: Heart,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
  ];

  const links = isAssociation ? associationLinks : volunteerLinks;

  return (
    <nav className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-bleu">Micro-Mission</span>
        </Link>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-bleu text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600"
            asChild
          >
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              Notifications
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
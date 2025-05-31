
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, User, Settings, Bell, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header = () => {
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Vous êtes déconnecté");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const navLinks = [
    { to: "/missions", label: "Missions" },
    { to: "/about", label: "À propos" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-bleu rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Bénévolat</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-bleu transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 lg:space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Menu mobile */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="sm">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="text-lg font-medium text-gray-600 hover:text-bleu transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      <hr className="my-4" />
                      <Link
                        to="/dashboard"
                        className="flex items-center text-lg font-medium text-gray-600 hover:text-bleu transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5" />
                        Tableau de bord
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center text-lg font-medium text-gray-600 hover:text-bleu transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center text-lg font-medium text-gray-600 hover:text-bleu transition-colors text-left"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Se déconnecter
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Menu utilisateur desktop */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden lg:flex">
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={profile?.profile_picture_url || ""} 
                          alt={profile?.first_name || "Utilisateur"} 
                        />
                        <AvatarFallback>
                          {getInitials(profile?.first_name, profile?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Tableau de bord</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications" className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth/login">Se connecter</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth/register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

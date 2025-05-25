
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Search, User, LogOut, Settings, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const isOrganization = profile?.is_organization || profile?.is_association;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">Volunteering</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/missions"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Missions
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Tableau de bord
              </Link>
              {isOrganization && (
                <Link
                  to="/missions/new"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Créer une mission
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Recherche */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>

          {user ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              {/* Menu utilisateur */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.profile_picture_url || profile?.avatar_url}
                        alt={profile?.first_name || "Utilisateur"}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.profile_picture_url || profile?.avatar_url}
                        alt={profile?.first_name || "Utilisateur"}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={isOrganization ? "/profile/association" : "/profile/benevole"}
                      className="w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">Inscription</Link>
              </Button>
            </div>
          )}

          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/missions"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Missions
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to={isOrganization ? "/profile/association" : "/profile/benevole"}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Mon profil
                    </Link>
                    {isOrganization && (
                      <Link
                        to="/missions/new"
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        Créer une mission
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600 hover:text-primary"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" asChild>
                      <Link to="/auth/login">Connexion</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth/register">Inscription</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

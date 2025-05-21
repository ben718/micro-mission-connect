
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <header className="py-4 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="sr-only">MicroBénévole</span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-bleu to-bleu-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
                  MicroBénévole
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Accueil
            </Link>
            <Link to="/missions" className="nav-link">
              Trouver une mission
            </Link>
            {user && profile?.is_association && (
              <Link to="/missions/new" className="nav-link">
                Proposer une mission
              </Link>
            )}
            <Link to="#" className="nav-link">
              À propos
            </Link>
          </nav>

          {/* Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>
                        {getInitials(profile?.first_name, profile?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  {profile?.is_association && (
                    <DropdownMenuItem asChild>
                      <Link to="/missions/new" className="cursor-pointer">
                        Créer une mission
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link to="/auth/login">Se connecter</Link>
                </Button>
                <Button className="bg-bleu hover:bg-bleu-700 text-white rounded-full" asChild>
                  <Link to="/auth/register">S'inscrire</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-3 animate-fade-in">
            <nav className="flex flex-col space-y-4 py-4">
              <Link
                to="/"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/missions"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Trouver une mission
              </Link>
              {user && profile?.is_association && (
                <Link
                  to="/missions/new"
                  className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Proposer une mission
                </Link>
              )}
              <Link
                to="#"
                className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                À propos
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mon profil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md flex items-center w-full text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/auth/login">Se connecter</Link>
                  </Button>
                  <Button
                    className="w-full bg-bleu hover:bg-bleu-700 text-white rounded-full"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/auth/register">S'inscrire</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

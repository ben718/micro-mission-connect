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

  // Détermination du rôle et de la couleur associée
  const roleLabel = profile?.is_organization ? 'Association' : 'Bénévole';
  const roleColor = profile?.is_organization ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

  // Fonction pour savoir si un lien est actif
  const isActive = (path: string) => location.pathname === path;

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
            <Link to="/" className={`nav-link ${isActive("/") ? "text-bleu font-bold underline" : ""}`}>Accueil</Link>
            <Link to="/missions" className={`nav-link ${isActive("/missions") ? "text-bleu font-bold underline" : ""}`}>Trouver une mission</Link>
            {user && profile?.is_organization && (
              <Link to="/missions/new" className={`nav-link ${isActive("/missions/new") ? "text-bleu font-bold underline" : ""}`}>Proposer une mission</Link>
            )}
            {user && !profile?.is_organization && (
              <Link to="/profile/benevole" className={`nav-link ${isActive("/profile/benevole") ? "text-bleu font-bold underline" : ""}`}>Mon espace bénévole</Link>
            )}
            {user && profile?.is_organization && (
              <Link to="/profile/association" className={`nav-link ${isActive("/profile/association") ? "text-bleu font-bold underline" : ""}`}>Mon espace asso</Link>
            )}
            <Link to="#" className="nav-link">À propos</Link>
          </nav>

          {/* Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={profile?.avatar || profile?.profile_picture_url || ''} />
                      <AvatarFallback>
                        {profile ? (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '') : '?'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge rôle */}
                    {roleLabel && (
                      <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs ${roleColor} border border-white shadow`}>{roleLabel}</span>
                    )}
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
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  {profile?.is_organization && (
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
              <Link to="/" className={`px-4 py-2 rounded-md ${isActive("/") ? "bg-bleu text-white" : "text-foreground hover:bg-bleu-50"}`} onClick={() => setIsOpen(false)}>Accueil</Link>
              <Link to="/missions" className={`px-4 py-2 rounded-md ${isActive("/missions") ? "bg-bleu text-white" : "text-foreground hover:bg-bleu-50"}`} onClick={() => setIsOpen(false)}>Trouver une mission</Link>
              {user && profile?.is_organization && (
                <Link to="/missions/new" className={`px-4 py-2 rounded-md ${isActive("/missions/new") ? "bg-bleu text-white" : "text-foreground hover:bg-bleu-50"}`} onClick={() => setIsOpen(false)}>Proposer une mission</Link>
              )}
              {user && !profile?.is_organization && (
                <Link to="/profile/benevole" className={`px-4 py-2 rounded-md ${isActive("/profile/benevole") ? "bg-bleu text-white" : "text-foreground hover:bg-bleu-50"}`} onClick={() => setIsOpen(false)}>Mon espace bénévole</Link>
              )}
              {user && profile?.is_organization && (
                <Link to="/profile/association" className={`px-4 py-2 rounded-md ${isActive("/profile/association") ? "bg-bleu text-white" : "text-foreground hover:bg-bleu-50"}`} onClick={() => setIsOpen(false)}>Mon espace asso</Link>
              )}
              <Link to="#" className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md" onClick={() => setIsOpen(false)}>À propos</Link>
              {user ? (
                <>
                  <Link to="/profile" className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md flex items-center" onClick={() => setIsOpen(false)}><User className="h-4 w-4 mr-2" />Mon profil</Link>
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="px-4 py-2 text-foreground hover:bg-bleu-50 rounded-md flex items-center w-full text-left"><LogOut className="h-4 w-4 mr-2" />Déconnexion</button>
                </>
              ) : (
                <div className="pt-2 space-y-3">
                  <Button variant="outline" className="w-full rounded-full" asChild onClick={() => setIsOpen(false)}><Link to="/auth/login">Se connecter</Link></Button>
                  <Button className="w-full bg-bleu hover:bg-bleu-700 text-white rounded-full" asChild onClick={() => setIsOpen(false)}><Link to="/auth/register">S'inscrire</Link></Button>
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

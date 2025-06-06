import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  userAvatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userName = '',
  userAvatar = '',
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-vs-blue-primary font-display font-bold text-xl">Voisin Solidaire</span>
        </Link>

        {/* Navigation principale - visible uniquement sur desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/how-it-works" className="text-gray-700 hover:text-vs-blue-primary font-medium">
            Comment ça marche
          </Link>
          <Link to="/testimonials" className="text-gray-700 hover:text-vs-blue-primary font-medium">
            Témoignages
          </Link>
          <Link to="/faq" className="text-gray-700 hover:text-vs-blue-primary font-medium">
            FAQ
          </Link>
        </nav>

        {/* Boutons d'authentification ou profil utilisateur */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center">
              <Link to="/app/dashboard" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-vs-blue-light flex items-center justify-center text-vs-blue-dark font-medium mr-2">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="h-8 w-8 rounded-full" />
                  ) : (
                    userName.charAt(0)
                  )}
                </div>
                <span className="hidden md:inline text-gray-900 font-medium">{userName}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-vs-blue-primary font-medium hover:text-vs-blue-dark">
                Connexion
              </Link>
              <Link to="/signup" className="btn-primary">
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

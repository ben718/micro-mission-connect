import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  console.log('Header component rendering');
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Voisin Solidaire
          </Link>
          <nav className="flex space-x-6">
            <Link to="/missions" className="text-gray-600 hover:text-blue-600">
              Missions
            </Link>
            <Link to="/map" className="text-gray-600 hover:text-blue-600">
              Carte
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">
              À propos
            </Link>
            <Link to="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Se connecter
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header simplifié */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="flex items-center">
            <span className="text-vs-blue-primary font-display font-bold text-xl">Voisin Solidaire</span>
          </Link>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="space-y-4">
            <Link 
              to="/" 
              className="btn-primary inline-block"
            >
              Retour à l'accueil
            </Link>
            <div className="block mt-4">
              <Link 
                to="/app/explore" 
                className="text-vs-blue-primary hover:text-vs-blue-dark"
              >
                Explorer les missions
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Footer simplifié */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Voisin Solidaire - Le bénévolat accessible à tous</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;

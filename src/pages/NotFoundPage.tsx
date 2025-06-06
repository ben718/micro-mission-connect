
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold text-vs-blue-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

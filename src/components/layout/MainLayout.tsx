
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
  isAuthenticated?: boolean;
  userName?: string;
  userAvatar?: string;
  activeTab?: 'explore' | 'missions' | 'impact' | 'profile';
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

const MainLayout: React.FC<MainLayoutProps> = ({
  isAuthenticated = true,
  userName = 'Thomas',
  userAvatar = '',
  activeTab = 'explore',
}) => {
  const location = useLocation();
  
  // Déterminer l'onglet actif en fonction de l'URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/explore')) return 'explore';
    if (path.includes('/missions')) return 'missions';
    if (path.includes('/impact')) return 'impact';
    if (path.includes('/profile')) return 'profile';
    return activeTab;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={isAuthenticated}
        userName={userName}
        userAvatar={userAvatar}
      />
      
      <main className="flex-grow container mx-auto px-4 pb-20 md:pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {isAuthenticated && (
        <BottomNav activeTab={getActiveTab()} />
      )}
    </div>
  );
};

export default MainLayout;


import React from 'react';
import { Link } from 'react-router-dom';

interface BottomNavProps {
  activeTab: 'explore' | 'missions' | 'impact' | 'profile';
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 md:hidden">
      <div className="flex justify-between items-center">
        <Link 
          to="/app/explore" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'explore' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">Explorer</span>
        </Link>
        
        <Link 
          to="/app/missions" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'missions' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">Mes missions</span>
        </Link>
        
        <div className="relative -mt-5">
          <button className="h-14 w-14 rounded-full bg-vs-orange-accent flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
        
        <Link 
          to="/app/impact" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'impact' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs mt-1">Impact</span>
        </Link>
        
        <Link 
          to="/app/profile" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'profile' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;

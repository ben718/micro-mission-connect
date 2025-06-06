import React from 'react';

interface BottomNavProps {
  activeTab: 'explore' | 'missions' | 'impact' | 'profile';
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 md:hidden">
      <div className="flex justify-around items-center">
        <a 
          href="/app/explore" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'explore' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">Explorer</span>
        </a>
        
        <a 
          href="/app/missions" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'missions' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">Mes missions</span>
        </a>
        
        <a 
          href="/app/impact" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'impact' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs mt-1">Impact</span>
        </a>
        
        <a 
          href="/app/profile" 
          className={`flex flex-col items-center px-3 py-1 ${
            activeTab === 'profile' ? 'text-vs-blue-primary' : 'text-gray-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Profil</span>
        </a>
      </div>
    </nav>
  );
};

export default BottomNav;

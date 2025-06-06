import React from 'react';

interface MissionCardProps {
  id?: string; // Rendu optionnel pour éviter l'erreur TS
  title: string;
  organization: string;
  duration: number;
  distance: number;
  timing: 'now' | 'soon' | string;
  spots?: {
    taken: number;
    available: number;
  };
  category?: string;
  onClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  // id retiré car non utilisé
  title,
  organization,
  duration,
  distance,
  timing,
  spots,
  category,
  onClick,
}) => {
  // Détermine le badge de durée en fonction du temps de mission
  const getDurationBadge = () => {
    if (duration <= 15) {
      return <span className="badge-orange">15 min</span>;
    } else if (duration <= 30) {
      return <span className="badge-green">30 min</span>;
    } else {
      return <span className="badge-blue">{duration} min</span>;
    }
  };

  // Formatage du timing
  const getTimingText = () => {
    if (timing === 'now') {
      return 'Maintenant';
    } else if (timing === 'soon') {
      return 'Bientôt';
    } else {
      return timing;
    }
  };

  return (
    <div 
      className="card hover:cursor-pointer mb-4"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{organization}</p>
        </div>
        {getDurationBadge()}
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className="mr-3">{distance} km</span>
        <span>{getTimingText()}</span>
      </div>
      
      {spots && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {spots.taken}/{spots.available} places
          </span>
          
          <div className="w-24 bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-vs-blue-primary h-1.5 rounded-full" 
              style={{ width: `${(spots.taken / spots.available) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {category && (
        <div className="mt-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      )}
    </div>
  );
};

export default MissionCard;

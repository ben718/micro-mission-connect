import React, { useState } from 'react';
import Button from '../common/Button';

interface MissionDetailProps {
  id?: string; // Dans une implémentation réelle, ce serait obligatoire
}

const MissionDetailPage: React.FC<MissionDetailProps> = () => {
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Données de démonstration
  const mission = {
    id: '1',
    title: 'Aide aux courses - Épicerie solidaire',
    organization: {
      id: 'org1',
      name: 'Les Restos du Cœur',
      logo: '',
      description: 'Association d\'aide alimentaire et d\'insertion fondée par Coluche en 1985.',
      website: 'https://www.restosducoeur.org'
    },
    description: 'Aidez à porter les courses des bénéficiaires de l\'épicerie solidaire jusqu\'à leur domicile ou leur véhicule. Particulièrement utile pour les personnes âgées ou à mobilité réduite.',
    duration: 15,
    date: 'Aujourd\'hui',
    time_start: '14h30',
    time_end: '14h45',
    location: {
      address: '12 rue des Lilas',
      postal_code: '75011',
      city: 'Paris',
      coordinates: {
        lat: 48.8566,
        lng: 2.3522
      }
    },
    distance: 0.5,
    timing: 'Dans 10 min',
    spots: {
      taken: 1,
      available: 3
    },
    category: 'Social',
    requirements: [
      'Aucune qualification particulière requise',
      'Capacité à porter des charges légères (5-10kg)'
    ],
    impact: 'Vous aiderez 5 personnes à mobilité réduite à ramener leurs courses chez elles.'
  };
  
  const handleRegister = () => {
    setRegistering(true);
    
    // Simuler un délai d'inscription
    setTimeout(() => {
      setRegistering(false);
      setIsRegistered(true);
    }, 1000);
  };
  
  const handleCancelRegistration = () => {
    setRegistering(true);
    
    // Simuler un délai d'annulation
    setTimeout(() => {
      setRegistering(false);
      setIsRegistered(false);
    }, 1000);
  };
  
  return (
    <div className="py-6 pb-20">
      {/* En-tête */}
      <div className="mb-6">
        <a href="/app/explore" className="flex items-center text-vs-blue-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Retour aux missions</span>
        </a>
        <h1 className="text-2xl font-bold text-gray-900">{mission.title}</h1>
        <p className="text-gray-600">{mission.organization.name}</p>
      </div>

      {/* Informations principales */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Détails de la mission</h2>
          </div>
          <span className={mission.duration <= 15 ? 'badge-orange' : mission.duration <= 30 ? 'badge-green' : 'badge-blue'}>
            {mission.duration} min
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="text-gray-600 mt-1">{mission.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Date</h3>
              <p className="text-gray-600 mt-1">{mission.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Horaire</h3>
              <p className="text-gray-600 mt-1">{mission.time_start} - {mission.time_end}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Places</h3>
              <p className="text-gray-600 mt-1">{mission.spots.taken}/{mission.spots.available}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700">Adresse</h3>
            <p className="text-gray-600 mt-1">
              {mission.location.address}, {mission.location.postal_code} {mission.location.city}
            </p>
          </div>
          
          {mission.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Prérequis</h3>
              <ul className="list-disc list-inside text-gray-600 mt-1">
                {mission.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700">Impact</h3>
            <p className="text-gray-600 mt-1">{mission.impact}</p>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="card p-0 overflow-hidden mb-6">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Carte de localisation</p>
        </div>
      </div>

      {/* Organisation */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">À propos de l'organisation</h2>
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            {mission.organization.logo ? (
              <img src={mission.organization.logo} alt={mission.organization.name} className="h-10 w-10 rounded-full" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{mission.organization.name}</h3>
            <p className="text-sm text-gray-500">{mission.location.city}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{mission.organization.description}</p>
        {mission.organization.website && (
          <a 
            href={mission.organization.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-vs-blue-primary font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visiter le site web
          </a>
        )}
      </div>

      {/* Bouton d'action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        {isRegistered ? (
          <Button 
            variant="outline-red"
            fullWidth
            onClick={handleCancelRegistration}
            isLoading={registering}
          >
            Annuler ma participation
          </Button>
        ) : (
          <Button 
            variant="primary"
            fullWidth
            onClick={handleRegister}
            isLoading={registering}
            disabled={mission.spots.taken >= mission.spots.available}
          >
            {mission.spots.taken >= mission.spots.available ? 'Mission complète' : 'Participer à cette mission'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionDetailPage;

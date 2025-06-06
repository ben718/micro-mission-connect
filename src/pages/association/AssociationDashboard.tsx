import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AssociationDashboard: React.FC = () => {
  // Données simulées pour le tableau de bord
  const stats = {
    activeMissions: 8,
    pendingMissions: 3,
    totalVolunteers: 42,
    newRegistrations: 5,
    completedMissions: 15,
    impactHours: 124
  };
  
  // Missions récentes simulées
  const recentMissions = [
    {
      id: 'm1',
      title: 'Distribution alimentaire',
      date: '15 juin 2025',
      status: 'active',
      volunteers: 4,
      spots: 6
    },
    {
      id: 'm2',
      title: 'Aide aux devoirs',
      date: '18 juin 2025',
      status: 'active',
      volunteers: 2,
      spots: 3
    },
    {
      id: 'm3',
      title: 'Nettoyage du parc',
      date: '20 juin 2025',
      status: 'pending',
      volunteers: 0,
      spots: 10
    }
  ];
  
  // Bénévoles récents simulés
  const recentVolunteers = [
    {
      id: 'v1',
      name: 'Marie Dupont',
      missions: 3,
      lastActive: '2 jours'
    },
    {
      id: 'v2',
      name: 'Thomas Martin',
      missions: 1,
      lastActive: '5 jours'
    },
    {
      id: 'v3',
      name: 'Sophie Bernard',
      missions: 5,
      lastActive: 'aujourd\'hui'
    }
  ];
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Association</h1>
        <Link 
          to="/association/missions/new" 
          className="btn-primary flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nouvelle mission
        </Link>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Missions actives</h3>
          <p className="text-2xl font-bold text-vs-blue-primary">{stats.activeMissions}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Missions en attente</h3>
          <p className="text-2xl font-bold text-vs-orange-accent">{stats.pendingMissions}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total bénévoles</h3>
          <p className="text-2xl font-bold text-vs-green-secondary">{stats.totalVolunteers}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Nouvelles inscriptions</h3>
          <p className="text-2xl font-bold text-vs-blue-primary">{stats.newRegistrations}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Missions terminées</h3>
          <p className="text-2xl font-bold text-vs-green-secondary">{stats.completedMissions}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Heures d'impact</h3>
          <p className="text-2xl font-bold text-vs-orange-accent">{stats.impactHours}</p>
        </div>
      </div>
      
      {/* Missions récentes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Missions récentes</h2>
          <Link to="/association/missions" className="text-vs-blue-primary text-sm font-medium">
            Voir toutes
          </Link>
        </div>
        
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mission
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bénévoles
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentMissions.map((mission) => (
                <tr key={mission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mission.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      mission.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {mission.status === 'active' ? 'Active' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mission.volunteers}/{mission.spots}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/association/missions/${mission.id}`} className="text-vs-blue-primary hover:text-vs-blue-dark mr-3">
                      Détails
                    </Link>
                    <Link to={`/association/missions/${mission.id}/edit`} className="text-vs-green-secondary hover:text-vs-green-dark">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bénévoles récents */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bénévoles récents</h2>
          <Link to="/association/volunteers" className="text-vs-blue-primary text-sm font-medium">
            Voir tous
          </Link>
        </div>
        
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bénévole
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Missions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentVolunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{volunteer.missions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{volunteer.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/association/volunteers/${volunteer.id}`} className="text-vs-blue-primary hover:text-vs-blue-dark">
                      Profil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/association/missions/new" className="card p-4 text-center hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-vs-blue-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">Nouvelle mission</span>
          </Link>
          <Link to="/association/volunteers" className="card p-4 text-center hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-vs-green-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">Gérer les bénévoles</span>
          </Link>
          <Link to="/association/reports" className="card p-4 text-center hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-vs-orange-accent mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium">Rapports d'impact</span>
          </Link>
          <Link to="/association/settings" className="card p-4 text-center hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium">Paramètres</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AssociationDashboard;

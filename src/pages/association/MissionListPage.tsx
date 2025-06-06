import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Mission {
  id: string;
  title: string;
  date: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  category: string;
  spots: {
    taken: number;
    available: number;
  };
  location: {
    city: string;
  };
}

const MissionListPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simuler le chargement des données depuis Supabase
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // Dans une implémentation réelle, nous récupérerions les données depuis Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        const mockMissions: Mission[] = [
          {
            id: '1',
            title: 'Distribution alimentaire',
            date: '2025-06-15',
            status: 'published',
            category: 'Social',
            spots: { taken: 4, available: 6 },
            location: { city: 'Paris' }
          },
          {
            id: '2',
            title: 'Aide aux devoirs',
            date: '2025-06-18',
            status: 'published',
            category: 'Éducation',
            spots: { taken: 2, available: 3 },
            location: { city: 'Lyon' }
          },
          {
            id: '3',
            title: 'Nettoyage du parc',
            date: '2025-06-20',
            status: 'draft',
            category: 'Environnement',
            spots: { taken: 0, available: 10 },
            location: { city: 'Marseille' }
          },
          {
            id: '4',
            title: 'Atelier lecture pour enfants',
            date: '2025-06-10',
            status: 'completed',
            category: 'Éducation',
            spots: { taken: 3, available: 3 },
            location: { city: 'Toulouse' }
          },
          {
            id: '5',
            title: 'Accompagnement personnes âgées',
            date: '2025-06-25',
            status: 'published',
            category: 'Social',
            spots: { taken: 1, available: 5 },
            location: { city: 'Nice' }
          },
          {
            id: '6',
            title: 'Collecte de vêtements',
            date: '2025-06-30',
            status: 'draft',
            category: 'Social',
            spots: { taken: 0, available: 4 },
            location: { city: 'Bordeaux' }
          },
          {
            id: '7',
            title: 'Animation atelier numérique',
            date: '2025-07-05',
            status: 'published',
            category: 'Éducation',
            spots: { taken: 0, available: 2 },
            location: { city: 'Lille' }
          }
        ];
        
        setMissions(mockMissions);
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMissions();
  }, []);
  
  // Filtrer les missions selon le statut et le terme de recherche
  const filteredMissions = missions.filter(mission => {
    const matchesFilter = filter === 'all' || mission.status === filter;
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mission.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mission.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Publiée</span>;
      case 'draft':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Brouillon</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Terminée</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Annulée</span>;
      default:
        return null;
    }
  };
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des missions</h1>
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
      
      {/* Filtres et recherche */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Toutes
            </button>
            <button 
              onClick={() => setFilter('published')} 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'published' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Publiées
            </button>
            <button 
              onClick={() => setFilter('draft')} 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'draft' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Brouillons
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'completed' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Terminées
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une mission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary w-full md:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liste des missions */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Aucune mission ne correspond à vos critères.</p>
          </div>
        ) : (
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
                  Catégorie
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
              {filteredMissions.map((mission) => (
                <tr key={mission.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                    <div className="text-xs text-gray-500">{mission.location.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(mission.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mission.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(mission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mission.spots.taken}/{mission.spots.available}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link to={`/association/missions/${mission.id}/volunteers`} className="text-vs-green-secondary hover:text-vs-green-dark">
                        Bénévoles
                      </Link>
                      <Link to={`/association/missions/${mission.id}/edit`} className="text-vs-blue-primary hover:text-vs-blue-dark">
                        Modifier
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default MissionListPage;

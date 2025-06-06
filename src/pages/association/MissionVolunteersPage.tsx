import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  feedback?: string;
}

const MissionVolunteersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  
  // Simuler le chargement des données depuis Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dans une implémentation réelle, nous récupérerions les données depuis Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées pour la mission
        const mockMission = {
          id,
          title: 'Distribution alimentaire',
          date: '2025-06-15',
          time: '14:00 - 16:00',
          location: 'Centre communautaire, Paris',
          spots: { taken: 4, available: 6 }
        };
        
        // Données simulées pour les bénévoles
        const mockVolunteers: Volunteer[] = [
          {
            id: 'v1',
            name: 'Marie Dupont',
            email: 'marie.dupont@example.com',
            phone: '06 12 34 56 78',
            registrationDate: '2025-06-01',
            status: 'confirmed'
          },
          {
            id: 'v2',
            name: 'Thomas Martin',
            email: 'thomas.martin@example.com',
            registrationDate: '2025-06-02',
            status: 'pending'
          },
          {
            id: 'v3',
            name: 'Sophie Bernard',
            email: 'sophie.bernard@example.com',
            phone: '07 65 43 21 09',
            registrationDate: '2025-06-03',
            status: 'confirmed'
          },
          {
            id: 'v4',
            name: 'Lucas Petit',
            email: 'lucas.petit@example.com',
            registrationDate: '2025-06-04',
            status: 'confirmed'
          }
        ];
        
        setMission(mockMission);
        setVolunteers(mockVolunteers);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Gérer la sélection d'un bénévole
  const toggleVolunteerSelection = (volunteerId: string) => {
    setSelectedVolunteers(prev => 
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };
  
  // Sélectionner ou désélectionner tous les bénévoles
  const toggleSelectAll = () => {
    if (selectedVolunteers.length === volunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(volunteers.map(v => v.id));
    }
  };
  
  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmé</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Terminé</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Annulé</span>;
      default:
        return null;
    }
  };
  
  // Actions sur les bénévoles sélectionnés
  const confirmSelectedVolunteers = () => {
    // Dans une implémentation réelle, nous mettrions à jour le statut dans Supabase
    setVolunteers(prev => 
      prev.map(volunteer => 
        selectedVolunteers.includes(volunteer.id)
          ? { ...volunteer, status: 'confirmed' as const }
          : volunteer
      )
    );
    setSelectedVolunteers([]);
  };
  
  const cancelSelectedVolunteers = () => {
    // Dans une implémentation réelle, nous mettrions à jour le statut dans Supabase
    setVolunteers(prev => 
      prev.map(volunteer => 
        selectedVolunteers.includes(volunteer.id)
          ? { ...volunteer, status: 'cancelled' as const }
          : volunteer
      )
    );
    setSelectedVolunteers([]);
  };
  
  const sendMessageToSelected = () => {
    // Dans une implémentation réelle, nous ouvririons une modal pour composer un message
    alert(`Envoyer un message à ${selectedVolunteers.length} bénévole(s)`);
  };
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link to="/association/missions" className="text-vs-blue-primary flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour aux missions
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{mission.title} - Bénévoles</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{formatDate(mission.date)}</p>
              <p className="text-sm text-gray-600">{mission.time}</p>
              <p className="text-sm text-gray-600">{mission.location}</p>
            </div>
          </div>
          
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{volunteers.length}</span> bénévole(s) inscrit(s) sur <span className="font-medium">{mission.spots.available}</span> places disponibles
                </p>
              </div>
              
              {selectedVolunteers.length > 0 && (
                <div className="flex space-x-2">
                  <button 
                    onClick={confirmSelectedVolunteers}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  >
                    Confirmer
                  </button>
                  <button 
                    onClick={cancelSelectedVolunteers}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={sendMessageToSelected}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                  >
                    Envoyer un message
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {volunteers.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500">Aucun bénévole inscrit pour cette mission.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                          checked={selectedVolunteers.length === volunteers.length}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bénévole
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id} className={selectedVolunteers.includes(volunteer.id) ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                            checked={selectedVolunteers.includes(volunteer.id)}
                            onChange={() => toggleVolunteerSelection(volunteer.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{volunteer.email}</div>
                        {volunteer.phone && (
                          <div className="text-sm text-gray-500">{volunteer.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(volunteer.registrationDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(volunteer.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link to={`/association/volunteers/${volunteer.id}`} className="text-vs-blue-primary hover:text-vs-blue-dark">
                            Profil
                          </Link>
                          <button className="text-vs-green-secondary hover:text-vs-green-dark">
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Actions supplémentaires */}
          <div className="mt-6 flex justify-end space-x-3">
            <button className="btn-outline">
              Exporter la liste
            </button>
            <button className="btn-primary">
              Envoyer un message à tous
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MissionVolunteersPage;

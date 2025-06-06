
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Calendar } from 'lucide-react';

const MissionDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the mission
  const mission = {
    id: id || '1',
    title: 'Distribution alimentaire',
    description: 'Rejoignez-nous pour aider à distribuer des repas chauds aux personnes sans-abri. Une action concrète pour lutter contre la précarité dans notre quartier.',
    duration: 15,
    location: 'Centre d\'accueil Paris 19',
    address: '123 rue de la République, 75019 Paris',
    date: 'Aujourd\'hui',
    time: '12:30 - 12:45',
    association: 'Les Restos du Cœur',
    volunteers: 3,
    maxVolunteers: 5,
    category: 'Alimentaire',
    requirements: [
      'Aucune expérience requise',
      'Tenue décontractée recommandée',
      'Ponctualité importante'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 mr-3"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Détails de la mission</h1>
      </div>

      {/* Mission Info */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">{mission.title}</h2>
          <span className="badge-orange">{mission.duration} min</span>
        </div>

        <p className="text-gray-600 mb-6">{mission.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-700">{mission.date} • {mission.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-gray-700">{mission.location}</p>
              <p className="text-sm text-gray-500">{mission.address}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-gray-700">{mission.volunteers}/{mission.maxVolunteers} bénévoles inscrits</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Association</h3>
          <p className="text-gray-700">{mission.association}</p>
        </div>
      </motion.div>

      {/* Requirements */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-gray-900 mb-3">Informations pratiques</h3>
        <ul className="space-y-2">
          {mission.requirements.map((req, index) => (
            <li key={index} className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-vs-blue-primary mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button className="btn-primary w-full py-3">
          Je participe à cette mission
        </button>
        <button className="btn-outline w-full py-3">
          Partager cette mission
        </button>
      </motion.div>
    </div>
  );
};

export default MissionDetailPage;

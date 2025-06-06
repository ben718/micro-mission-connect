import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AssociationReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState<any>(null);
  
  // Simuler le chargement des données depuis Supabase
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Dans une implémentation réelle, nous récupérerions les données depuis Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées pour les rapports
        const mockData = {
          totalMissions: 24,
          completedMissions: 18,
          totalVolunteers: 42,
          activeVolunteers: 28,
          totalHours: 124,
          impactScore: 87,
          categoryBreakdown: [
            { name: 'Social', value: 45 },
            { name: 'Environnement', value: 25 },
            { name: 'Éducation', value: 20 },
            { name: 'Santé', value: 10 }
          ],
          monthlyActivity: [
            { month: 'Jan', missions: 2, volunteers: 5 },
            { month: 'Fév', missions: 3, volunteers: 7 },
            { month: 'Mar', missions: 2, volunteers: 6 },
            { month: 'Avr', missions: 4, volunteers: 10 },
            { month: 'Mai', missions: 5, volunteers: 12 },
            { month: 'Juin', missions: 8, volunteers: 18 }
          ],
          topMissions: [
            { title: 'Distribution alimentaire', volunteers: 6, hours: 18 },
            { title: 'Nettoyage du parc', volunteers: 10, hours: 30 },
            { title: 'Aide aux devoirs', volunteers: 3, hours: 12 }
          ]
        };
        
        setReportData(mockData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de rapport:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [period]);
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rapports d'impact</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('month')} 
            className={`px-3 py-1 text-sm rounded-md ${period === 'month' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Mois
          </button>
          <button 
            onClick={() => setPeriod('quarter')} 
            className={`px-3 py-1 text-sm rounded-md ${period === 'quarter' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Trimestre
          </button>
          <button 
            onClick={() => setPeriod('year')} 
            className={`px-3 py-1 text-sm rounded-md ${period === 'year' ? 'bg-vs-blue-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Année
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
        </div>
      ) : (
        <>
          {/* Statistiques principales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Missions complétées</h3>
              <p className="text-2xl font-bold text-vs-blue-primary">{reportData.completedMissions}/{reportData.totalMissions}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Bénévoles actifs</h3>
              <p className="text-2xl font-bold text-vs-green-secondary">{reportData.activeVolunteers}/{reportData.totalVolunteers}</p>
            </div>
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Heures de bénévolat</h3>
              <p className="text-2xl font-bold text-vs-orange-accent">{reportData.totalHours}</p>
            </div>
          </div>
          
          {/* Graphique d'activité mensuelle */}
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité mensuelle</h2>
            <div className="h-64 flex items-end justify-between">
              {reportData.monthlyActivity.map((month: any) => (
                <div key={month.month} className="flex flex-col items-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div 
                      className="w-8 bg-vs-blue-primary rounded-t"
                      style={{ height: `${(month.missions / 10) * 150}px` }}
                    ></div>
                    <div 
                      className="w-8 bg-vs-green-secondary rounded-t"
                      style={{ height: `${(month.volunteers / 20) * 150}px` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">{month.month}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-vs-blue-primary rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">Missions</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-vs-green-secondary rounded-full mr-1"></div>
                <span className="text-xs text-gray-600">Bénévoles</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Répartition par catégorie */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h2>
              <div className="space-y-4">
                {reportData.categoryBreakdown.map((category: any) => (
                  <div key={category.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-vs-blue-primary rounded-full h-2" 
                        style={{ width: `${category.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top missions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top missions</h2>
              <div className="space-y-4">
                {reportData.topMissions.map((mission: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                      <div className="text-xs text-gray-500">{mission.volunteers} bénévoles · {mission.hours} heures</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-vs-green-secondary mr-1"></div>
                      <span className="text-xs font-medium text-gray-700">
                        {index === 0 ? '1er' : index === 1 ? '2ème' : '3ème'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Score d'impact */}
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Score d'impact</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray={`${reportData.impactScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{reportData.impactScore}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Votre score d'impact est basé sur le nombre de missions, de bénévoles et d'heures de bénévolat.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button className="btn-outline">
              Télécharger en PDF
            </button>
            <button className="btn-outline">
              Exporter les données
            </button>
            <button className="btn-primary">
              Partager le rapport
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AssociationReportsPage;

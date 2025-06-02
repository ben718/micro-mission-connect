import React, { useState } from 'react';
import { Search, MapPin, Clock, Users, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMissions, Mission } from '@/hooks/useMissions';

const MissionCard: React.FC<{ mission: Mission; onJoin: (id: string) => void }> = ({ mission, onJoin }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {mission.title || 'Titre non disponible'}
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium">
              {mission.organization?.organization_name || 'Organisation non disponible'}
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
            Mission
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {mission.description || 'Description non disponible'}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{mission.location || 'Lieu non spécifié'}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Date à définir</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>Durée à définir</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>Participants recherchés</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {mission.category || 'Général'}
          </Badge>
          
          <Button 
            onClick={() => onJoin(mission.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Rejoindre
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MissionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { missions, loading, error, joinMission } = useMissions();

  const handleJoinMission = async (missionId: string) => {
    const success = await joinMission(missionId);
    if (success) {
      alert('Inscription réussie ! Vous recevrez une confirmation par email.');
    } else {
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  // Filtrage des missions
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = searchQuery === '' || 
                         mission.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.organization?.organization_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || mission.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(missions.map(mission => mission.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des missions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Missions de bénévolat
        </h1>
        <p className="text-gray-600">
          Découvrez des opportunités d'engagement près de chez vous
        </p>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre, description, organisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre par catégorie */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} trouvée{filteredMissions.length > 1 ? 's' : ''}
          </p>
          
          {(searchQuery || categoryFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      </div>

      {/* Liste des missions */}
      {filteredMissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune mission trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {missions.length === 0 
                ? "Aucune mission n'est disponible pour le moment."
                : "Essayez de modifier vos critères de recherche ou de supprimer les filtres."
              }
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
            >
              Voir toutes les missions
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onJoin={handleJoinMission}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionsPage;


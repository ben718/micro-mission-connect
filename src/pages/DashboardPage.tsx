import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  TrendingUp,
  Heart,
  Plus,
  Search,
  Filter,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Simuler le type d'utilisateur (à remplacer par les vraies données)
  const userType = 'volunteer'; // 'volunteer' ou 'organization'
  
  if (userType === 'volunteer') {
    return <VolunteerDashboard user={user} />;
  } else {
    return <OrganizationDashboard user={user} />;
  }
};

const VolunteerDashboard: React.FC<{ user: any }> = ({ user }) => {
  const stats = [
    { label: 'Missions réalisées', value: '12', icon: Award, color: 'text-green-600' },
    { label: 'Heures bénévoles', value: '48h', icon: Clock, color: 'text-blue-600' },
    { label: 'Associations aidées', value: '8', icon: Heart, color: 'text-red-600' },
    { label: 'Impact score', value: '94%', icon: TrendingUp, color: 'text-purple-600' }
  ];

  const upcomingMissions = [
    {
      id: 1,
      title: 'Distribution alimentaire',
      organization: 'Restos du Cœur',
      date: '2025-06-05',
      time: '14:00',
      location: 'Paris 11ème',
      duration: '3h',
      participants: 8
    },
    {
      id: 2,
      title: 'Aide aux devoirs',
      organization: 'Secours Populaire',
      date: '2025-06-07',
      time: '16:30',
      location: 'Paris 20ème',
      duration: '2h',
      participants: 4
    }
  ];

  const recentMissions = [
    {
      id: 1,
      title: 'Collecte de vêtements',
      organization: 'Emmaüs',
      date: '2025-05-28',
      status: 'completed',
      rating: 5
    },
    {
      id: 2,
      title: 'Visite personnes âgées',
      organization: 'Petits Frères des Pauvres',
      date: '2025-05-25',
      status: 'completed',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bonjour {user?.email?.split('@')[0]} ! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Voici votre tableau de bord bénévole
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Missions à venir */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Mes prochaines missions
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle mission
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMissions.map((mission) => (
                    <div key={mission.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{mission.organization}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {mission.date} à {mission.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {mission.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {mission.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            <Users className="w-3 h-3 mr-1" />
                            {mission.participants}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Chercher des missions
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Missions près de moi
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Mes préférences
                </Button>
              </CardContent>
            </Card>

            {/* Missions récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Missions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMissions.map((mission) => (
                    <div key={mission.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                          ✓
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mission.title}
                        </p>
                        <p className="text-xs text-gray-500">{mission.organization}</p>
                      </div>
                      <div className="text-xs text-gray-400">{mission.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrganizationDashboard: React.FC<{ user: any }> = ({ user }) => {
  const stats = [
    { label: 'Missions actives', value: '8', icon: Calendar, color: 'text-blue-600' },
    { label: 'Bénévoles inscrits', value: '45', icon: Users, color: 'text-green-600' },
    { label: 'Missions ce mois', value: '23', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Taux de satisfaction', value: '96%', icon: Heart, color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de bord Association
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez vos missions et bénévoles
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une mission
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dashboard Association en construction
            </h3>
            <p className="text-gray-600 mb-6">
              Cette interface sera développée dans la prochaine phase pour offrir une gestion complète des missions et bénévoles.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre première mission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


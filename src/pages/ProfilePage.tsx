import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Award,
  Settings,
  Camera,
  Edit3,
  Save,
  X,
  Heart,
  Clock,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Ben',
    lastName: 'Mvouama',
    email: user?.email || '',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    bio: 'Passionné par l\'aide aux autres et l\'engagement citoyen. J\'aime particulièrement les missions d\'aide sociale et d\'éducation.',
    skills: ['Aide sociale', 'Éducation', 'Événementiel', 'Communication'],
    availability: 'Week-ends et soirées'
  });

  const stats = [
    { label: 'Missions réalisées', value: '12', icon: Award, color: 'text-green-600' },
    { label: 'Heures bénévoles', value: '48h', icon: Clock, color: 'text-blue-600' },
    { label: 'Associations aidées', value: '8', icon: Heart, color: 'text-red-600' },
    { label: 'Note moyenne', value: '4.9', icon: Star, color: 'text-yellow-600' }
  ];

  const recentMissions = [
    {
      id: 1,
      title: 'Distribution alimentaire',
      organization: 'Restos du Cœur',
      date: '2025-05-28',
      status: 'completed',
      rating: 5,
      feedback: 'Excellent bénévole, très impliqué et ponctuel !'
    },
    {
      id: 2,
      title: 'Aide aux devoirs',
      organization: 'Secours Populaire',
      date: '2025-05-25',
      status: 'completed',
      rating: 5,
      feedback: 'Très patient avec les enfants, recommandé !'
    },
    {
      id: 3,
      title: 'Collecte de vêtements',
      organization: 'Emmaüs',
      date: '2025-05-20',
      status: 'completed',
      rating: 4,
      feedback: 'Bonne participation, merci pour votre aide.'
    }
  ];

  const badges = [
    { name: 'Premier pas', description: 'Première mission réalisée', earned: true },
    { name: 'Régulier', description: '5 missions réalisées', earned: true },
    { name: 'Dévoué', description: '10 missions réalisées', earned: true },
    { name: 'Champion', description: '25 missions réalisées', earned: false },
    { name: 'Mentor', description: 'Note moyenne > 4.5', earned: true },
    { name: 'Fidèle', description: '6 mois d\'activité', earned: false }
  ];

  const handleSave = () => {
    // Ici on sauvegarderait les données
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Ici on restaurerait les données originales
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Profil */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">
                        {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-600">Bénévole actif</p>
                </div>

                {/* Informations de base */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-3" />
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profileData.email}</span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profileData.phone}</span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3" />
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="text-sm"
                      />
                    ) : (
                      <span className="text-sm">{profileData.location}</span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span className="text-sm">Membre depuis mars 2025</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">À propos</h3>
                  {isEditing ? (
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={4}
                      className="text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{profileData.bio}</p>
                  )}
                </div>

                {/* Compétences */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="missions">Mes missions</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
              </TabsList>

              {/* Vue d'ensemble */}
              <TabsContent value="overview" className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Graphique d'activité */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Graphique d'activité à venir</p>
                        <p className="text-sm">Visualisation de vos missions dans le temps</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Missions */}
              <TabsContent value="missions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des missions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentMissions.map((mission) => (
                        <div key={mission.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{mission.organization}</p>
                              <p className="text-xs text-gray-500 mt-1">{mission.date}</p>
                              {mission.feedback && (
                                <p className="text-sm text-gray-700 mt-2 italic">"{mission.feedback}"</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(mission.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Terminée
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Badges */}
              <TabsContent value="badges" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {badges.map((badge, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 text-center ${
                            badge.earned 
                              ? 'bg-yellow-50 border-yellow-200' 
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                            badge.earned ? 'bg-yellow-400' : 'bg-gray-300'
                          }`}>
                            <Award className={`w-6 h-6 ${badge.earned ? 'text-white' : 'text-gray-500'}`} />
                          </div>
                          <h3 className={`font-medium ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                            {badge.name}
                          </h3>
                          <p className={`text-xs mt-1 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                            {badge.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


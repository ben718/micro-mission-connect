
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ProfileFormSkeleton } from '@/components/ui/profile-skeleton';
import { ErrorMessage } from '@/components/ui/error-message';
import { User, MapPin, Star, Clock, Award, Edit, LogOut } from 'lucide-react';

const ProfileBenevole = () => {
  const { user, profile, signOut } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    completedMissions: 0,
    totalHours: 0,
    badges: 0
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    if (user && profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        phone: profile.phone || ''
      });
      fetchMissions();
      fetchStats();
    }
  }, [user, profile]);

  const fetchMissions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mission_registrations')
        .select(`
          *,
          missions (
            id,
            title,
            description,
            start_date,
            status,
            format
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des missions:', error);
      toast.error('Erreur lors du chargement des missions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Missions terminées
      const { data: completedMissions, error: missionsError } = await supabase
        .from('mission_registrations')
        .select('mission_id, missions(duration_minutes)')
        .eq('user_id', user.id)
        .eq('status', 'terminé');

      if (missionsError) throw missionsError;

      // Badges
      const { data: badges, error: badgesError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id);

      if (badgesError) throw badgesError;

      const totalHours = (completedMissions || [])
        .reduce((acc, reg) => acc + (reg.missions?.duration_minutes || 0), 0) / 60;

      setStats({
        completedMissions: completedMissions?.length || 0,
        totalHours: Math.round(totalHours * 10) / 10,
        badges: badges?.length || 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du profil');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'inscrit':
        return <Badge variant="outline">En attente</Badge>;
      case 'confirmé':
        return <Badge variant="default">Confirmé</Badge>;
      case 'terminé':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'annulé':
        return <Badge variant="destructive">Annulé</Badge>;
      case 'no_show':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMissionStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'terminée':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'annulée':
        return <Badge variant="destructive">Annulée</Badge>;
      case 'suspendue':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Suspendue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <ProfileFormSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header du profil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={profile?.profile_picture_url || `https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}`} 
              />
              <AvatarFallback className="text-2xl">
                {getInitials(profile?.first_name, profile?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                {profile?.first_name} {profile?.last_name}
                <Badge variant="secondary">Bénévole</Badge>
              </h1>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {profile?.city && (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    {profile.city}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {isEditing ? 'Sauvegarder' : 'Modifier'}
              </Button>
              <Button variant="destructive" onClick={signOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Clock className="h-8 w-8 mb-2 text-blue-600" />
            <span className="font-bold text-2xl text-blue-600">{stats.totalHours}</span>
            <span className="text-sm text-gray-500">Heures de bénévolat</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Star className="h-8 w-8 mb-2 text-blue-600" />
            <span className="font-bold text-2xl text-blue-600">{stats.completedMissions}</span>
            <span className="text-sm text-gray-500">Missions terminées</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Award className="h-8 w-8 mb-2 text-blue-600" />
            <span className="font-bold text-2xl text-blue-600">{stats.badges}</span>
            <span className="text-sm text-gray-500">Badges obtenus</span>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de profil */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Biographie</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ville</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mes missions */}
      <Card>
        <CardHeader>
          <CardTitle>Mes missions</CardTitle>
        </CardHeader>
        <CardContent>
          {missions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium mb-2">Aucune mission</p>
              <p>Vous n'êtes inscrit à aucune mission pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map((registration) => (
                <div key={registration.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{registration.missions?.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {registration.missions?.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {getStatusBadge(registration.status)}
                        {getMissionStatusBadge(registration.missions?.status)}
                        <Badge variant="outline">{registration.missions?.format}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Date: {new Date(registration.missions?.start_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBenevole;

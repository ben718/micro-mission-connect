
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ProfileFormSkeleton, ProfileCardSkeleton, ProfileMissionSkeleton } from '@/components/ui/profile-skeleton';
import { ErrorMessage } from '@/components/ui/error-message';

const ProfileBenevole = () => {
  const { user, profile } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    postal_code: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchRegistrations();
      fetchSkills();
      fetchBadges();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          bio: data.bio || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      setError('Impossible de charger votre profil');
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('mission_registrations')
        .select(`
          *,
          missions (
            title,
            description,
            start_date,
            status
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegistrations(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des inscriptions:', error);
      toast.error('Erreur lors du chargement des missions');
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          *,
          skills (name, description)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSkills(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
      toast.error('Erreur lors du chargement des compétences');
    }
  };

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badges (name, description, image_url)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      setBadges(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des badges:', error);
      toast.error('Erreur lors du chargement des badges');
    }
  };

  const handleSave = async () => {
    try {
      if (userProfile) {
        // Mise à jour
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('id', user?.id);

        if (error) throw error;
      } else {
        // Création
        const { data, error } = await supabase
          .from('profiles')
          .insert([{
            ...formData,
            id: user?.id
          }])
          .select()
          .single();

        if (error) throw error;
        setUserProfile(data);
      }

      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
      fetchUserProfile();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du profil');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <ProfileFormSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
        <ProfileMissionSkeleton />
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mon Profil</CardTitle>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Parlez-nous de vous..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Adresse</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ville</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Code postal</label>
              <Input
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <p className="text-muted-foreground">Aucune compétence ajoutée</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.skills?.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes Badges</CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <p className="text-muted-foreground">Aucun badge obtenu</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-2">
                    <img
                      src={badge.badges?.image_url || "/placeholder.svg"}
                      alt={badge.badges?.name}
                      className="w-8 h-8"
                    />
                    <span className="text-sm">{badge.badges?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes Missions</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium mb-2">Aucune mission</p>
              <p>Vous n'avez pas encore participé à de missions. Découvrez les opportunités disponibles !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div key={registration.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{registration.missions?.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{registration.missions?.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{registration.status}</Badge>
                        <Badge variant="secondary">{registration.missions?.status}</Badge>
                        <Badge variant="outline">
                          {new Date(registration.missions?.start_date).toLocaleDateString('fr-FR')}
                        </Badge>
                      </div>
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

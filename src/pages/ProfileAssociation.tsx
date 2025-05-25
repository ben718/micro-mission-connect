
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ProfileAssociation = () => {
  const { user, profile } = useAuth();
  const [organization, setOrganization] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    organization_name: '',
    description: '',
    website_url: '',
    address: '',
    siret_number: ''
  });

  useEffect(() => {
    if (user) {
      fetchOrganizationProfile();
      fetchMissions();
    }
  }, [user]);

  const fetchOrganizationProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setOrganization(data);
        setFormData({
          organization_name: data.organization_name || '',
          description: data.description || '',
          website_url: data.website_url || '',
          address: data.address || '',
          siret_number: data.siret_number || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async () => {
    try {
      if (!organization?.id) return;

      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMissions(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des missions:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (organization) {
        // Mise à jour
        const { error } = await supabase
          .from('organization_profiles')
          .update(formData)
          .eq('id', organization.id);

        if (error) throw error;
      } else {
        // Création
        const { data, error } = await supabase
          .from('organization_profiles')
          .insert([{
            ...formData,
            user_id: user?.id
          }])
          .select()
          .single();

        if (error) throw error;
        setOrganization(data);
      }

      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
      fetchOrganizationProfile();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profil de l'Organisation</CardTitle>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l'organisation</label>
            <Input
              value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site web</label>
            <Input
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              disabled={!isEditing}
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

          <div>
            <label className="block text-sm font-medium mb-2">Numéro SIRET</label>
            <Input
              value={formData.siret_number}
              onChange={(e) => setFormData({ ...formData, siret_number: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Missions publiées</CardTitle>
        </CardHeader>
        <CardContent>
          {missions.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission publiée</p>
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => (
                <div key={mission.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{mission.title}</h3>
                      <p className="text-sm text-muted-foreground">{mission.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{mission.status}</Badge>
                        <Badge variant="secondary">{mission.format}</Badge>
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

export default ProfileAssociation;

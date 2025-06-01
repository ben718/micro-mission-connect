
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, LogOut, Users, Clock, Award, Mail, MapPin, Save, X } from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import { MissionWithAssociation } from '@/types/mission';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const { data: missionsResponse } = useMissions();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    city: profile?.city || '',
    address: profile?.address || '',
    postal_code: profile?.postal_code || ''
  });

  // Mettre à jour le formulaire quand le profil change
  useEffect(() => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        address: profile.address || '',
        postal_code: profile.postal_code || ''
      });
    }
  }, [profile]);

  // Vérification de cohérence
  useEffect(() => {
    if (user && profile && user.id !== profile.id) {
      console.error("Incohérence détectée : le profil ne correspond pas à l'utilisateur connecté");
      toast.error("Erreur de cohérence des données. Veuillez vous reconnecter.");
      signOut();
    }
  }, [user, profile, signOut]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      bio: profile?.bio || '',
      city: profile?.city || '',
      address: profile?.address || '',
      postal_code: profile?.postal_code || ''
    });
    setIsEditing(false);
  };

  if (!user || !profile || user.id !== profile.id) {
    return null;
  }
  
  const missions = Array.isArray(missionsResponse) 
    ? missionsResponse 
    : (missionsResponse?.data || []);

  // Missions du bénévole - using available_spots instead of spots_taken
  const myMissions = (missions || []).filter(m => m.available_spots > 0);
  const missionsAVenir = (myMissions || []).filter(m => new Date(m.start_date) >= new Date());
  const missionsPassees = (myMissions || []).filter(m => new Date(m.start_date) < new Date());

  // Statistiques
  // Calcul des heures réelles à partir de la durée des missions passées
  const heuresBenevolat = (missionsPassees || []).reduce((acc, m) => acc + (m.duration_minutes || 0), 0) / 60;
  const heuresBenevolatAffiche = Math.round(heuresBenevolat * 10) / 10;
  const badges = profile.user_badges || [];
  const skills = profile.user_skills || [];

  // Mapping local des badges (nom -> description)
  const badgeDescriptions: Record<string, string> = {
    'Premier pas': 'A complété sa première mission',
    'Humanitaire': 'A participé à une mission humanitaire',
    'Environnement': 'A contribué à une mission environnementale',
    'Social': 'A aidé lors d\'une mission sociale',
    'Éducation': 'A soutenu une mission éducative',
    'Super Bénévole': 'A complété plus de 10 missions',
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* En-tête */}
      <Card className="mb-6 relative border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.profile_picture_url || `https://ui-avatars.com/api/?name=${editForm.first_name}+${editForm.last_name}`}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    placeholder="Prénom"
                  />
                  <Input
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    placeholder="Nom"
                  />
                </div>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Décrivez-vous en quelques mots..."
                  rows={3}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    placeholder="Ville"
                  />
                  <Input
                    value={editForm.postal_code}
                    onChange={(e) => setEditForm({...editForm, postal_code: e.target.value})}
                    placeholder="Code postal"
                  />
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    placeholder="Adresse"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-bleu">
                  {editForm.first_name} {editForm.last_name}
                  <Badge variant="secondary">Bénévole</Badge>
                </h2>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <span className="flex items-center gap-1 text-gray-500 text-sm"><Mail className="h-4 w-4 text-bleu" />{user.email}</span>
                  {editForm.city && <span className="flex items-center gap-1 text-gray-500 text-sm"><MapPin className="h-4 w-4 text-bleu" />{editForm.city}</span>}
                </div>
                {editForm.bio && (
                  <p className="text-gray-600 mt-2">{editForm.bio}</p>
                )}
              </>
            )}
          </div>
          {/* Boutons d'édition */}
          <div className="flex flex-col gap-2 md:sticky md:top-8 md:self-start z-10 w-full md:w-auto mt-4 md:mt-0">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoading}
                  className="flex items-center gap-2 w-full md:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 w-full md:w-auto"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 w-full md:w-auto"
                >
                  <Edit className="h-4 w-4" />
                  Éditer mon profil
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-2 w-full md:w-auto" 
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1 text-bleu" /><span className="font-bold text-lg text-bleu">{myMissions.length}</span><span className="text-xs text-gray-500">Missions</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Clock className="h-6 w-6 mb-1 text-bleu" /><span className="font-bold text-lg text-bleu">{heuresBenevolatAffiche}</span><span className="text-xs text-gray-500">Heures</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Award className="h-6 w-6 mb-1 text-bleu" /><span className="font-bold text-lg text-bleu">{badges.length}</span><span className="text-xs text-gray-500">Badges</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><span className="font-bold text-lg text-bleu">{missionsAVenir.length}</span><span className="text-xs text-gray-500">À venir</span></CardContent></Card>
      </div>

      {/* Compétences et badges */}
      {skills && skills.length > 0 && (
        <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Mes compétences</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((userSkill) => (
                <Badge key={userSkill.id} variant="secondary">{userSkill.skill?.name}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missions à venir */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Missions à venir</h3>
          {missionsAVenir.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission à venir.</p>
          ) : (
            <ul className="space-y-2">
              {missionsAVenir.map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className="font-medium">{m.title}</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">À venir</Badge>
                  <Badge variant="outline">{new Date(m.start_date).toLocaleDateString()}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Missions passées */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Missions passées</h3>
          {missionsPassees.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission passée.</p>
          ) : (
            <ul className="space-y-2">
              {missionsPassees.map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className="font-medium">{m.title}</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Passée</Badge>
                  <Badge variant="outline">{new Date(m.start_date).toLocaleDateString()}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Badges</h3>
          {badges.length === 0 ? (
            <p className="text-muted-foreground">Aucun badge obtenu pour l'instant.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((userBadge) => (
                <Tooltip key={userBadge.id}>
                  <TooltipTrigger asChild>
                    <Badge variant="default" className="cursor-help">{userBadge.badge?.name}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>{badgeDescriptions[userBadge.badge?.name || ''] || 'Badge obtenu'}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

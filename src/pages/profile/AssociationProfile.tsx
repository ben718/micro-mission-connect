import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Users, Clock, Award, Mail, MapPin, Globe, Phone, Plus } from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import type { Profile } from '@/types/profile';
import { MissionWithAssociation } from '@/types/mission';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AssociationProfile() {
  const { user, profile, signOut } = useAuth();
  const { data: missionsResponse } = useMissions();
  const navigate = useNavigate();

  // Vérification de cohérence
  useEffect(() => {
    if (user && profile && user.id !== profile.id) {
      console.error("Incohérence détectée : le profil ne correspond pas à l'utilisateur connecté");
      toast.error("Erreur de cohérence des données. Veuillez vous reconnecter.");
      signOut();
    }
  }, [user, profile, signOut]);

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Vérification supplémentaire avant le rendu
  if (user.id !== profile.id) {
    return null; // Ne rien afficher si incohérence
  }

  const missions = Array.isArray(missionsResponse) 
    ? missionsResponse 
    : (missionsResponse?.data || []);
    
  // Missions créées par l'association
  const myMissions = missions.filter(m => m.association_id === profile.id);
  // Nombre total de bénévoles mobilisés (somme des participants)
  const benevoles = myMissions.reduce((acc, m) => {
    const participants = typeof m.participants === 'string' 
      ? parseInt(m.participants.split('/')[0], 10) || 0
      : m.spots_taken || 0;
    return acc + participants;
  }, 0);
  
  // Heures réelles à partir de la durée des missions créées
  const heures = myMissions.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) / 60;
  const heuresAffiche = Math.round(heures * 10) / 10;
  // Taux de complétion (missions passées / total)
  const missionsPassees = myMissions.filter(m => new Date(m.starts_at) < new Date());
  const tauxCompletion = myMissions.length > 0 ? Math.round((missionsPassees.length / myMissions.length) * 100) : 0;

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
            src={profile.avatar_url ? profile.avatar_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.first_name ?? 'Association')}`}
            alt="Logo"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-bleu">
              {profile.first_name ?? "Nom de l'association"}
              <Badge variant="secondary">Association</Badge>
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <span className="flex items-center gap-1 text-gray-500 text-sm"><Mail className="h-4 w-4 text-bleu" />{user.email}</span>
              {profile.location && <span className="flex items-center gap-1 text-gray-500 text-sm"><MapPin className="h-4 w-4 text-bleu" />{profile.location}</span>}
            </div>
          </div>
          {/* Sticky bouton éditer sur desktop, visible sous l'avatar sur mobile */}
          <div className="flex flex-col gap-2 md:sticky md:top-8 md:self-start z-10 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto"><Edit className="h-4 w-4" />Éditer mon profil</Button>
            <Button variant="destructive" className="flex items-center gap-2 w-full md:w-auto" onClick={signOut}><LogOut className="h-4 w-4" />Déconnexion</Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{myMissions.length}</span><span className="text-xs text-muted-foreground">Missions créées</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{benevoles}</span><span className="text-xs text-muted-foreground">Bénévoles mobilisés</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Clock className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{heuresAffiche}</span><span className="text-xs text-muted-foreground">Heures</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Award className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{tauxCompletion}%</span><span className="text-xs text-muted-foreground">Taux de complétion</span></CardContent></Card>
      </div>

      {/* Bio et infos */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Présentation</h3>
          <p className="text-muted-foreground mb-2">{profile.bio || "Ajoutez une présentation pour votre association."}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            {profile.website && <span className="flex items-center gap-1 text-muted-foreground text-sm"><Globe className="h-4 w-4" />{profile.website}</span>}
            {profile.phone && <span className="flex items-center gap-1 text-muted-foreground text-sm"><Phone className="h-4 w-4" />{profile.phone}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Missions créées */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Missions créées</h3>
            <Button className="flex items-center gap-2"><Plus className="h-4 w-4" />Créer une mission</Button>
          </div>
          {myMissions.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission créée pour l'instant.</p>
          ) : (
            <ul className="space-y-2">
              {myMissions.map(m => {
                // Détermination du statut
                let statut = '';
                let badgeClass = '';
                if (m.status === 'cancelled') {
                  statut = 'Annulée';
                  badgeClass = 'bg-red-100 text-red-800 border-red-200';
                } else if (new Date(m.starts_at) < new Date()) {
                  statut = 'Passée';
                  badgeClass = 'bg-green-100 text-green-800 border-green-200';
                } else {
                  statut = 'À venir';
                  badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
                }
                return (
                  <li key={m.id} className="flex flex-col md:flex-row md:items-center md:gap-4 border-b py-2">
                    <span className="font-medium">{m.title}</span>
                    <Badge className={badgeClass}>{statut}</Badge>
                    <span className="text-xs text-muted-foreground">{m.starts_at}</span>
                    <Badge variant="outline">{m.category}</Badge>
                    <span className="text-xs text-muted-foreground">{m.spots_taken} bénévoles</span>
                    <Button size="sm" variant="outline" className="ml-auto mt-2 md:mt-0">Gérer</Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

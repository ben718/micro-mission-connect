import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Users, Clock, Award, Mail, MapPin } from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import type { Profile } from '@/types/profile';
import { MissionWithAssociation } from '@/types/mission';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function UserProfile() {
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

  // Missions du bénévole
  const myMissions = (missions || []).filter(m => m.participants?.includes(user.id));
  const missionsAVenir = (myMissions || []).filter(m => new Date(m.starts_at) >= new Date());
  const missionsPassees = (myMissions || []).filter(m => new Date(m.starts_at) < new Date());

  // Statistiques
  // Calcul des heures réelles à partir de la durée des missions passées
  const heuresBenevolat = (missionsPassees || []).reduce((acc, m) => acc + (m.duration_minutes || 0), 0) / 60;
  const heuresBenevolatAffiche = Math.round(heuresBenevolat * 10) / 10;
  const badges = profile.badges || [];

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
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}`}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-bleu">
              {profile.first_name} {profile.last_name}
              <Badge variant="secondary">Bénévole</Badge>
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
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1 text-bleu" /><span className="font-bold text-lg text-bleu">{myMissions.length}</span><span className="text-xs text-gray-500">Missions</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Clock className="h-6 w-6 mb-1 text-bleu" /><span className="font-bold text-lg text-bleu">{heuresBenevolatAffiche}</span><span className="text-xs text-gray-500">Heures</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Award className="h-6 w-6 mb-1 text-bleu" /><span className="font-bold text-lg text-bleu">{badges.length}</span><span className="text-xs text-gray-500">Badges</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><span className="font-bold text-lg text-bleu">{missionsAVenir.length}</span><span className="text-xs text-gray-500">À venir</span></CardContent></Card>
      </div>

      {/* Bio et infos */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">À propos</h3>
          <p className="text-muted-foreground mb-2">{profile.bio || "Ajoutez une bio pour vous présenter."}</p>
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                  <Badge variant="outline">{m.date}</Badge>
                  <Badge variant="outline">{m.timeSlot}</Badge>
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
                  <Badge variant="outline">{m.date}</Badge>
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
              {badges.map((badge: string) => (
                <Tooltip key={badge}>
                  <TooltipTrigger asChild>
                    <Badge variant="default" className="cursor-help">{badge}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>{badgeDescriptions[badge] || 'Badge obtenu'}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

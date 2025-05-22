import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Users, Clock, Award, Mail, MapPin, Globe, Phone, Plus } from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import type { Profile as LocalProfile } from '@/types/profile';

export default function AssociationProfile() {
  const { user, profile: rawProfile, signOut } = useAuth();
  const profile = rawProfile as LocalProfile;
  const { data: missions = [] } = useMissions();

  if (!user || !profile) return <div>Chargement...</div>;

  // Missions créées par l'association
  const myMissions = Array.isArray(missions) ? missions.filter(m => m.associationId === profile.id) : [];
  // Nombre total de bénévoles mobilisés (somme des participants)
  const benevoles = myMissions.reduce((acc, m) => acc + (parseInt(m.participants || '0', 10) || 0), 0);
  // Heures totales (exemple : 3h/mission)
  const heures = myMissions.length * 3;
  // Taux de complétion (missions passées / total)
  const missionsPassees = myMissions.filter(m => new Date(m.date) < new Date());
  const tauxCompletion = myMissions.length > 0 ? Math.round((missionsPassees.length / myMissions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* En-tête */}
      <Card className="mb-6">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <img
            src={profile.avatar ? profile.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name ?? 'Association')}`}
            alt="Logo"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {profile.name ?? "Nom de l'association"}
              <Badge variant="secondary">Association</Badge>
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <span className="flex items-center gap-1 text-muted-foreground text-sm"><Mail className="h-4 w-4" />{user.email}</span>
              {profile.location && <span className="flex items-center gap-1 text-muted-foreground text-sm"><MapPin className="h-4 w-4" />{profile.location}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="flex items-center gap-2"><Edit className="h-4 w-4" />Éditer</Button>
            <Button variant="destructive" className="flex items-center gap-2" onClick={signOut}><LogOut className="h-4 w-4" />Déconnexion</Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{myMissions.length}</span><span className="text-xs text-muted-foreground">Missions créées</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{benevoles}</span><span className="text-xs text-muted-foreground">Bénévoles mobilisés</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Clock className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{heures}</span><span className="text-xs text-muted-foreground">Heures</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Award className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{tauxCompletion}%</span><span className="text-xs text-muted-foreground">Taux de complétion</span></CardContent></Card>
      </div>

      {/* Bio et infos */}
      <Card className="mb-8">
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
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Missions créées</h3>
            <Button className="flex items-center gap-2"><Plus className="h-4 w-4" />Créer une mission</Button>
          </div>
          {myMissions.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission créée pour l'instant.</p>
          ) : (
            <ul className="space-y-2">
              {myMissions.map(m => (
                <li key={m.id} className="flex flex-col md:flex-row md:items-center md:gap-4 border-b py-2">
                  <span className="font-medium">{m.title}</span>
                  <span className="text-xs text-muted-foreground">{m.date}</span>
                  <Badge variant="outline">{m.category}</Badge>
                  <span className="text-xs text-muted-foreground">{m.participants} bénévoles</span>
                  <Button size="sm" variant="outline" className="ml-auto mt-2 md:mt-0">Gérer</Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

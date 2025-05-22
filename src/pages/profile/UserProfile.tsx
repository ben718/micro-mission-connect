import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Users, Clock, Award, Mail, MapPin } from 'lucide-react';
import { useMissions } from '@/hooks/useMissions';
import type { Profile } from '@/types/profile';

export default function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const { data: missions = [] } = useMissions();

  if (!user || !profile) return <div>Chargement...</div>;

  // Missions du bénévole
  const myMissions = missions.filter(m => m.participants?.includes(user.id));
  const missionsAVenir = myMissions.filter(m => new Date(m.date) >= new Date());
  const missionsPassees = myMissions.filter(m => new Date(m.date) < new Date());

  // Statistiques
  const heuresBenevolat = missionsPassees.length * 3; // exemple : 3h/mission
  const badges = profile.badges || [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* En-tête */}
      <Card className="mb-6">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}`}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {profile.name}
              <Badge variant="secondary">Bénévole</Badge>
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
        <Card><CardContent className="flex flex-col items-center p-4"><Users className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{myMissions.length}</span><span className="text-xs text-muted-foreground">Missions</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Clock className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{heuresBenevolat}</span><span className="text-xs text-muted-foreground">Heures</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><Award className="h-6 w-6 mb-1" /><span className="font-bold text-lg">{badges.length}</span><span className="text-xs text-muted-foreground">Badges</span></CardContent></Card>
        <Card><CardContent className="flex flex-col items-center p-4"><span className="font-bold text-lg">{missionsAVenir.length}</span><span className="text-xs text-muted-foreground">À venir</span></CardContent></Card>
      </div>

      {/* Bio et infos */}
      <Card className="mb-8">
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
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Missions à venir</h3>
          {missionsAVenir.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission à venir.</p>
          ) : (
            <ul className="space-y-2">
              {missionsAVenir.map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className="font-medium">{m.title}</span>
                  <Badge variant="outline">{m.date}</Badge>
                  <Badge variant="outline">{m.timeSlot}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Missions passées */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Missions passées</h3>
          {missionsPassees.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission passée.</p>
          ) : (
            <ul className="space-y-2">
              {missionsPassees.map(m => (
                <li key={m.id} className="flex items-center gap-2">
                  <span className="font-medium">{m.title}</span>
                  <Badge variant="outline">{m.date}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Badges</h3>
          {badges.length === 0 ? (
            <p className="text-muted-foreground">Aucun badge obtenu pour l'instant.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge: string) => (
                <Badge key={badge} variant="default">{badge}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

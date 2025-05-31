
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Users, Clock, Award, Mail, MapPin, Globe, Phone, Plus } from 'lucide-react';
import { useOrganizationProfile } from '@/hooks/useOrganizationProfile';
import { useOrganizationMissions } from '@/hooks/useMissions';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AssociationProfile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: organizationProfile, isLoading: isLoadingOrg } = useOrganizationProfile(user?.id);
  const { data: missions, isLoading: isLoadingMissions } = useOrganizationMissions(organizationProfile?.id);

  // Vérification de cohérence
  useEffect(() => {
    if (user && profile && user.id !== profile.id) {
      console.error("Incohérence détectée : le profil ne correspond pas à l'utilisateur connecté");
      toast.error("Erreur de cohérence des données. Veuillez vous reconnecter.");
      signOut();
    }
  }, [user, profile, signOut]);

  if (!user || !profile || user.id !== profile.id) {
    return null;
  }

  if (isLoadingOrg || isLoadingMissions) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <p className="text-muted-foreground mb-4">Profil d'organisation non trouvé</p>
        <Button onClick={() => navigate('/profile/association/edit')}>
          Créer le profil de l'organisation
        </Button>
      </div>
    );
  }

  // Calcul des statistiques basées sur les vraies données
  const stats = {
    totalMissions: missions?.length || 0,
    activeMissions: missions?.filter(m => m.status === 'active').length || 0,
    completedMissions: missions?.filter(m => m.status === 'terminée').length || 0,
    totalVolunteers: missions?.reduce((acc, mission) => acc + (mission.participants_count || 0), 0) || 0,
  };

  // Calcul des heures totales basé sur les missions
  const totalHours = missions?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) / 60 || 0;
  const heuresAffiche = Math.round(totalHours * 10) / 10;

  // Taux de complétion basé sur les vraies données
  const tauxCompletion = stats.totalMissions > 0 ? Math.round((stats.completedMissions / stats.totalMissions) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* En-tête */}
      <Card className="mb-6 relative border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={organizationProfile.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(organizationProfile.organization_name)}`}
            alt="Logo"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-bleu">
              {organizationProfile.organization_name}
              <Badge variant="secondary">Association</Badge>
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <Mail className="h-4 w-4 text-bleu" />
                {user.email}
              </span>
              {organizationProfile.address && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 text-bleu" />
                  {organizationProfile.address}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:sticky md:top-8 md:self-start z-10 w-full md:w-auto mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={() => navigate('/profile/association/edit')}
            >
              <Edit className="h-4 w-4" />
              Éditer mon profil
            </Button>
            <Button variant="destructive" className="flex items-center gap-2 w-full md:w-auto" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Users className="h-6 w-6 mb-1" />
            <span className="font-bold text-lg">{stats.totalMissions}</span>
            <span className="text-xs text-muted-foreground">Missions créées</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Users className="h-6 w-6 mb-1" />
            <span className="font-bold text-lg">{stats.totalVolunteers}</span>
            <span className="text-xs text-muted-foreground">Bénévoles mobilisés</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Clock className="h-6 w-6 mb-1" />
            <span className="font-bold text-lg">{heuresAffiche}</span>
            <span className="text-xs text-muted-foreground">Heures</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Award className="h-6 w-6 mb-1" />
            <span className="font-bold text-lg">{tauxCompletion}%</span>
            <span className="text-xs text-muted-foreground">Taux de complétion</span>
          </CardContent>
        </Card>
      </div>

      {/* Bio et infos */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Présentation</h3>
          <p className="text-muted-foreground mb-2">
            {organizationProfile.description || "Ajoutez une présentation pour votre association."}
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            {organizationProfile.website_url && (
              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                <Globe className="h-4 w-4" />
                <a href={organizationProfile.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {organizationProfile.website_url}
                </a>
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                {profile.phone}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Missions créées */}
      <Card className="mb-8 border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Missions créées</h3>
            <Button 
              className="flex items-center gap-2"
              onClick={() => navigate('/missions/new')}
            >
              <Plus className="h-4 w-4" />
              Créer une mission
            </Button>
          </div>
          {missions?.length === 0 ? (
            <p className="text-muted-foreground">Aucune mission créée pour l'instant.</p>
          ) : (
            <ul className="space-y-2">
              {missions?.map(m => {
                // Détermination du statut
                let statut = '';
                let badgeClass = '';
                if (m.status === 'annulée') {
                  statut = 'Annulée';
                  badgeClass = 'bg-red-100 text-red-800 border-red-200';
                } else if (m.status === 'terminée') {
                  statut = 'Terminée';
                  badgeClass = 'bg-green-100 text-green-800 border-green-200';
                } else if (m.status === 'active') {
                  statut = 'Active';
                  badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
                } else {
                  statut = m.status;
                  badgeClass = 'bg-gray-100 text-gray-800 border-gray-200';
                }

                return (
                  <li key={m.id} className="flex flex-col md:flex-row md:items-center md:gap-4 border-b py-2">
                    <span className="font-medium">{m.title}</span>
                    <Badge className={badgeClass}>{statut}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(m.start_date).toLocaleDateString('fr-FR')}
                    </span>
                    <Badge variant="outline">{m.format || 'Présentiel'}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {m.participants_count || 0} bénévoles
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="ml-auto mt-2 md:mt-0"
                      onClick={() => navigate(`/missions/${m.id}`)}
                    >
                      Gérer
                    </Button>
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

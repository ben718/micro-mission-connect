import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Phone, Mail, User, Award, Star } from "lucide-react";
import { BadgeDetailModal } from "@/components/profile/BadgeDetailModal";

const ProfileVolunteer = () => {
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const userSkills = profile.user_skills || [];
  const userBadges = profile.user_badges || [];

  const handleBadgeClick = (userBadge: any) => {
    setSelectedBadge(userBadge);
    setIsBadgeModalOpen(true);
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.profile_picture_url || ''} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Annuler" : "Modifier le profil"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {user?.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>Membre depuis {new Date(profile.created_at || '').toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Prénom</label>
                  <Input defaultValue={profile.first_name || ''} />
                </div>
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <Input defaultValue={profile.last_name || ''} />
                </div>
                <div>
                  <label className="text-sm font-medium">Ville</label>
                  <Input defaultValue={profile.city || ''} />
                </div>
                <div>
                  <label className="text-sm font-medium">Code postal</label>
                  <Input defaultValue={profile.postal_code || ''} />
                </div>
                <div>
                  <label className="text-sm font-medium">Adresse</label>
                  <Textarea defaultValue={profile.address || ''} />
                </div>
                <Button className="w-full">Sauvegarder</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                  <p>{profile.first_name} {profile.last_name}</p>
                </div>
                {profile.city && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                    <p>{profile.city} {profile.postal_code}</p>
                  </div>
                )}
                {profile.address && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p>{profile.address}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Mes statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Missions terminées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Heures de bénévolat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userBadges.length}</div>
                <div className="text-sm text-muted-foreground">Badges obtenus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userSkills.length}</div>
                <div className="text-sm text-muted-foreground">Compétences</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compétences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Mes compétences
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userSkills.map((userSkill) => (
                <Badge key={userSkill.id} variant="secondary">
                  {userSkill.skill?.name || 'Compétence inconnue'}
                  {userSkill.level && ` (${userSkill.level})`}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune compétence ajoutée pour le moment.</p>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Mes badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBadges.map((userBadge) => (
                <div 
                  key={userBadge.id} 
                  className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleBadgeClick(userBadge)}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{userBadge.badge?.name || 'Badge inconnu'}</p>
                    <p className="text-sm text-muted-foreground">
                      Obtenu le {new Date(userBadge.acquisition_date || '').toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun badge obtenu pour le moment.</p>
          )}
        </CardContent>
      </Card>

      <BadgeDetailModal
        badge={selectedBadge}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
};

export default ProfileVolunteer;

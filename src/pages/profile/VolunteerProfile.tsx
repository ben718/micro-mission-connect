
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, MapPin, Phone, Mail, User, Award, Star, Settings, Bell, Eye, Heart, Clock } from "lucide-react";

const VolunteerProfile = () => {
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Données fictives pour la démo
  const [volunteerData, setVolunteerData] = useState({
    bio: "Étudiant en communication, j'ai envie de m'engager localement et de mettre mes compétences digitales au service d'une cause.",
    age: 25,
    availability: {
      days: ["lundi", "mercredi", "samedi"],
      frequency: "ponctuel",
      timeSlots: ["matin", "soir"]
    },
    skills: [
      { name: "Rédaction", level: "expert" },
      { name: "Graphisme", level: "intermédiaire" },
      { name: "Logistique", level: "débutant" }
    ],
    interests: ["environnement", "enfance", "culture"],
    experiences: [
      {
        organization: "Les Restos du Cœur",
        mission: "Distribution alimentaire",
        rating: 5,
        comment: "Bénévole très engagé et ponctuel"
      }
    ]
  });

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
                  {volunteerData.age && <span className="text-muted-foreground ml-2">({volunteerData.age} ans)</span>}
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
                    <span>{profile.city} {profile.postal_code}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>Membre depuis {new Date(profile.created_at || '').toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                {isEditing ? (
                  <Textarea
                    placeholder="Présentez-vous en quelques mots..."
                    value={volunteerData.bio}
                    onChange={(e) => setVolunteerData({...volunteerData, bio: e.target.value})}
                    className="min-h-20"
                  />
                ) : (
                  <p className="text-muted-foreground">{volunteerData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disponibilités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Mes disponibilités
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Jours disponibles</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"].map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={volunteerData.availability.days.includes(day)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setVolunteerData({
                                ...volunteerData,
                                availability: {
                                  ...volunteerData.availability,
                                  days: [...volunteerData.availability.days, day]
                                }
                              });
                            } else {
                              setVolunteerData({
                                ...volunteerData,
                                availability: {
                                  ...volunteerData.availability,
                                  days: volunteerData.availability.days.filter(d => d !== day)
                                }
                              });
                            }
                          }}
                        />
                        <label htmlFor={day} className="text-sm capitalize">{day}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Fréquence souhaitée</label>
                  <Select value={volunteerData.availability.frequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ponctuel">Ponctuel</SelectItem>
                      <SelectItem value="regulier">Régulier</SelectItem>
                      <SelectItem value="mission-courte">Mission courte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jours disponibles</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {volunteerData.availability.days.map((day) => (
                      <Badge key={day} variant="secondary" className="capitalize">{day}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fréquence</p>
                  <Badge variant="outline" className="mt-1 capitalize">{volunteerData.availability.frequency}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Centres d'intérêt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Centres d'intérêt & causes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {volunteerData.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="capitalize">
                  {interest}
                </Badge>
              ))}
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
          {volunteerData.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteerData.skills.map((skill, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant={
                      skill.level === 'expert' ? 'default' : 
                      skill.level === 'intermédiaire' ? 'secondary' : 'outline'
                    }>
                      {skill.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune compétence ajoutée pour le moment.</p>
          )}
        </CardContent>
      </Card>

      {/* Expériences bénévoles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Expériences bénévoles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {volunteerData.experiences.length > 0 ? (
            <div className="space-y-4">
              {volunteerData.experiences.map((experience, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{experience.organization}</h4>
                      <p className="text-sm text-muted-foreground">{experience.mission}</p>
                      {experience.comment && (
                        <p className="text-sm mt-2 italic">"{experience.comment}"</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= experience.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune expérience bénévole enregistrée.</p>
          )}
        </CardContent>
      </Card>

      {/* Paramètres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="font-medium">Notifications</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications pour les missions près de chez moi
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="font-medium">Visibilité du profil</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Permettre aux associations de voir mon profil
              </p>
            </div>
            <Switch
              checked={profileVisibility}
              onCheckedChange={setProfileVisibility}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerProfile;

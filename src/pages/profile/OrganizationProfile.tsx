import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, Users, Clock, Calendar, Star, Plus, BarChart2, Settings, User } from "lucide-react";

const OrganizationProfile = () => {
  const { user, profile } = useAuth();
  const { data: organizationProfile, isLoading } = useOrganizationProfile(user?.id);
  const [isEditing, setIsEditing] = useState(false);

  // Données fictives pour la démo
  const [orgData, setOrgData] = useState({
    status: "Association loi 1901",
    mission: "Notre association œuvre pour la protection de l'environnement et la sensibilisation aux enjeux écologiques. Nous organisons des actions de nettoyage, des ateliers de sensibilisation et des projets de plantation d'arbres.",
    videoUrl: "",
    accessibility: "Accessible PMR, transports en commun",
    contact: {
      name: "Marie Dubois",
      email: "contact@ecoactions.org",
      phone: "01 23 45 67 89"
    },
    socialMedia: {
      facebook: "facebook.com/ecoactions",
      instagram: "@ecoactions"
    },
    stats: {
      volunteersCount: 150,
      activeVolunteers: 45,
      hoursOffered: 2340,
      missionsCompleted: 28
    },
    testimonials: [
      {
        author: "Pierre L.",
        rating: 5,
        comment: "Une association formidable avec des missions très enrichissantes !",
        mission: "Nettoyage de plage"
      },
      {
        author: "Sophie M.",
        rating: 4,
        comment: "Bonne organisation et équipe bienveillante.",
        mission: "Atelier compostage"
      }
    ]
  });

  if (isLoading || !organizationProfile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement du profil de l'organisation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header avec bannière */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-green-500"></div>
        <CardContent className="relative -mt-16 pt-16">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={organizationProfile.logo_url || ''} />
                <AvatarFallback>
                  {organizationProfile.organization_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{organizationProfile.organization_name}</h1>
                  <Badge variant="secondary" className="mt-1">{orgData.status}</Badge>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Annuler" : "Modifier le profil"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                {organizationProfile.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{organizationProfile.address}</span>
                  </div>
                )}
                {organizationProfile.website_url && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={organizationProfile.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Site web
                    </a>
                  </div>
                )}
                {orgData.contact.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{orgData.contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Users className="h-6 w-6 mb-1 text-blue-500" />
            <span className="font-bold text-lg">{orgData.stats.volunteersCount}</span>
            <span className="text-xs text-muted-foreground">Bénévoles inscrits</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Users className="h-6 w-6 mb-1 text-green-500" />
            <span className="font-bold text-lg">{orgData.stats.activeVolunteers}</span>
            <span className="text-xs text-muted-foreground">Bénévoles actifs</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Clock className="h-6 w-6 mb-1 text-orange-500" />
            <span className="font-bold text-lg">{orgData.stats.hoursOffered}h</span>
            <span className="text-xs text-muted-foreground">Heures offertes</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-4">
            <Calendar className="h-6 w-6 mb-1 text-purple-500" />
            <span className="font-bold text-lg">{orgData.stats.missionsCompleted}</span>
            <span className="text-xs text-muted-foreground">Missions terminées</span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="about" className="space-y-6">
        <TabsList>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="reviews">Avis & retours</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        {/* À propos */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Présentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Textarea
                  value={orgData.mission}
                  onChange={(e) => setOrgData({...orgData, mission: e.target.value})}
                  className="min-h-32"
                />
              ) : (
                <p className="text-muted-foreground">{orgData.mission}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lieux d'action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{organizationProfile.address}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{orgData.accessibility}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact bénévole</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{orgData.contact.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{orgData.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{orgData.contact.phone}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Missions */}
        <TabsContent value="missions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Missions proposées</h3>
            <Button asChild>
              <Link to="/missions/new">
                <Plus className="w-4 h-4 mr-2" />
                Créer une mission
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Aucune mission active pour le moment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avis & retours */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Témoignages de bénévoles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orgData.testimonials.map((testimonial, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{testimonial.author}</span>
                          <Badge variant="outline">{testimonial.mission}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">"{testimonial.comment}"</p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Gestion des demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fonctionnalité de gestion des demandes de bénévolat à venir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Statistiques détaillées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Statistiques avancées disponibles prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationProfile;

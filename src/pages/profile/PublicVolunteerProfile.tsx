
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, User, Award, Star, Heart, Clock, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PublicVolunteerProfile = () => {
  const { userId } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-volunteer-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_skills (
            *,
            skills (*)
          ),
          user_badges (
            *,
            badges (*)
          )
        `)
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Données fictives pour la démo
  const volunteerData = {
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
  };

  if (isLoading) {
    return (
      <div className="container py-4 sm:py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto sm:mx-0" />
              <div className="space-y-2 text-center sm:text-left">
                <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-4 sm:py-8">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Profil non trouvé</p>
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 sm:py-8 space-y-6">
      {/* Bouton retour */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
      </Button>

      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 self-center md:self-start">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                <AvatarImage src={profile.profile_picture_url || ''} />
                <AvatarFallback>
                  <User className="w-10 h-10 sm:w-12 sm:h-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold break-words">
                  {profile.first_name} {profile.last_name}
                  {volunteerData.age && (
                    <span className="text-muted-foreground ml-2 text-base sm:text-lg">
                      ({volunteerData.age} ans)
                    </span>
                  )}
                </h1>
                <div className="flex justify-center md:justify-start mt-2">
                  <Badge variant="secondary">Bénévole</Badge>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                {profile.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{profile.city} {profile.postal_code}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    Membre depuis {new Date(profile.created_at || '').toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <p className="text-muted-foreground text-sm sm:text-base">{volunteerData.bio}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pour organiser le contenu */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="text-xs sm:text-sm">Informations</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs sm:text-sm">Compétences</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs sm:text-sm">Expériences</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Disponibilités */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Disponibilités
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Jours disponibles</p>
                  <div className="flex flex-wrap gap-2">
                    {volunteerData.availability.days.map((day) => (
                      <Badge key={day} variant="secondary" className="text-xs capitalize">{day}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Fréquence</p>
                  <Badge variant="outline" className="text-xs capitalize">{volunteerData.availability.frequency}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Centres d'intérêt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5" />
                  Centres d'intérêt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {volunteerData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs capitalize">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                Compétences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {volunteerData.skills.map((skill, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm sm:text-base">{skill.name}</span>
                      <Badge variant={
                        skill.level === 'expert' ? 'default' : 
                        skill.level === 'intermédiaire' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {skill.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5" />
                Expériences bénévoles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {volunteerData.experiences.map((experience, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm sm:text-base">{experience.organization}</h4>
                        <p className="text-sm text-muted-foreground">{experience.mission}</p>
                        {experience.comment && (
                          <p className="text-sm mt-2 italic">"{experience.comment}"</p>
                        )}
                      </div>
                      <div className="flex gap-1 self-center sm:self-start">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicVolunteerProfile;

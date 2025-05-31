
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Mail, User, Award, Star, Heart, Clock, ArrowLeft } from "lucide-react";
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

  // Données fictives pour la démo (comme dans VolunteerProfile.tsx)
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
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Profil non trouvé</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Bouton retour */}
      <Button variant="ghost" asChild>
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
      </Button>

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
              <div>
                <h1 className="text-2xl font-bold">
                  {profile.first_name} {profile.last_name}
                  {volunteerData.age && <span className="text-muted-foreground ml-2">({volunteerData.age} ans)</span>}
                </h1>
                <Badge variant="secondary">Bénévole</Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground">
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
                <p className="text-muted-foreground">{volunteerData.bio}</p>
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
              Disponibilités
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            Compétences
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicVolunteerProfile;

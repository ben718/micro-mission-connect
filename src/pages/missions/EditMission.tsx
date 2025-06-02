
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationProfile } from "@/hooks/useOrganizationProfile";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditMission = () => {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: organizationProfile, isLoading: profileLoading, error: profileError } = useOrganizationProfile(user?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mission, setMission] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    duration_minutes: 60,
    location: "",
    format: "présentiel",
    difficulty_level: "débutant",
    engagement_level: "petit coup de main",
    available_spots: 1,
    status: "active"
  });

  useEffect(() => {
    // Si on a une erreur de profil ou pas d'utilisateur, rediriger
    if (!user || profileError) {
      console.log('No user or profile error:', { user, profileError });
      navigate("/login");
      return;
    }

    // Si le profil est chargé et qu'on a un ID de mission
    if (!profileLoading && organizationProfile && missionId) {
      fetchMission();
    } else if (!profileLoading && !organizationProfile) {
      // L'utilisateur n'est pas une organisation
      toast.error("Vous devez être connecté en tant qu'organisation pour modifier une mission");
      navigate("/dashboard");
    }
  }, [user, profileLoading, organizationProfile, missionId, profileError, navigate]);

  const fetchMission = async () => {
    if (!organizationProfile || !missionId) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching mission with ID:', missionId);
      
      const { data: mission, error } = await supabase
        .from("missions")
        .select("*")
        .eq("id", missionId)
        .single();

      if (error) {
        console.error('Error fetching mission:', error);
        throw error;
      }

      console.log('Mission fetched:', mission);

      // Vérifier que l'organisation a le droit de modifier cette mission
      if (mission.organization_id !== organizationProfile.id) {
        toast.error("Vous n'avez pas l'autorisation de modifier cette mission");
        navigate("/dashboard");
        return;
      }

      setMission(mission);
      setFormData({
        ...mission,
        start_date: new Date(mission.start_date)
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la mission:", error);
      toast.error("Erreur lors de la récupération de la mission");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationProfile) {
      toast.error("Profil organisation non trouvé");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("missions")
        .update({
          ...formData,
          start_date: formData.start_date.toISOString(),
          organization_id: organizationProfile.id
        })
        .eq("id", missionId);

      if (error) throw error;

      toast.success("Mission mise à jour avec succès");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la mission:", error);
      toast.error("Erreur lors de la mise à jour de la mission");
    } finally {
      setIsSaving(false);
    }
  };

  // Affichage de chargement pour le profil
  if (profileLoading) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement du profil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage de chargement pour la mission
  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement de la mission...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérification si l'utilisateur est une organisation
  if (!organizationProfile) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6">
            <p>Vous devez être connecté en tant qu'organisation pour modifier une mission.</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <Card>
        <CardHeader>
          <CardTitle>Modifier la mission</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la mission</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? (
                        format(formData.start_date, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => date && setFormData({ ...formData, start_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  required
                  min="15"
                  step="15"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spots">Nombre de places disponibles</Label>
                <Input
                  id="spots"
                  type="number"
                  value={formData.available_spots}
                  onChange={(e) => setFormData({ ...formData, available_spots: parseInt(e.target.value) })}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="présentiel">Présentiel</SelectItem>
                    <SelectItem value="distanciel">Distanciel</SelectItem>
                    <SelectItem value="hybride">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Niveau de difficulté</Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="avancé">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagement">Niveau d'engagement</Label>
                <Select
                  value={formData.engagement_level}
                  onValueChange={(value) => setFormData({ ...formData, engagement_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petit coup de main">Petit coup de main</SelectItem>
                    <SelectItem value="engagement moyen">Engagement moyen</SelectItem>
                    <SelectItem value="engagement fort">Engagement fort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Mise à jour..." : "Mettre à jour la mission"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMission;

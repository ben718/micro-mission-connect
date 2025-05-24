import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrganizationProfile {
  id: string;
  user_id: string;
  organization_name: string;
  description: string;
  logo_url: string;
  website_url: string;
  address: string;
  latitude: number;
  longitude: number;
  sector_id: string;
  siret_number: string;
  creation_date: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  duration_minutes: number;
  format: string;
  location: string;
  available_spots: number;
  difficulty_level: string;
  engagement_level: string;
  desired_impact: string;
  status: string;
}

export const useOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("organization_profiles")
        .select(`
          *,
          sector:organization_sectors (*)
        `)
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération du profil organisation:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement du profil");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganizationProfile = async (profileId: string, updates: Partial<OrganizationProfile>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("organization_profiles")
        .update(updates)
        .eq("id", profileId);

      if (error) throw error;

      toast.success("Profil mis à jour avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError(error.message);
      toast.error("Erreur lors de la mise à jour du profil");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const createMission = async (missionData: Omit<Mission, "id">) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("missions")
        .insert([missionData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Mission créée avec succès !");
      return { success: true, mission: data };
    } catch (error: any) {
      console.error("Erreur lors de la création de la mission:", error);
      setError(error.message);
      toast.error("Erreur lors de la création de la mission");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateMission = async (missionId: string, updates: Partial<Mission>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("missions")
        .update(updates)
        .eq("id", missionId);

      if (error) throw error;

      toast.success("Mission mise à jour avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la mission:", error);
      setError(error.message);
      toast.error("Erreur lors de la mise à jour de la mission");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteMission = async (missionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("missions")
        .delete()
        .eq("id", missionId);

      if (error) throw error;

      toast.success("Mission supprimée avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la mission:", error);
      setError(error.message);
      toast.error("Erreur lors de la suppression de la mission");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationMissions = async (organizationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("missions")
        .select(`
          *,
          registrations:mission_registrations (
            *,
            user:user_id (
              first_name,
              last_name,
              profile_picture_url
            )
          )
        `)
        .eq("organization_id", organizationId)
        .order("start_date", { ascending: false });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des missions:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement des missions");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (
    registrationId: string,
    status: "confirmé" | "annulé" | "terminé"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("mission_registrations")
        .update({ status })
        .eq("id", registrationId);

      if (error) throw error;

      toast.success("Statut de l'inscription mis à jour avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setError(error.message);
      toast.error("Erreur lors de la mise à jour du statut");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchOrganizationProfile,
    updateOrganizationProfile,
    createMission,
    updateMission,
    deleteMission,
    fetchOrganizationMissions,
    updateRegistrationStatus,
  };
}; 
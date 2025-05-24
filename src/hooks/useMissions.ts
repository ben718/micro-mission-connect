import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  format: string;
  difficulty_level: string;
  engagement_level: string;
  desired_impact: string;
  location: string;
  latitude: number;
  longitude: number;
  start_date: string;
  duration_minutes: number;
  available_spots: number;
  organization: {
    organization_name: string;
    logo_url: string;
  };
  required_skills: string[];
}

interface MissionFilters {
  searchQuery: string;
  format: string[];
  difficulty: string[];
  engagement: string[];
  distance: number;
  skills: string[];
  sectors: string[];
  types: string[];
}

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async (filters?: MissionFilters) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("available_missions_details")
        .select("*")
        .order("start_date", { ascending: true });

      // Appliquer les filtres si présents
      if (filters) {
        if (filters.searchQuery) {
          query = query.ilike("title", `%${filters.searchQuery}%`);
        }

        if (filters.format.length > 0) {
          query = query.in("format", filters.format);
        }

        if (filters.difficulty.length > 0) {
          query = query.in("difficulty_level", filters.difficulty);
        }

        if (filters.engagement.length > 0) {
          query = query.in("engagement_level", filters.engagement);
        }

        if (filters.skills.length > 0) {
          query = query.contains("required_skills", filters.skills);
        }

        if (filters.sectors.length > 0) {
          query = query.in("sector_name", filters.sectors);
        }

        if (filters.types.length > 0) {
          query = query.in("mission_type_name", filters.types);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setMissions(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des missions:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  const fetchMissionById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("available_missions_details")
        .select("*")
        .eq("mission_id", id)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération de la mission:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement de la mission");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerToMission = async (missionId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("mission_registrations")
        .insert([
          {
            user_id: userId,
            mission_id: missionId,
            status: "inscrit",
          },
        ]);

      if (error) throw error;

      toast.success("Inscription à la mission réussie !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de l'inscription à la mission:", error);
      setError(error.message);
      toast.error("Erreur lors de l'inscription à la mission");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistration = async (missionId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("mission_registrations")
        .update({ status: "annulé" })
        .match({ mission_id: missionId, user_id: userId });

      if (error) throw error;

      toast.success("Inscription annulée avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de l'annulation de l'inscription:", error);
      setError(error.message);
      toast.error("Erreur lors de l'annulation de l'inscription");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMissions = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("mission_registrations")
        .select(`
          *,
          missions:mission_id (
            *,
            organization:organization_id (
              organization_name,
              logo_url
            )
          )
        `)
        .eq("user_id", userId)
        .order("registration_date", { ascending: false });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des missions de l'utilisateur:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement de vos missions");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    missions,
    loading,
    error,
    fetchMissions,
    fetchMissionById,
    registerToMission,
    cancelRegistration,
    fetchUserMissions,
  };
}; 
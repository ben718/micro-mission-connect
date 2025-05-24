import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  bio: string;
  phone: string;
  city: string;
  postal_code: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface UserSkill {
  id: string;
  skill_id: string;
  level: string;
  validation_date: string;
  validator_id: string;
}

interface UserBadge {
  id: string;
  badge_id: string;
  acquisition_date: string;
}

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération du profil:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement du profil");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

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

  const fetchUserSkills = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("user_skills")
        .select(`
          *,
          skill:skill_id (
            name,
            description,
            category
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des compétences:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement des compétences");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addUserSkill = async (userId: string, skillId: string, level: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("user_skills")
        .insert([
          {
            user_id: userId,
            skill_id: skillId,
            level,
          },
        ]);

      if (error) throw error;

      toast.success("Compétence ajoutée avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de la compétence:", error);
      setError(error.message);
      toast.error("Erreur lors de l'ajout de la compétence");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserSkill = async (skillId: string, updates: Partial<UserSkill>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from("user_skills")
        .update(updates)
        .eq("id", skillId);

      if (error) throw error;

      toast.success("Compétence mise à jour avec succès !");
      return { success: true };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la compétence:", error);
      setError(error.message);
      toast.error("Erreur lors de la mise à jour de la compétence");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBadges = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:badge_id (
            name,
            description,
            image_url
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des badges:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement des badges");
      return null;
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
          mission:mission_id (
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
      console.error("Erreur lors de la récupération des missions:", error);
      setError(error.message);
      toast.error("Erreur lors du chargement des missions");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    fetchUserSkills,
    addUserSkill,
    updateUserSkill,
    fetchUserBadges,
    fetchUserMissions,
  };
}; 
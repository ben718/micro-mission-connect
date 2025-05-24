
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type City = {
  id: string;
  name: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
};

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  created_at: string;
};

export type Skill = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        // Extraire les villes uniques des missions
        const { data: missionCities, error: missionError } = await supabase
          .from('missions')
          .select('location, postal_code')
          .not('location', 'is', null)
          .order('location', { ascending: true });
        
        if (missionError) throw missionError;
        
        // Construire un ensemble de villes uniques
        const uniqueCities: Record<string, City> = {};
        missionCities?.forEach((item, index) => {
          if (item.location && !uniqueCities[item.location]) {
            uniqueCities[item.location] = {
              id: `city-${index}`,
              name: item.location,
              postal_code: item.postal_code || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
        });
        
        setCities(Object.values(uniqueCities));
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors du chargement des villes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
}

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("badges")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setBadges(data as Badge[]);
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors du chargement des badges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  return { badges, loading, error };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("skills")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setSkills(data as Skill[]);
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors du chargement des compétences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
}

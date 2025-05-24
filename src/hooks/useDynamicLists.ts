
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type City = {
  id: string;
  name: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  created_at: string;
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

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setCategories(data as Category[]);
      } catch (err) {
        setError(err as Error);
        console.error("Erreur lors du chargement des catégories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        // Vérifier d'abord si la table cities existe
        const { data: tableInfo, error: tableError } = await supabase
          .from('cities')
          .select('count(*)', { count: 'exact', head: true });
        
        // Si la table n'existe pas, nous utiliserons une approche alternative
        if (tableError || tableInfo === null) {
          // Alternative: extraire les villes uniques des missions
          const { data: missionCities, error: missionError } = await supabase
            .from('missions')
            .select('city, postal_code')
            .not('city', 'is', null)
            .order('city', { ascending: true });
          
          if (missionError) throw missionError;
          
          // Construire un ensemble de villes uniques
          const uniqueCities: Record<string, City> = {};
          missionCities?.forEach((item, index) => {
            if (item.city && !uniqueCities[item.city]) {
              uniqueCities[item.city] = {
                id: `city-${index}`,
                name: item.city,
                postal_code: item.postal_code || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
            }
          });
          
          setCities(Object.values(uniqueCities));
        } else {
          // Si la table cities existe, l'utiliser normalement
          const { data, error } = await supabase
            .from('cities')
            .select('*')
            .order('name', { ascending: true });
          
          if (error) throw error;
          setCities(data as City[]);
        }
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
        // En réalité, il faudrait avoir une table de compétences
        // Pour l'instant, retournons quelques compétences par défaut
        const mockSkills: Skill[] = [
          { id: "1", name: "Communication", created_at: new Date().toISOString() },
          { id: "2", name: "Développement web", created_at: new Date().toISOString() },
          { id: "3", name: "Design graphique", created_at: new Date().toISOString() },
          { id: "4", name: "Cuisine", created_at: new Date().toISOString() },
          { id: "5", name: "Jardinage", created_at: new Date().toISOString() },
          { id: "6", name: "Photographie", created_at: new Date().toISOString() }
        ];
        setSkills(mockSkills);
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

export function useDynamicLists() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const { badges, loading: badgesLoading, error: badgesError } = useBadges();
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  
  const isLoading = categoriesLoading || citiesLoading || badgesLoading || skillsLoading;
  const error = categoriesError || citiesError || badgesError || skillsError;
  
  return {
    categories,
    cities,
    badges,
    skills,
    isLoading,
    error
  };
}


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface City {
  id: string;
  name: string;
  postal_code: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
}

export const useDynamicLists = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for now since tables might not exist
        setCategories([
          { id: "1", name: "Environnement", description: "Actions environnementales" },
          { id: "2", name: "Social", description: "Aide sociale" },
          { id: "3", name: "Éducation", description: "Soutien éducatif" },
          { id: "4", name: "Santé", description: "Aide à la santé" },
        ]);
        
        setCities([
          { id: "1", name: "Paris", postal_code: "75000" },
          { id: "2", name: "Lyon", postal_code: "69000" },
          { id: "3", name: "Marseille", postal_code: "13000" },
          { id: "4", name: "Toulouse", postal_code: "31000" },
        ]);
        
        setSkills([
          { id: "1", name: "Communication", description: "Compétences en communication" },
          { id: "2", name: "Informatique", description: "Compétences informatiques" },
          { id: "3", name: "Organisation", description: "Compétences organisationnelles" },
          { id: "4", name: "Langues", description: "Compétences linguistiques" },
        ]);
        
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    categories,
    cities,
    skills,
    isLoading,
    error,
  };
};

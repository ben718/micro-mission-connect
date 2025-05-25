
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("mission_types")
          .select("id, name")
          .order("name");

        if (error) throw error;
        setCategories(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Get unique cities from missions
        const { data, error } = await supabase
          .from("missions")
          .select("location")
          .not("location", "is", null)
          .order("location");

        if (error) throw error;
        
        // Create unique cities list
        const uniqueCities = Array.from(new Set(data?.map(item => item.location)))
          .map((location, index) => ({
            id: `city-${index}`,
            name: location
          }));

        setCities(uniqueCities);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};

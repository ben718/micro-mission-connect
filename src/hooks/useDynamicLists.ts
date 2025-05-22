import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface City {
  id: string;
  name: string;
  postal_code: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 heure
const CACHE_KEYS = {
  categories: 'mb_categories_cache',
  cities: 'mb_cities_cache',
  skills: 'mb_skills_cache',
};

interface CacheData<T> {
  data: T[];
  timestamp: number;
}

const getCachedData = <T>(key: string): T[] | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp }: CacheData<T> = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

const setCachedData = <T>(key: string, data: T[]): void => {
  const cacheData: CacheData<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export const useDynamicLists = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      // Récupération des catégories
      let categoriesData = !forceRefresh ? getCachedData<Category>(CACHE_KEYS.categories) : null;
      if (!categoriesData) {
        const { data, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (categoriesError) throw categoriesError;
        categoriesData = data || [];
        setCachedData(CACHE_KEYS.categories, categoriesData);
      }
      setCategories(categoriesData);

      // Récupération des villes
      let citiesData = !forceRefresh ? getCachedData<City>(CACHE_KEYS.cities) : null;
      if (!citiesData) {
        const { data, error: citiesError } = await supabase
          .from('cities')
          .select('id, name, postal_code')
          .order('name');
        if (citiesError) throw citiesError;
        citiesData = (data || []).map(city => ({
          id: city.id,
          name: city.name,
          postal_code: city.postal_code
        }));
        setCachedData(CACHE_KEYS.cities, citiesData);
      }
      setCities(citiesData);

      // Récupération des compétences
      let skillsData = !forceRefresh ? getCachedData<Skill>(CACHE_KEYS.skills) : null;
      if (!skillsData) {
        const { data, error: skillsError } = await supabase
          .from('badges')
          .select('*')
          .order('name');
        if (skillsError) throw skillsError;
        skillsData = data || [];
        setCachedData(CACHE_KEYS.skills, skillsData);
      }
      setSkills(skillsData);

    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des listes');
      console.error('Erreur de chargement des listes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return {
    categories,
    cities,
    skills,
    isLoading,
    error,
    refreshLists: () => fetchLists(true),
  };
}; 
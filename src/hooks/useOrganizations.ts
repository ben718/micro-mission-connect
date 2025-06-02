import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('verified', true)
        .order('name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setOrganizations(data || []);
    } catch (err) {
      logger.error('Erreur lors de la récupération des organisations:', err);
      setError('Impossible de charger les organisations');
    } finally {
      setLoading(false);
    }
  };

  const getOrganizationById = async (id: string): Promise<Organization | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      return data;
    } catch (err) {
      logger.error('Erreur lors de la récupération de l\'organisation:', err);
      return null;
    }
  };

  const getOrganizationsByCategory = async (category: string): Promise<Organization[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('category', category)
        .eq('verified', true)
        .order('name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      return data || [];
    } catch (err) {
      logger.error('Erreur lors de la récupération des organisations par catégorie:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    error,
    fetchOrganizations,
    getOrganizationById,
    getOrganizationsByCategory
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface Mission {
  id: string;
  title: string;
  description: string;
  organization_id: string;
  organization?: {
    organization_name: string;
    logo_url?: string;
  };
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date: string;
  start_time: string;
  end_time: string;
  participants_needed: number;
  participants_current: number;
  status: 'active' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('missions')
        .select(`
          *,
          organization:organization_profiles(
            organization_name,
            logo_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setMissions(data || []);
    } catch (err) {
      logger.error('Erreur lors de la récupération des missions:', err);
      setError('Impossible de charger les missions');
    } finally {
      setLoading(false);
    }
  };

  const getMissionById = async (id: string): Promise<Mission | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('missions')
        .select(`
          *,
          organization:organization_profiles(
            organization_name,
            logo_url
          )
        `)
        .eq('id', id)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      return data;
    } catch (err) {
      logger.error('Erreur lors de la récupération de la mission:', err);
      return null;
    }
  };

  const getMissionsByLocation = async (
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<Mission[]> => {
    try {
      // Pour l'instant, on récupère toutes les missions et on filtre côté client
      // Dans une vraie implémentation, on utiliserait une fonction PostGIS
      const { data, error: supabaseError } = await supabase
        .from('missions')
        .select(`
          *,
          organization:organization_profiles(
            organization_name,
            logo_url
          )
        `)
        .eq('status', 'active');

      if (supabaseError) {
        throw supabaseError;
      }

      // Filtrage basique par distance (à améliorer avec PostGIS)
      const filteredMissions = (data || []).filter((mission) => {
        if (!mission.latitude || !mission.longitude) return true;
        
        const distance = calculateDistance(
          latitude,
          longitude,
          mission.latitude,
          mission.longitude
        );
        
        return distance <= radiusKm;
      });

      return filteredMissions;
    } catch (err) {
      logger.error('Erreur lors de la récupération des missions par localisation:', err);
      return [];
    }
  };

  const joinMission = async (missionId: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('mission_registrations')
        .insert({
          mission_id: missionId,
          status: 'pending'
        });

      if (supabaseError) {
        throw supabaseError;
      }

      // Rafraîchir les missions après inscription
      await fetchMissions();
      return true;
    } catch (err) {
      logger.error('Erreur lors de l\'inscription à la mission:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return {
    missions,
    loading,
    error,
    fetchMissions,
    getMissionById,
    getMissionsByLocation,
    joinMission
  };
};

// Fonction utilitaire pour calculer la distance entre deux points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};


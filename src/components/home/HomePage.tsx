
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import { SearchSection } from './SearchSection';
import TestimonialsSection from './TestimonialsSection';
import CtaSection from './CtaSection';
import type { MissionWithOrganization } from '@/types/mission';

const HomePage = () => {
  const [recentMissions, setRecentMissions] = useState<MissionWithOrganization[]>([]);
  const [nearbyMissions, setNearbyMissions] = useState<MissionWithOrganization[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        // Récupérer les missions récentes
        const { data: recentData } = await supabase
          .from('available_missions_details')
          .select('*')
          .order('start_date', { ascending: false })
          .limit(6);

        if (recentData) {
          const formattedRecent = recentData.map((mission) => ({
            ...mission,
            id: mission.mission_id,
            organization: {
              organization_name: mission.organization_name,
              logo_url: mission.logo_url,
            },
            required_skills: mission.required_skills || [],
            // Map missing properties with defaults
            address: mission.address || '',
            created_at: mission.created_at || new Date().toISOString(),
            end_date: mission.end_date || mission.start_date,
            geo_location: null,
            image_url: mission.image_url || '',
            latitude: mission.latitude || 0,
            longitude: mission.longitude || 0,
            participants: mission.participants_count || 0,
            updated_at: mission.updated_at || new Date().toISOString(),
          })) as MissionWithOrganization[];
          setRecentMissions(formattedRecent);
        }

        // Récupérer les missions à proximité (simulé pour l'instant)
        const { data: nearbyData } = await supabase
          .from('available_missions_details')
          .select('*')
          .order('start_date', { ascending: true })
          .limit(6);

        if (nearbyData) {
          const formattedNearby = nearbyData.map((mission) => ({
            ...mission,
            id: mission.mission_id,
            organization: {
              organization_name: mission.organization_name,
              logo_url: mission.logo_url,
            },
            required_skills: mission.required_skills || [],
            // Map missing properties with defaults
            address: mission.address || '',
            created_at: mission.created_at || new Date().toISOString(),
            end_date: mission.end_date || mission.start_date,
            geo_location: null,
            image_url: mission.image_url || '',
            latitude: mission.latitude || 0,
            longitude: mission.longitude || 0,
            participants: mission.participants_count || 0,
            updated_at: mission.updated_at || new Date().toISOString(),
          })) as MissionWithOrganization[];
          setNearbyMissions(formattedNearby);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
      }
    };

    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <SearchSection />
      <FeatureSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;

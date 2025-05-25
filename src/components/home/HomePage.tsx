
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import SearchSection from './SearchSection';
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

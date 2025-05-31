
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
            id: mission.mission_id,
            title: mission.title || '',
            description: mission.description || '',
            start_date: mission.start_date,
            end_date: mission.start_date,
            duration_minutes: mission.duration_minutes || 0,
            available_spots: mission.available_spots || 0,
            location: mission.location || '',
            address: mission.location || '',
            latitude: mission.latitude || 0,
            longitude: mission.longitude || 0,
            image_url: mission.image_url || '',
            format: mission.format || '',
            difficulty_level: mission.difficulty_level || '',
            engagement_level: mission.engagement_level || '',
            desired_impact: mission.desired_impact || '',
            status: 'active',
            mission_type_id: '',
            organization_id: '',
            postal_code: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            geo_location: null,
            required_skills: mission.required_skills || [],
            participants_count: 0, // Add missing property
            organization: {
              id: '',
              user_id: '',
              organization_name: mission.organization_name || '',
              description: '',
              address: '',
              latitude: 0,
              longitude: 0,
              location: null,
              website_url: '',
              logo_url: mission.logo_url || '',
              siret_number: '',
              creation_date: '',
              sector_id: '',
              created_at: '',
              updated_at: ''
            },
            // Legacy compatibility fields
            category: mission.mission_type_name,
            date: mission.start_date ? new Date(mission.start_date).toLocaleDateString() : '',
            timeSlot: mission.start_date ? new Date(mission.start_date).toLocaleTimeString() : '',
            duration: mission.duration_minutes ? `${Math.floor(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 || ''}` : '',
            participants: `0/${mission.available_spots || 0}`
          })) as MissionWithOrganization[];
          setRecentMissions(formattedRecent);
        }

        // Récupérer les missions à proximité
        const { data: nearbyData } = await supabase
          .from('available_missions_details')
          .select('*')
          .order('start_date', { ascending: true })
          .limit(6);

        if (nearbyData) {
          const formattedNearby = nearbyData.map((mission) => ({
            id: mission.mission_id,
            title: mission.title || '',
            description: mission.description || '',
            start_date: mission.start_date,
            end_date: mission.start_date,
            duration_minutes: mission.duration_minutes || 0,
            available_spots: mission.available_spots || 0,
            location: mission.location || '',
            address: mission.location || '',
            latitude: mission.latitude || 0,
            longitude: mission.longitude || 0,
            image_url: mission.image_url || '',
            format: mission.format || '',
            difficulty_level: mission.difficulty_level || '',
            engagement_level: mission.engagement_level || '',
            desired_impact: mission.desired_impact || '',
            status: 'active',
            mission_type_id: '',
            organization_id: '',
            postal_code: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            geo_location: null,
            required_skills: mission.required_skills || [],
            participants_count: 0, // Add missing property
            organization: {
              id: '',
              user_id: '',
              organization_name: mission.organization_name || '',
              description: '',
              address: '',
              latitude: 0,
              longitude: 0,
              location: null,
              website_url: '',
              logo_url: mission.logo_url || '',
              siret_number: '',
              creation_date: '',
              sector_id: '',
              created_at: '',
              updated_at: ''
            },
            // Legacy compatibility fields
            category: mission.mission_type_name,
            date: mission.start_date ? new Date(mission.start_date).toLocaleDateString() : '',
            timeSlot: mission.start_date ? new Date(mission.start_date).toLocaleTimeString() : '',
            duration: mission.duration_minutes ? `${Math.floor(mission.duration_minutes / 60)}h${mission.duration_minutes % 60 || ''}` : '',
            participants: `0/${mission.available_spots || 0}`
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

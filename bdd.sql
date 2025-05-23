-- Début de la transaction pour garantir l'atomicité
BEGIN;

-- Suppression des objets existants dans l'ordre inverse de leurs dépendances
DO $$ 
DECLARE
    trigger_record RECORD;
BEGIN
    -- Suppression des triggers (uniquement ceux qui existent)
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 
            trigger_record.trigger_name, 
            trigger_record.event_object_table);
    END LOOP;

    -- Suppression spécifique du trigger sur auth.users
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    -- Suppression des fonctions avec CASCADE pour gérer les dépendances
    DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
    DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
    DROP FUNCTION IF EXISTS public.update_mission_spots() CASCADE;
    DROP FUNCTION IF EXISTS public.notify_new_registration() CASCADE;
    DROP FUNCTION IF EXISTS public.notify_mission_reminder() CASCADE;
    DROP FUNCTION IF EXISTS public.notify_volunteer_cancellation() CASCADE;
    DROP FUNCTION IF EXISTS public.notify_mission_validated() CASCADE;
    DROP FUNCTION IF EXISTS public.notify_mission_cancelled() CASCADE;
    DROP FUNCTION IF EXISTS public.check_and_award_badges() CASCADE;
    DROP FUNCTION IF EXISTS public.handle_location_update() CASCADE;
    DROP FUNCTION IF EXISTS public.refresh_suggestions_on_location_change() CASCADE;
    DROP FUNCTION IF EXISTS public.notify_location_change() CASCADE;
    DROP FUNCTION IF EXISTS public.calculate_distance() CASCADE;
    DROP FUNCTION IF EXISTS public.update_user_location() CASCADE;
    DROP FUNCTION IF EXISTS public.find_nearby_missions() CASCADE;
    DROP FUNCTION IF EXISTS public.find_nearby_volunteers() CASCADE;
    DROP FUNCTION IF EXISTS public.cluster_nearby_missions() CASCADE;
    DROP FUNCTION IF EXISTS public.get_distance_statistics() CASCADE;
    DROP FUNCTION IF EXISTS public.manage_location_webhook() CASCADE;
    DROP FUNCTION IF EXISTS public.geocode_address() CASCADE;
    DROP FUNCTION IF EXISTS public.calculate_travel_time() CASCADE;
    DROP FUNCTION IF EXISTS public.update_mission_coordinates() CASCADE;
    DROP FUNCTION IF EXISTS public.get_missions_with_travel_time() CASCADE;
    DROP FUNCTION IF EXISTS public.optimize_mission_route() CASCADE;
    DROP FUNCTION IF EXISTS public.get_optimized_route_details() CASCADE;
    DROP FUNCTION IF EXISTS public.suggest_complementary_missions() CASCADE;

    -- Suppression des vues
    DROP VIEW IF EXISTS public.user_badges_details;
    DROP VIEW IF EXISTS public.suggested_missions;
    DROP VIEW IF EXISTS public.my_suggested_missions;

    -- Suppression des politiques RLS
    DROP POLICY IF EXISTS cities_select ON public.cities;
    DROP POLICY IF EXISTS cities_insert ON public.cities;
    DROP POLICY IF EXISTS cities_update ON public.cities;
    DROP POLICY IF EXISTS cities_delete ON public.cities;

    -- Suppression des tables dans l'ordre inverse des dépendances
    DROP TABLE IF EXISTS public.optimized_routes CASCADE;
    DROP TABLE IF EXISTS public.travel_time_cache CASCADE;
    DROP TABLE IF EXISTS public.geocoding_cache CASCADE;
    DROP TABLE IF EXISTS public.location_webhooks CASCADE;
    DROP TABLE IF EXISTS public.feedbacks CASCADE;
    DROP TABLE IF EXISTS public.notifications CASCADE;
    DROP TABLE IF EXISTS public.volunteer_skills CASCADE;
    DROP TABLE IF EXISTS public.skills CASCADE;
    DROP TABLE IF EXISTS public.volunteer_preferences CASCADE;
    DROP TABLE IF EXISTS public.volunteer_availability CASCADE;
    DROP TABLE IF EXISTS public.mission_type_links CASCADE;
    DROP TABLE IF EXISTS public.mission_types CASCADE;
    DROP TABLE IF EXISTS public.profile_categories CASCADE;
    DROP TABLE IF EXISTS public.association_categories CASCADE;
    DROP TABLE IF EXISTS public.mission_categories CASCADE;
    DROP TABLE IF EXISTS public.mission_participants CASCADE;
    DROP TABLE IF EXISTS public.missions CASCADE;
    DROP TABLE IF EXISTS public.user_badges CASCADE;
    DROP TABLE IF EXISTS public.badges CASCADE;
    DROP TABLE IF EXISTS public.categories CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;
    DROP TABLE IF EXISTS public.cities CASCADE;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur lors de la suppression des objets: %', SQLERRM;
    RAISE;
END $$;

-- Fonction pour mettre à jour automatiquement le timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.updated_at IS NULL OR NEW.updated_at = OLD.updated_at THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la mise à jour du timestamp: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table des profils utilisateurs (bénévoles et associations) - créée sans RLS d'abord
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) DEFAULT 'Inconnu',
  last_name VARCHAR(100) DEFAULT 'Utilisateur',
  avatar_url VARCHAR(255) DEFAULT '',
  bio VARCHAR(1000),
  phone VARCHAR(20),
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_association BOOLEAN DEFAULT false NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL
);

-- Ajout des colonnes de géolocalisation à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE;

-- Table des villes
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ajout de la référence à cities après sa création
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- Activation des politiques RLS pour cities
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY cities_select ON public.cities
    FOR SELECT USING (true);
CREATE POLICY cities_insert ON public.cities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY cities_update ON public.cities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY cities_delete ON public.cities
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );

-- Activation des politiques RLS pour profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_select ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY profiles_insert ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_delete ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Table des badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('reconnaissance', 'competence')),
  CONSTRAINT check_badge_name CHECK (length(trim(name)) > 0),
  CONSTRAINT check_badge_description CHECK (length(trim(description)) > 0),
  CONSTRAINT check_badge_icon CHECK (length(trim(icon)) > 0)
);

-- Correction des fonctions de validation
DROP FUNCTION IF EXISTS public.check_badge_type() CASCADE;
CREATE OR REPLACE FUNCTION public.check_badge_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.badge_type NOT IN ('reconnaissance', 'competence') THEN
    RAISE EXCEPTION 'Le type de badge doit être ''reconnaissance'' ou ''competence''';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badge_type_trigger ON public.badges;
CREATE TRIGGER check_badge_type_trigger
BEFORE INSERT OR UPDATE ON public.badges
FOR EACH ROW
EXECUTE FUNCTION public.check_badge_type();

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY badges_select ON public.badges
    FOR SELECT USING (true);
CREATE POLICY badges_insert ON public.badges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY badges_update ON public.badges
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY badges_delete ON public.badges
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );

-- Table de liaison badges <-> utilisateurs
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, badge_id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_user_badge_unique UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_badges_select ON public.user_badges
    FOR SELECT USING (true);
CREATE POLICY user_badges_insert ON public.user_badges
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_association = true
        )
    );
CREATE POLICY user_badges_update ON public.user_badges
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_association = true
        )
    );
CREATE POLICY user_badges_delete ON public.user_badges
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_association = true
        )
    );

-- Table des missions
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description VARCHAR(2000),
  association_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  address VARCHAR(255),
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  spots_available INTEGER NOT NULL DEFAULT 1 CHECK (spots_available > 0),
  spots_taken INTEGER NOT NULL DEFAULT 0 CHECK (spots_taken >= 0),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  skills_required TEXT[],
  min_skills_required UUID[],
  is_online BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_mission_dates CHECK (ends_at > starts_at),
  CONSTRAINT check_spots CHECK (spots_taken <= spots_available)
);

-- Correction de la fonction check_mission_status
CREATE OR REPLACE FUNCTION public.check_mission_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status NOT IN ('draft', 'active', 'in_progress', 'completed', 'cancelled', 'validated') THEN
    RAISE EXCEPTION 'Statut de mission invalide: %. Les statuts valides sont: draft, active, in_progress, completed, cancelled, validated', NEW.status;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification du statut de la mission: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_mission_status_trigger ON public.missions;
CREATE TRIGGER check_mission_status_trigger
BEFORE INSERT OR UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.check_mission_status();

-- Correction de la fonction check_mission_dates
CREATE OR REPLACE FUNCTION public.check_mission_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.starts_at >= NEW.ends_at THEN
    RAISE EXCEPTION 'La date de début (%s) doit être antérieure à la date de fin (%s)', NEW.starts_at, NEW.ends_at;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification des dates de la mission: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_mission_dates_trigger ON public.missions;
CREATE TRIGGER check_mission_dates_trigger
BEFORE INSERT OR UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.check_mission_dates();

-- Correction de la fonction check_mission_spots
CREATE OR REPLACE FUNCTION public.check_mission_spots()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.spots_taken > NEW.spots_available THEN
    RAISE EXCEPTION 'Le nombre de places prises (%s) ne peut pas dépasser le nombre de places disponibles (%s)', NEW.spots_taken, NEW.spots_available;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification des places de la mission: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_mission_spots_trigger ON public.missions;
CREATE TRIGGER check_mission_spots_trigger
BEFORE INSERT OR UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.check_mission_spots();

-- Correction de la fonction check_association_id
CREATE OR REPLACE FUNCTION public.check_association_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.association_id AND is_association = true
  ) THEN
    RAISE EXCEPTION 'L''ID %s ne correspond pas à une association', NEW.association_id;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification de l''association: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_association_id_trigger ON public.missions;
CREATE TRIGGER check_association_id_trigger
BEFORE INSERT OR UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.check_association_id();

-- Ajout des colonnes de géolocalisation à la table missions
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY missions_select ON public.missions
    FOR SELECT USING (true);
CREATE POLICY missions_insert ON public.missions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_association = true
        )
    );
CREATE POLICY missions_update ON public.missions
    FOR UPDATE USING (
        association_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY missions_delete ON public.missions
    FOR DELETE USING (
        association_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );

-- Table des inscriptions aux missions
CREATE TABLE IF NOT EXISTS public.mission_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'registered',
  feedback VARCHAR(1000),
  rating INTEGER CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (mission_id, user_id)
);

-- Correction de la fonction check_participant_status
CREATE OR REPLACE FUNCTION public.check_participant_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status NOT IN ('registered', 'confirmed', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Statut de participant invalide: %. Les statuts valides sont: registered, confirmed, completed, cancelled', NEW.status;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification du statut du participant: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_participant_status_trigger ON public.mission_participants;
CREATE TRIGGER check_participant_status_trigger
BEFORE INSERT OR UPDATE ON public.mission_participants
FOR EACH ROW
EXECUTE FUNCTION public.check_participant_status();

ALTER TABLE public.mission_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY mission_participants_select ON public.mission_participants
    FOR SELECT USING (true);
CREATE POLICY mission_participants_insert ON public.mission_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY mission_participants_update ON public.mission_participants
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.missions m
            JOIN public.profiles p ON p.id = m.association_id
            WHERE m.id = mission_id AND p.id = auth.uid()
        )
    );
CREATE POLICY mission_participants_delete ON public.mission_participants
    FOR DELETE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.missions m
            JOIN public.profiles p ON p.id = m.association_id
            WHERE m.id = mission_id AND p.id = auth.uid()
        )
    );

-- Table des catégories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_select ON public.categories
    FOR SELECT USING (true);
CREATE POLICY categories_insert ON public.categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY categories_update ON public.categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );
CREATE POLICY categories_delete ON public.categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND is_admin = true
        )
    );

-- Table de liaison missions <-> catégories
CREATE TABLE IF NOT EXISTS public.mission_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (mission_id, category_id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.mission_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY mission_categories_select ON public.mission_categories
    FOR SELECT USING (true);
CREATE POLICY mission_categories_insert ON public.mission_categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.missions m
            JOIN public.profiles p ON p.id = m.association_id
            WHERE m.id = mission_id AND p.id = auth.uid()
        )
    );
CREATE POLICY mission_categories_update ON public.mission_categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.missions m
            JOIN public.profiles p ON p.id = m.association_id
            WHERE m.id = mission_id AND p.id = auth.uid()
        )
    );
CREATE POLICY mission_categories_delete ON public.mission_categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.missions m
            JOIN public.profiles p ON p.id = m.association_id
            WHERE m.id = mission_id AND p.id = auth.uid()
        )
    );

-- Table des disponibilités des bénévoles
CREATE TABLE IF NOT EXISTS public.volunteer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_availability_times CHECK (
    (start_time IS NULL AND end_time IS NULL) OR
    (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
  )
);

-- Trigger pour vérifier que l'utilisateur n'est pas une association
CREATE OR REPLACE FUNCTION public.check_volunteer_not_association()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id AND is_association = true
  ) THEN
    RAISE EXCEPTION 'L''utilisateur %s est une association et ne peut pas avoir de disponibilités', NEW.user_id;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification du type d''utilisateur: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_volunteer_not_association_trigger ON public.volunteer_availability;
CREATE TRIGGER check_volunteer_not_association_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_availability
FOR EACH ROW
EXECUTE FUNCTION public.check_volunteer_not_association();

-- Trigger pour vérifier le jour de la semaine
CREATE OR REPLACE FUNCTION public.check_day_of_week()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.day_of_week < 0 OR NEW.day_of_week > 6 THEN
    RAISE EXCEPTION 'Le jour de la semaine doit être compris entre 0 et 6, valeur reçue: %', NEW.day_of_week;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification du jour de la semaine: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_day_of_week_trigger ON public.volunteer_availability;
CREATE TRIGGER check_day_of_week_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_availability
FOR EACH ROW
EXECUTE FUNCTION public.check_day_of_week();

-- Trigger pour vérifier les disponibilités
CREATE OR REPLACE FUNCTION public.check_availability_times()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.start_time IS NULL AND NEW.end_time IS NOT NULL) OR 
     (NEW.start_time IS NOT NULL AND NEW.end_time IS NULL) THEN
    RAISE EXCEPTION 'Les heures de début et de fin doivent être renseignées ensemble';
  END IF;

  IF NEW.start_time IS NOT NULL AND NEW.end_time IS NOT NULL AND 
     NEW.start_time >= NEW.end_time THEN
    RAISE EXCEPTION 'L''heure de début (%s) doit être antérieure à l''heure de fin (%s)', NEW.start_time, NEW.end_time;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur lors de la vérification des heures de disponibilité: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_availability_times_trigger ON public.volunteer_availability;
CREATE TRIGGER check_availability_times_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_availability
FOR EACH ROW
EXECUTE FUNCTION public.check_availability_times();

-- Trigger pour mettre à jour automatiquement la localisation
CREATE OR REPLACE FUNCTION public.handle_location_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la localisation a changé
  IF (NEW.latitude IS DISTINCT FROM OLD.latitude OR 
      NEW.longitude IS DISTINCT FROM OLD.longitude) THEN
    NEW.location_updated_at = NOW();
    
    -- Notification si la localisation est mise à jour pour la première fois
    IF OLD.latitude IS NULL AND NEW.latitude IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        NEW.id,
        'location_updated',
        'Localisation activée',
        'Votre position a été enregistrée. Vous recevrez maintenant des suggestions de missions à proximité.'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_location_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
WHEN (NEW.latitude IS DISTINCT FROM OLD.latitude OR 
      NEW.longitude IS DISTINCT FROM OLD.longitude)
EXECUTE FUNCTION public.handle_location_update();

-- Trigger pour mettre à jour les suggestions quand la localisation change
CREATE OR REPLACE FUNCTION public.refresh_suggestions_on_location_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Invalider le cache des suggestions pour cet utilisateur
  -- (à implémenter selon votre système de cache)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_location_change_refresh_suggestions
AFTER UPDATE ON public.profiles
FOR EACH ROW
WHEN (NEW.latitude IS DISTINCT FROM OLD.latitude OR 
      NEW.longitude IS DISTINCT FROM OLD.longitude)
EXECUTE FUNCTION public.refresh_suggestions_on_location_change();

-- Fonction de clustering des missions proches
CREATE OR REPLACE FUNCTION public.cluster_nearby_missions(
  p_center_lat DECIMAL,
  p_center_lon DECIMAL,
  p_radius_km DECIMAL DEFAULT 5,
  p_cluster_radius_km DECIMAL DEFAULT 1
) RETURNS TABLE (
  cluster_id INTEGER,
  center_lat DECIMAL,
  center_lon DECIMAL,
  mission_count INTEGER,
  missions JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH mission_points AS (
    SELECT 
      id,
      title,
      latitude,
      longitude,
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) as geom
    FROM public.missions
    WHERE 
      status = 'active'
      AND starts_at > NOW()
      AND public.calculate_distance(p_center_lat, p_center_lon, latitude, longitude) <= p_radius_km
  ),
  clusters AS (
    SELECT 
      ST_ClusterDBSCAN(geom, p_cluster_radius_km * 1000, 1) OVER () as cluster_id,
      id,
      title,
      latitude,
      longitude
    FROM mission_points
  )
  SELECT 
    cluster_id,
    AVG(latitude) as center_lat,
    AVG(longitude) as center_lon,
    COUNT(*) as mission_count,
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'title', title,
        'latitude', latitude,
        'longitude', longitude
      )
    ) as missions
  FROM clusters
  WHERE cluster_id IS NOT NULL
  GROUP BY cluster_id
  ORDER BY mission_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Statistiques de distance pour les dashboards
CREATE OR REPLACE FUNCTION public.get_distance_statistics(
  user_id UUID DEFAULT NULL,
  days INTEGER DEFAULT 30
) RETURNS TABLE (
  total_distance_km DECIMAL,
  average_distance_km DECIMAL,
  max_distance_km DECIMAL,
  missions_count INTEGER,
  missions_by_distance JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH user_missions AS (
    SELECT 
      m.id,
      m.title,
      public.calculate_distance(p.latitude, p.longitude, m.latitude, m.longitude) as distance_km
    FROM public.mission_participants mp
    JOIN public.missions m ON m.id = mp.mission_id
    JOIN public.profiles p ON p.id = mp.user_id
    WHERE 
      mp.status = 'completed'
      AND mp.user_id = COALESCE(user_id, mp.user_id)
      AND m.starts_at >= NOW() - (days || ' days')::INTERVAL
  )
  SELECT 
    SUM(distance_km) as total_distance_km,
    AVG(distance_km) as average_distance_km,
    MAX(distance_km) as max_distance_km,
    COUNT(*) as missions_count,
    jsonb_agg(
      jsonb_build_object(
        'mission_id', id,
        'title', title,
        'distance_km', distance_km
      )
    ) as missions_by_distance
  FROM user_missions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table pour les webhooks de notification
CREATE TABLE IF NOT EXISTS public.location_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint_url VARCHAR(255) NOT NULL,
  secret_key VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Trigger pour vérifier les webhooks de localisation
CREATE OR REPLACE FUNCTION public.check_location_webhooks()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que l'utilisateur existe
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'L''utilisateur n''existe pas';
  END IF;

  -- Vérifier que l'URL est valide
  IF NEW.endpoint_url IS NULL OR TRIM(NEW.endpoint_url) = '' THEN
    RAISE EXCEPTION 'L''URL du webhook ne peut pas être vide';
  END IF;

  IF NOT (
    NEW.endpoint_url LIKE 'http://%' OR 
    NEW.endpoint_url LIKE 'https://%'
  ) THEN
    RAISE EXCEPTION 'L''URL du webhook doit commencer par http:// ou https://';
  END IF;

  -- Vérifier que la clé secrète est suffisamment sécurisée
  IF NEW.secret_key IS NULL OR LENGTH(NEW.secret_key) < 32 THEN
    RAISE EXCEPTION 'La clé secrète doit faire au moins 32 caractères';
  END IF;

  -- Vérifier qu'il n'y a pas de doublon d'URL pour le même utilisateur
  IF EXISTS (
    SELECT 1 FROM public.location_webhooks
    WHERE user_id = NEW.user_id 
    AND endpoint_url = NEW.endpoint_url
    AND id != NEW.id
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Un webhook actif avec cette URL existe déjà pour cet utilisateur';
  END IF;

  -- Vérifier le nombre maximum de webhooks actifs par utilisateur
  IF NEW.is_active AND (
    SELECT COUNT(*) 
    FROM public.location_webhooks
    WHERE user_id = NEW.user_id 
    AND is_active = true
    AND id != NEW.id
  ) >= 5 THEN
    RAISE EXCEPTION 'Nombre maximum de webhooks actifs atteint (5)';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_location_webhooks_trigger
BEFORE INSERT OR UPDATE ON public.location_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.check_location_webhooks();

-- Trigger pour mettre à jour le timestamp
CREATE TRIGGER handle_location_webhooks_updated_at
BEFORE UPDATE ON public.location_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.location_webhooks ENABLE ROW LEVEL SECURITY;

-- Fonction pour gérer les webhooks
CREATE OR REPLACE FUNCTION public.manage_location_webhook(
  p_user_id UUID,
  p_endpoint_url VARCHAR(255),
  p_secret_key VARCHAR(255),
  p_action TEXT DEFAULT 'add'
) RETURNS UUID AS $$
DECLARE
  v_webhook_id UUID;
BEGIN
  IF p_action = 'add' THEN
    INSERT INTO public.location_webhooks (
      user_id,
      endpoint_url,
      secret_key
    ) VALUES (
      p_user_id,
      p_endpoint_url,
      p_secret_key
    ) RETURNING id INTO v_webhook_id;
    
  ELSIF p_action = 'remove' THEN
    UPDATE public.location_webhooks
    SET is_active = false
    WHERE user_id = p_user_id
    AND endpoint_url = p_endpoint_url
    RETURNING id INTO v_webhook_id;
  END IF;
  
  RETURN v_webhook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS http;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table pour le cache de géocodage
CREATE TABLE IF NOT EXISTS public.geocoding_cache (
  address VARCHAR(255) PRIMARY KEY,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  formatted_address VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Trigger pour vérifier le cache de géocodage
CREATE OR REPLACE FUNCTION public.check_geocoding_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que l'adresse n'est pas vide
  IF NEW.address IS NULL OR TRIM(NEW.address) = '' THEN
    RAISE EXCEPTION 'L''adresse ne peut pas être vide';
  END IF;

  -- Vérifier que les coordonnées sont valides
  IF NEW.latitude IS NOT NULL THEN
    IF NEW.latitude < -90 OR NEW.latitude > 90 THEN
      RAISE EXCEPTION 'La latitude doit être comprise entre -90 et 90';
    END IF;
  END IF;

  IF NEW.longitude IS NOT NULL THEN
    IF NEW.longitude < -180 OR NEW.longitude > 180 THEN
      RAISE EXCEPTION 'La longitude doit être comprise entre -180 et 180';
    END IF;
  END IF;

  -- Vérifier que les coordonnées sont cohérentes
  IF (NEW.latitude IS NULL AND NEW.longitude IS NOT NULL) OR 
     (NEW.latitude IS NOT NULL AND NEW.longitude IS NULL) THEN
    RAISE EXCEPTION 'Les coordonnées doivent être renseignées ensemble';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_geocoding_cache_trigger
BEFORE INSERT OR UPDATE ON public.geocoding_cache
FOR EACH ROW
EXECUTE FUNCTION public.check_geocoding_cache();

-- Table pour le cache des temps de trajet
CREATE TABLE IF NOT EXISTS public.travel_time_cache (
  origin_lat DECIMAL(10, 8),
  origin_lon DECIMAL(11, 8),
  dest_lat DECIMAL(10, 8),
  dest_lon DECIMAL(11, 8),
  travel_time_minutes INTEGER,
  distance_km DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (origin_lat, origin_lon, dest_lat, dest_lon)
);

-- Trigger pour vérifier le cache des temps de trajet
CREATE OR REPLACE FUNCTION public.check_travel_time_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que les coordonnées sont valides
  IF NEW.origin_lat < -90 OR NEW.origin_lat > 90 THEN
    RAISE EXCEPTION 'La latitude d''origine doit être comprise entre -90 et 90';
  END IF;

  IF NEW.origin_lon < -180 OR NEW.origin_lon > 180 THEN
    RAISE EXCEPTION 'La longitude d''origine doit être comprise entre -180 et 180';
  END IF;

  IF NEW.dest_lat < -90 OR NEW.dest_lat > 90 THEN
    RAISE EXCEPTION 'La latitude de destination doit être comprise entre -90 et 90';
  END IF;

  IF NEW.dest_lon < -180 OR NEW.dest_lon > 180 THEN
    RAISE EXCEPTION 'La longitude de destination doit être comprise entre -180 et 180';
  END IF;

  -- Vérifier que le temps de trajet est positif
  IF NEW.travel_time_minutes <= 0 THEN
    RAISE EXCEPTION 'Le temps de trajet doit être positif';
  END IF;

  -- Vérifier que la distance est positive
  IF NEW.distance_km <= 0 THEN
    RAISE EXCEPTION 'La distance doit être positive';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_travel_time_cache_trigger
BEFORE INSERT OR UPDATE ON public.travel_time_cache
FOR EACH ROW
EXECUTE FUNCTION public.check_travel_time_cache();

-- Table des types de mission
CREATE TABLE IF NOT EXISTS public.mission_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Trigger pour vérifier les itinéraires optimisés
-- Fonction pour optimiser un itinéraire de missions
CREATE OR REPLACE FUNCTION public.optimize_mission_route(
  p_user_id UUID,
  p_mission_ids UUID[],
  p_max_daily_missions INTEGER DEFAULT 5,
  p_max_daily_hours INTEGER DEFAULT 8
) RETURNS TABLE (
  route_id UUID,
  total_distance_km DECIMAL,
  total_duration_minutes INTEGER,
  mission_count INTEGER,
  route_order JSONB
) AS $$
DECLARE
  v_route_id UUID;
  v_missions RECORD;
  v_route_order JSONB := '[]'::JSONB;
  v_total_distance DECIMAL := 0;
  v_total_duration INTEGER := 0;
  v_current_time TIMESTAMP WITH TIME ZONE;
  v_mission_count INTEGER := 0;
  v_daily_missions INTEGER := 0;
  v_daily_hours INTEGER := 0;
BEGIN
  -- Créer un nouvel itinéraire
  INSERT INTO public.optimized_routes (
    user_id,
    total_distance_km,
    total_duration_minutes,
    mission_count,
    route_order
  ) VALUES (
    p_user_id,
    0,
    0,
    0,
    '[]'::JSONB
  ) RETURNING id INTO v_route_id;

  -- Récupérer la position de l'utilisateur
  SELECT latitude, longitude INTO v_missions
  FROM public.profiles
  WHERE id = p_user_id;

  -- Algorithme glouton pour optimiser l'itinéraire
  WITH RECURSIVE mission_sequence AS (
    -- Point de départ (position de l'utilisateur)
    SELECT 
      0 as step,
      v_missions.latitude as current_lat,
      v_missions.longitude as current_lon,
      NULL::UUID as mission_id,
      0 as distance_km,
      0 as duration_minutes,
      '[]'::JSONB as route
    UNION ALL
    -- Sélectionner la prochaine mission la plus proche
    SELECT 
      ms.step + 1,
      m.latitude,
      m.longitude,
      m.id,
      tt.distance_km,
      tt.travel_time_minutes,
      ms.route || jsonb_build_object(
        'mission_id', m.id,
        'title', m.title,
        'starts_at', m.starts_at,
        'duration_minutes', m.duration_minutes,
        'travel_time_minutes', tt.travel_time_minutes,
        'distance_km', tt.distance_km
      )
    FROM mission_sequence ms
    CROSS JOIN LATERAL (
      SELECT m.*, tt.*
      FROM public.missions m
      CROSS JOIN LATERAL (
        SELECT * FROM public.calculate_travel_time(
          ms.current_lat,
          ms.current_lon,
          m.latitude,
          m.longitude
        )
      ) tt
      WHERE 
        m.id = ANY(p_mission_ids)
        AND m.id != ALL(ARRAY(
          SELECT jsonb_array_elements(ms.route)->>'mission_id'::UUID
        ))
        AND m.starts_at > ms.current_time
        AND m.status = 'active'
      ORDER BY tt.travel_time_minutes
      LIMIT 1
    ) next_mission
    WHERE 
      ms.step < p_max_daily_missions
      AND v_daily_hours + next_mission.duration_minutes <= p_max_daily_hours * 60
  )
  SELECT 
    route,
    SUM((route->>'distance_km')::DECIMAL) as total_distance,
    SUM((route->>'travel_time_minutes')::INTEGER) as total_duration,
    COUNT(*) as mission_count
  INTO v_route_order, v_total_distance, v_total_duration, v_mission_count
  FROM mission_sequence
  WHERE step > 0
  GROUP BY route
  ORDER BY total_duration
  LIMIT 1;

  -- Mettre à jour l'itinéraire optimisé
  UPDATE public.optimized_routes
  SET 
    total_distance_km = v_total_distance,
    total_duration_minutes = v_total_duration,
    mission_count = v_mission_count,
    route_order = v_route_order,
    updated_at = NOW()
  WHERE id = v_route_id;

  -- Retourner l'itinéraire optimisé
  RETURN QUERY
  SELECT 
    v_route_id,
    v_total_distance,
    v_total_duration,
    v_mission_count,
    v_route_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les détails d'un itinéraire optimisé
CREATE OR REPLACE FUNCTION public.get_optimized_route_details(
  p_route_id UUID
) RETURNS TABLE (
  step_number INTEGER,
  mission_id UUID,
  title TEXT,
  starts_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  travel_time_minutes INTEGER,
  distance_km DECIMAL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
) AS $$
BEGIN
  RETURN QUERY
  WITH route_steps AS (
    SELECT 
      (jsonb_array_elements(route_order)->>'mission_id')::UUID as mission_id,
      jsonb_array_elements(route_order)->>'title' as title,
      (jsonb_array_elements(route_order)->>'starts_at')::TIMESTAMP WITH TIME ZONE as starts_at,
      (jsonb_array_elements(route_order)->>'duration_minutes')::INTEGER as duration_minutes,
      (jsonb_array_elements(route_order)->>'travel_time_minutes')::INTEGER as travel_time_minutes,
      (jsonb_array_elements(route_order)->>'distance_km')::DECIMAL as distance_km
    FROM public.optimized_routes
    WHERE id = p_route_id
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY starts_at) as step_number,
    rs.mission_id,
    rs.title,
    rs.starts_at,
    rs.duration_minutes,
    rs.travel_time_minutes,
    rs.distance_km,
    m.address,
    m.latitude,
    m.longitude
  FROM route_steps rs
  JOIN public.missions m ON m.id = rs.mission_id
  ORDER BY starts_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour suggérer des missions complémentaires à un itinéraire
CREATE OR REPLACE FUNCTION public.suggest_complementary_missions(
  p_route_id UUID,
  p_max_additional_missions INTEGER DEFAULT 3
) RETURNS TABLE (
  mission_id UUID,
  title TEXT,
  starts_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  travel_time_minutes INTEGER,
  distance_km DECIMAL,
  score DECIMAL
) AS $$
DECLARE
  v_user_id UUID;
  v_route RECORD;
BEGIN
  -- Récupérer les informations de l'itinéraire
  SELECT user_id, route_order INTO v_route
  FROM public.optimized_routes
  WHERE id = p_route_id;

  -- Trouver des missions complémentaires
  RETURN QUERY
  WITH route_missions AS (
    SELECT DISTINCT (jsonb_array_elements(route_order)->>'mission_id')::UUID as mission_id
    FROM public.optimized_routes
    WHERE id = p_route_id
  ),
  complementary_missions AS (
    SELECT 
      m.*,
      tt.travel_time_minutes,
      tt.distance_km,
      -- Score basé sur la proximité temporelle et géographique
      (1.0 / (EXTRACT(EPOCH FROM (m.starts_at - v_route.route_order->0->>'starts_at')) / 3600 + 1)) *
      (1.0 / (tt.distance_km + 1)) as score
    FROM public.missions m
    CROSS JOIN LATERAL (
      SELECT * FROM public.calculate_travel_time(
        (SELECT latitude FROM public.profiles WHERE id = v_user_id),
        (SELECT longitude FROM public.profiles WHERE id = v_user_id),
        m.latitude,
        m.longitude
      )
    ) tt
    WHERE 
      m.id NOT IN (SELECT mission_id FROM route_missions)
      AND m.status = 'active'
      AND m.starts_at > NOW()
  )
  SELECT 
    id as mission_id,
    title,
    starts_at,
    duration_minutes,
    travel_time_minutes,
    distance_km,
    score
  FROM complementary_missions
  ORDER BY score DESC
  LIMIT p_max_additional_missions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table des itinéraires optimisés
CREATE TABLE IF NOT EXISTS public.optimized_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_distance_km DECIMAL,
  total_duration_minutes INTEGER,
  mission_count INTEGER,
  route_order JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Trigger pour vérifier les itinéraires optimisés
CREATE OR REPLACE FUNCTION public.check_optimized_routes()
RETURNS TRIGGER AS $$
DECLARE
  route_item JSONB;
  mission_id UUID;
  total_distance DECIMAL := 0;
  total_duration INTEGER := 0;
  mission_count INTEGER := 0;
BEGIN
  -- Vérifier que l'utilisateur existe
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'L''utilisateur n''existe pas';
  END IF;

  -- Vérifier que route_order est un tableau JSON valide
  IF jsonb_typeof(NEW.route_order) != 'array' THEN
    RAISE EXCEPTION 'route_order doit être un tableau JSON';
  END IF;

  -- Vérifier chaque élément du tableau
  FOR route_item IN SELECT jsonb_array_elements(NEW.route_order)
  LOOP
    -- Vérifier la structure de chaque élément
    IF NOT (
      route_item ? 'mission_id' AND
      route_item ? 'title' AND
      route_item ? 'starts_at' AND
      route_item ? 'duration_minutes' AND
      route_item ? 'travel_time_minutes' AND
      route_item ? 'distance_km'
    ) THEN
      RAISE EXCEPTION 'Structure invalide dans route_order';
    END IF;

    -- Vérifier que la mission existe
    mission_id := (route_item->>'mission_id')::UUID;
    IF NOT EXISTS (
      SELECT 1 FROM public.missions 
      WHERE id = mission_id
    ) THEN
      RAISE EXCEPTION 'La mission % n''existe pas', mission_id;
    END IF;

    -- Vérifier que les valeurs numériques sont positives
    IF (route_item->>'duration_minutes')::INTEGER <= 0 THEN
      RAISE EXCEPTION 'La durée de la mission doit être positive';
    END IF;

    IF (route_item->>'travel_time_minutes')::INTEGER < 0 THEN
      RAISE EXCEPTION 'Le temps de trajet ne peut pas être négatif';
    END IF;

    IF (route_item->>'distance_km')::DECIMAL < 0 THEN
      RAISE EXCEPTION 'La distance ne peut pas être négative';
    END IF;

    -- Accumuler les totaux
    total_distance := total_distance + (route_item->>'distance_km')::DECIMAL;
    total_duration := total_duration + (route_item->>'duration_minutes')::INTEGER + 
                     (route_item->>'travel_time_minutes')::INTEGER;
    mission_count := mission_count + 1;
  END LOOP;

  -- Vérifier la cohérence des totaux
  IF NEW.total_distance_km IS NOT NULL AND NEW.total_distance_km != total_distance THEN
    RAISE EXCEPTION 'Le total_distance_km ne correspond pas à la somme des distances';
  END IF;

  IF NEW.total_duration_minutes IS NOT NULL AND NEW.total_duration_minutes != total_duration THEN
    RAISE EXCEPTION 'Le total_duration_minutes ne correspond pas à la somme des durées';
  END IF;

  IF NEW.mission_count IS NOT NULL AND NEW.mission_count != mission_count THEN
    RAISE EXCEPTION 'Le mission_count ne correspond pas au nombre de missions';
  END IF;

  -- Mettre à jour les totaux si non spécifiés
  NEW.total_distance_km := total_distance;
  NEW.total_duration_minutes := total_duration;
  NEW.mission_count := mission_count;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_optimized_routes_trigger
BEFORE INSERT OR UPDATE ON public.optimized_routes
FOR EACH ROW
EXECUTE FUNCTION public.check_optimized_routes();

-- Fonction de géocodage améliorée
CREATE OR REPLACE FUNCTION public.geocode_address(
  p_address TEXT
) RETURNS TABLE (
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  formatted_address TEXT
) AS $$
DECLARE
  v_cached_result RECORD;
  v_api_key TEXT := current_setting('app.settings.geocoding_api_key', true);
  v_api_url TEXT := 'https://api-adresse.data.gouv.fr/search/';
  v_response JSONB;
BEGIN
  -- Validation de l'adresse
  IF p_address IS NULL OR TRIM(p_address) = '' THEN
    RAISE EXCEPTION 'L''adresse ne peut pas être vide';
  END IF;

  -- Vérifier le cache
  SELECT * INTO v_cached_result
  FROM public.geocoding_cache
  WHERE address = p_address;

  IF v_cached_result IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      v_cached_result.latitude,
      v_cached_result.longitude,
      v_cached_result.formatted_address;
    RETURN;
  END IF;

  -- Appel à l'API de géocodage
  SELECT content::JSONB INTO v_response
  FROM http((
    'GET',
    v_api_url || '?q=' || urlencode(p_address) || '&limit=1',
    ARRAY[http_header('Accept', 'application/json')],
    NULL,
    NULL
  )::http_request);

  -- Vérifier la réponse
  IF v_response->'features'->0 IS NULL THEN
    RAISE EXCEPTION 'Adresse non trouvée';
  END IF;

  -- Extraire les coordonnées
  RETURN QUERY
  SELECT 
    (v_response->'features'->0->'geometry'->'coordinates'->1)::DECIMAL as latitude,
    (v_response->'features'->0->'geometry'->'coordinates'->0)::DECIMAL as longitude,
    (v_response->'features'->0->'properties'->'label')::TEXT as formatted_address;

  -- Mettre en cache
  INSERT INTO public.geocoding_cache (
    address,
    latitude,
    longitude,
    formatted_address
  ) VALUES (
    p_address,
    (v_response->'features'->0->'geometry'->'coordinates'->1)::DECIMAL,
    (v_response->'features'->0->'geometry'->'coordinates'->0)::DECIMAL,
    (v_response->'features'->0->'properties'->'label')::TEXT
  ) ON CONFLICT (address) DO UPDATE SET
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table des notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('location_updated', 'mission_reminder', 'mission_validated', 'mission_cancelled', 'badge_awarded')),
  title VARCHAR(200) NOT NULL,
  message VARCHAR(1000) NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Trigger pour vérifier les notifications
CREATE OR REPLACE FUNCTION public.check_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que l'utilisateur existe
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'L''utilisateur n''existe pas';
  END IF;

  -- Vérifier que le type est valide
  IF NEW.type NOT IN ('location_updated', 'mission_reminder', 'mission_validated', 'mission_cancelled', 'badge_awarded') THEN
    RAISE EXCEPTION 'Type de notification invalide';
  END IF;

  -- Vérifier que le titre et le message ne sont pas vides
  IF NEW.title IS NULL OR TRIM(NEW.title) = '' THEN
    RAISE EXCEPTION 'Le titre ne peut pas être vide';
  END IF;

  IF NEW.message IS NULL OR TRIM(NEW.message) = '' THEN
    RAISE EXCEPTION 'Le message ne peut pas être vide';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_notification_trigger
BEFORE INSERT OR UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.check_notification();

-- Trigger pour mettre à jour le timestamp
CREATE TRIGGER handle_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Index pour les notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Fin de la transaction
COMMIT;

-- Création des index pour optimiser les performances
CREATE INDEX idx_mission_participants_user_id ON public.mission_participants(user_id);
CREATE INDEX idx_mission_participants_mission_id ON public.mission_participants(mission_id);
CREATE INDEX idx_mission_participants_status ON public.mission_participants(status);
CREATE INDEX idx_mission_participants_user_status ON public.mission_participants(user_id, status);

CREATE INDEX idx_missions_starts_at ON public.missions(starts_at);
CREATE INDEX idx_missions_city_id ON public.missions(city_id);
CREATE INDEX idx_missions_is_online ON public.missions(is_online);
CREATE INDEX idx_missions_created_at ON public.missions(created_at);

CREATE INDEX idx_mission_categories_mission_id ON public.mission_categories(mission_id);
CREATE INDEX idx_mission_categories_category_id ON public.mission_categories(category_id);

CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON public.user_badges(badge_id);

CREATE INDEX idx_profiles_city_id ON public.profiles(city_id);

-- Création des index supplémentaires pour optimiser les performances
CREATE INDEX idx_missions_status ON public.missions(status);
CREATE INDEX idx_missions_association_id ON public.missions(association_id);
CREATE INDEX idx_missions_latitude_longitude ON public.missions USING gist (ll_to_earth(latitude, longitude));
CREATE INDEX idx_profiles_latitude_longitude ON public.profiles USING gist (ll_to_earth(latitude, longitude));
CREATE INDEX idx_volunteer_skills_user_id ON public.volunteer_skills(user_id);
CREATE INDEX idx_volunteer_skills_skill_id ON public.volunteer_skills(skill_id);
CREATE INDEX idx_volunteer_preferences_user_id ON public.volunteer_preferences(user_id);
CREATE INDEX idx_volunteer_availability_user_id ON public.volunteer_availability(user_id);
CREATE INDEX idx_volunteer_availability_day_of_week ON public.volunteer_availability(day_of_week);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_feedbacks_user_id ON public.feedbacks(user_id);
CREATE INDEX idx_feedbacks_mission_id ON public.feedbacks(mission_id);
CREATE INDEX idx_geocoding_cache_address ON public.geocoding_cache(address);
CREATE INDEX idx_travel_time_cache_coordinates ON public.travel_time_cache(origin_lat, origin_lon, dest_lat, dest_lon);
CREATE INDEX idx_optimized_routes_user_id ON public.optimized_routes(user_id);
CREATE INDEX idx_location_webhooks_user_id ON public.location_webhooks(user_id);
CREATE INDEX idx_location_webhooks_is_active ON public.location_webhooks(is_active);

-- Fonction pour calculer la distance entre deux points
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 6371; -- Rayon de la Terre en km
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Conversion en radians
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  lat1 := radians(lat1);
  lat2 := radians(lat2);

  -- Formule de Haversine
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(lat1) * cos(lat2) * 
       sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour calculer le temps de trajet
CREATE OR REPLACE FUNCTION public.calculate_travel_time(
  p_origin_lat DECIMAL,
  p_origin_lon DECIMAL,
  p_dest_lat DECIMAL,
  p_dest_lon DECIMAL
) RETURNS TABLE (
  travel_time_minutes INTEGER,
  distance_km DECIMAL
) AS $$
DECLARE
  v_distance DECIMAL;
  v_cached_result RECORD;
BEGIN
  -- Calculer la distance
  v_distance := public.calculate_distance(p_origin_lat, p_origin_lon, p_dest_lat, p_dest_lon);
  
  -- Vérifier le cache
  SELECT * INTO v_cached_result
  FROM public.travel_time_cache
  WHERE 
    origin_lat = p_origin_lat
    AND origin_lon = p_origin_lon
    AND dest_lat = p_dest_lat
    AND dest_lon = p_dest_lon;

  IF v_cached_result IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      v_cached_result.travel_time_minutes,
      v_cached_result.distance_km;
    RETURN;
  END IF;

  -- Estimation simple du temps de trajet (à améliorer avec une API de routage)
  -- Vitesse moyenne estimée : 50 km/h
  RETURN QUERY
  SELECT 
    (v_distance * 1.2)::INTEGER as travel_time_minutes, -- 20% de marge pour les arrêts
    v_distance as distance_km;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour gérer les inscriptions aux missions
CREATE OR REPLACE FUNCTION public.handle_mission_registration(
  p_mission_id UUID,
  p_user_id UUID
) RETURNS UUID AS $$
DECLARE
  v_participant_id UUID;
  v_mission RECORD;
BEGIN
  -- Vérifier que la mission existe et est active
  SELECT * INTO v_mission
  FROM public.missions
  WHERE id = p_mission_id
  AND status = 'active'
  AND starts_at > NOW();

  IF v_mission IS NULL THEN
    RAISE EXCEPTION 'La mission n''existe pas ou n''est pas disponible';
  END IF;

  -- Vérifier qu'il reste des places
  IF v_mission.spots_taken >= v_mission.spots_available THEN
    RAISE EXCEPTION 'Il n''y a plus de places disponibles pour cette mission';
  END IF;

  -- Vérifier que l'utilisateur n'est pas déjà inscrit
  IF EXISTS (
    SELECT 1 FROM public.mission_participants
    WHERE mission_id = p_mission_id
    AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Vous êtes déjà inscrit à cette mission';
  END IF;

  -- Créer l'inscription
  INSERT INTO public.mission_participants (
    mission_id,
    user_id,
    status
  ) VALUES (
    p_mission_id,
    p_user_id,
    'registered'
  ) RETURNING id INTO v_participant_id;

  -- Mettre à jour le nombre de places prises
  UPDATE public.missions
  SET spots_taken = spots_taken + 1
  WHERE id = p_mission_id;

  -- Créer une notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message
  ) VALUES (
    p_user_id,
    'mission_reminder',
    'Inscription confirmée',
    'Vous êtes inscrit à la mission : ' || v_mission.title
  );

  RETURN v_participant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour gérer les annulations d'inscription
CREATE OR REPLACE FUNCTION public.handle_mission_cancellation(
  p_mission_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_participant RECORD;
BEGIN
  -- Vérifier que l'inscription existe
  SELECT * INTO v_participant
  FROM public.mission_participants
  WHERE mission_id = p_mission_id
  AND user_id = p_user_id
  AND status IN ('registered', 'confirmed');

  IF v_participant IS NULL THEN
    RAISE EXCEPTION 'Vous n''êtes pas inscrit à cette mission';
  END IF;

  -- Mettre à jour le statut
  UPDATE public.mission_participants
  SET status = 'cancelled'
  WHERE id = v_participant.id;

  -- Mettre à jour le nombre de places prises
  UPDATE public.missions
  SET spots_taken = spots_taken - 1
  WHERE id = p_mission_id;

  -- Créer une notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message
  ) VALUES (
    p_user_id,
    'mission_cancelled',
    'Inscription annulée',
    'Votre inscription à la mission a été annulée'
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour valider une mission
CREATE OR REPLACE FUNCTION public.validate_mission(
  p_mission_id UUID,
  p_validator_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_mission RECORD;
  v_participant RECORD;
BEGIN
  -- Vérifier que la mission existe
  SELECT * INTO v_mission
  FROM public.missions
  WHERE id = p_mission_id;

  IF v_mission IS NULL THEN
    RAISE EXCEPTION 'La mission n''existe pas';
  END IF;

  -- Vérifier que le validateur est l'association qui a créé la mission
  IF v_mission.association_id != p_validator_id THEN
    RAISE EXCEPTION 'Vous n''êtes pas autorisé à valider cette mission';
  END IF;

  -- Mettre à jour le statut de la mission
  UPDATE public.missions
  SET status = 'validated'
  WHERE id = p_mission_id;

  -- Mettre à jour le statut des participants
  FOR v_participant IN 
    SELECT * FROM public.mission_participants
    WHERE mission_id = p_mission_id
    AND status = 'completed'
  LOOP
    -- Créer une notification pour chaque participant
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message
    ) VALUES (
      v_participant.user_id,
      'mission_validated',
      'Mission validée',
      'Votre participation à la mission a été validée'
    );

    -- Vérifier et attribuer des badges
    PERFORM public.check_and_award_badges(v_participant.user_id);
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier et attribuer des badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(
  p_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_completed_missions INTEGER;
  v_helped_volunteers INTEGER;
BEGIN
  -- Compter les missions complétées
  SELECT COUNT(*) INTO v_completed_missions
  FROM public.mission_participants mp
  JOIN public.missions m ON m.id = mp.mission_id
  WHERE mp.user_id = p_user_id
  AND mp.status = 'completed'
  AND m.status = 'validated';

  -- Compter les nouveaux bénévoles aidés
  SELECT COUNT(DISTINCT mp2.user_id) INTO v_helped_volunteers
  FROM public.mission_participants mp1
  JOIN public.mission_participants mp2 ON mp1.mission_id = mp2.mission_id
  WHERE mp1.user_id = p_user_id
  AND mp1.status = 'completed'
  AND mp2.status = 'completed'
  AND mp2.user_id != p_user_id
  AND mp2.user_id IN (
    SELECT user_id
    FROM public.mission_participants
    GROUP BY user_id
    HAVING COUNT(*) = 1
  );

  -- Attribuer les badges en fonction des statistiques
  -- Premier pas
  IF v_completed_missions = 1 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id
    FROM public.badges
    WHERE name = 'Premier pas'
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Super bénévole
  IF v_completed_missions = 10 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id
    FROM public.badges
    WHERE name = 'Super bénévole'
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Expert
  IF v_completed_missions = 50 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id
    FROM public.badges
    WHERE name = 'Expert'
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;

  -- Mentor
  IF v_helped_volunteers >= 5 THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT p_user_id, id
    FROM public.badges
    WHERE name = 'Mentor'
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour gérer les compétences des bénévoles
CREATE OR REPLACE FUNCTION public.handle_volunteer_skill(
  p_user_id UUID,
  p_skill_id UUID,
  p_level INTEGER,
  p_awarded_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_skill_id UUID;
BEGIN
  -- Vérifier que l'utilisateur existe et n'est pas une association
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_user_id 
    AND is_association = false
  ) THEN
    RAISE EXCEPTION 'L''utilisateur n''existe pas ou est une association';
  END IF;

  -- Vérifier que la compétence existe
  IF NOT EXISTS (
    SELECT 1 FROM public.skills 
    WHERE id = p_skill_id
  ) THEN
    RAISE EXCEPTION 'La compétence n''existe pas';
  END IF;

  -- Vérifier que le niveau est valide
  IF p_level < 1 OR p_level > 5 THEN
    RAISE EXCEPTION 'Le niveau doit être compris entre 1 et 5';
  END IF;

  -- Vérifier que l'attributeur est une association si spécifié
  IF p_awarded_by IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_awarded_by 
    AND is_association = true
  ) THEN
    RAISE EXCEPTION 'L''attributeur doit être une association';
  END IF;

  -- Insérer ou mettre à jour la compétence
  INSERT INTO public.volunteer_skills (
    user_id,
    skill_id,
    level,
    awarded_by
  ) VALUES (
    p_user_id,
    p_skill_id,
    p_level,
    p_awarded_by
  ) ON CONFLICT (user_id, skill_id) 
  DO UPDATE SET
    level = EXCLUDED.level,
    awarded_by = EXCLUDED.awarded_by,
    awarded_at = CASE 
      WHEN EXCLUDED.awarded_by IS NOT NULL THEN NOW()
      ELSE volunteer_skills.awarded_at
    END,
    updated_at = NOW()
  RETURNING id INTO v_skill_id;

  -- Créer une notification si attribué par une association
  IF p_awarded_by IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message
    ) VALUES (
      p_user_id,
      'badge_awarded',
      'Nouvelle compétence validée',
      'Une association a validé votre niveau dans une compétence'
    );
  END IF;

  RETURN v_skill_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table des préférences des bénévoles
CREATE TABLE IF NOT EXISTS public.volunteer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  preferred_mission_types UUID[],
  preferred_categories UUID[],
  max_distance_km INTEGER CHECK (max_distance_km > 0),
  min_duration_minutes INTEGER CHECK (min_duration_minutes > 0),
  max_duration_minutes INTEGER CHECK (max_duration_minutes > 0),
  preferred_days_of_week INTEGER[],
  preferred_time_slots TSTZRANGE[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id)
);

-- Trigger pour vérifier que l'utilisateur n'est pas une association
CREATE OR REPLACE FUNCTION public.check_volunteer_preferences_user()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id AND is_association = true
  ) THEN
    RAISE EXCEPTION 'Les associations ne peuvent pas avoir de préférences';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_volunteer_preferences_user_trigger ON public.volunteer_preferences;
CREATE TRIGGER check_volunteer_preferences_user_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.check_volunteer_preferences_user();

-- Trigger pour vérifier la cohérence des durées
CREATE OR REPLACE FUNCTION public.check_volunteer_preferences_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.min_duration_minutes IS NOT NULL AND NEW.max_duration_minutes IS NOT NULL 
     AND NEW.min_duration_minutes > NEW.max_duration_minutes THEN
    RAISE EXCEPTION 'La durée minimale ne peut pas être supérieure à la durée maximale';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_volunteer_preferences_duration_trigger ON public.volunteer_preferences;
CREATE TRIGGER check_volunteer_preferences_duration_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.check_volunteer_preferences_duration();

-- Trigger pour vérifier les jours de la semaine
CREATE OR REPLACE FUNCTION public.check_volunteer_preferences_days()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.preferred_days_of_week IS NOT NULL AND NOT (
    SELECT bool_and(day >= 0 AND day <= 6)
    FROM unnest(NEW.preferred_days_of_week) AS day
  ) THEN
    RAISE EXCEPTION 'Les jours de la semaine doivent être compris entre 0 et 6';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_volunteer_preferences_days_trigger ON public.volunteer_preferences;
CREATE TRIGGER check_volunteer_preferences_days_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.check_volunteer_preferences_days();

-- Trigger pour vérifier les types de mission
CREATE OR REPLACE FUNCTION public.check_volunteer_preferences_mission_types()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.preferred_mission_types IS NOT NULL AND NOT (
    SELECT bool_and(EXISTS (
      SELECT 1 FROM public.mission_types 
      WHERE id = type_id
    ))
    FROM unnest(NEW.preferred_mission_types) AS type_id
  ) THEN
    RAISE EXCEPTION 'Un ou plusieurs types de mission n''existent pas';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_volunteer_preferences_mission_types_trigger ON public.volunteer_preferences;
CREATE TRIGGER check_volunteer_preferences_mission_types_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.check_volunteer_preferences_mission_types();

-- Trigger pour vérifier les catégories
CREATE OR REPLACE FUNCTION public.check_volunteer_preferences_categories()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.preferred_categories IS NOT NULL AND NOT (
    SELECT bool_and(EXISTS (
      SELECT 1 FROM public.categories 
      WHERE id = category_id
    ))
    FROM unnest(NEW.preferred_categories) AS category_id
  ) THEN
    RAISE EXCEPTION 'Une ou plusieurs catégories n''existent pas';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_volunteer_preferences_categories_trigger ON public.volunteer_preferences;
CREATE TRIGGER check_volunteer_preferences_categories_trigger
BEFORE INSERT OR UPDATE ON public.volunteer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.check_volunteer_preferences_categories();

-- Création des triggers handle_updated_at pour toutes les tables
CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.badges
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.user_badges
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.missions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.mission_participants
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.mission_categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.volunteer_availability
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.volunteer_preferences
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.volunteer_skills
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.feedbacks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.geocoding_cache
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.travel_time_cache
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.optimized_routes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.mission_types
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_trigger
BEFORE UPDATE ON public.location_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Ajout des politiques de sécurité RLS
ALTER TABLE public.volunteer_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY volunteer_skills_select ON public.volunteer_skills
    FOR SELECT USING (true);
CREATE POLICY volunteer_skills_insert ON public.volunteer_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_association = true
    ));
CREATE POLICY volunteer_skills_update ON public.volunteer_skills
    FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_association = true
    ));
CREATE POLICY volunteer_skills_delete ON public.volunteer_skills
    FOR DELETE USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_association = true
    ));

ALTER TABLE public.volunteer_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY volunteer_preferences_select ON public.volunteer_preferences
    FOR SELECT USING (true);
CREATE POLICY volunteer_preferences_insert ON public.volunteer_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY volunteer_preferences_update ON public.volunteer_preferences
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY volunteer_preferences_delete ON public.volunteer_preferences
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.volunteer_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY volunteer_availability_select ON public.volunteer_availability
    FOR SELECT USING (true);
CREATE POLICY volunteer_availability_insert ON public.volunteer_availability
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY volunteer_availability_update ON public.volunteer_availability
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY volunteer_availability_delete ON public.volunteer_availability
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_select ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_insert ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY notifications_update ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notifications_delete ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
CREATE POLICY feedbacks_select ON public.feedbacks
    FOR SELECT USING (true);
CREATE POLICY feedbacks_insert ON public.feedbacks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY feedbacks_update ON public.feedbacks
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY feedbacks_delete ON public.feedbacks
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.optimized_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY optimized_routes_select ON public.optimized_routes
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY optimized_routes_insert ON public.optimized_routes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY optimized_routes_update ON public.optimized_routes
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY optimized_routes_delete ON public.optimized_routes
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.location_webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY location_webhooks_select ON public.location_webhooks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY location_webhooks_insert ON public.location_webhooks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY location_webhooks_update ON public.location_webhooks
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY location_webhooks_delete ON public.location_webhooks
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction de validation des retours d'expérience
CREATE OR REPLACE FUNCTION public.check_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier que l'utilisateur existe
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'L''utilisateur n''existe pas';
  END IF;

  -- Vérifier que la mission existe
  IF NOT EXISTS (
    SELECT 1 FROM public.missions 
    WHERE id = NEW.mission_id
  ) THEN
    RAISE EXCEPTION 'La mission n''existe pas';
  END IF;

  -- Vérifier que l'utilisateur a participé à la mission
  IF NOT EXISTS (
    SELECT 1 FROM public.mission_participants 
    WHERE mission_id = NEW.mission_id 
    AND user_id = NEW.user_id
    AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'L''utilisateur n''a pas participé à cette mission';
  END IF;

  -- Vérifier que la note est valide si elle est renseignée
  IF NEW.rating IS NOT NULL AND (NEW.rating < 1 OR NEW.rating > 5) THEN
    RAISE EXCEPTION 'La note doit être comprise entre 1 et 5';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_feedback_trigger
BEFORE INSERT OR UPDATE ON public.feedbacks
FOR EACH ROW
EXECUTE FUNCTION public.check_feedback();

-- Ajout d'index supplémentaires pour les clés étrangères
CREATE INDEX IF NOT EXISTS idx_profiles_association_id ON public.profiles(id) WHERE is_association = true;
CREATE INDEX IF NOT EXISTS idx_profiles_admin_id ON public.profiles(id) WHERE is_admin = true;

CREATE INDEX IF NOT EXISTS idx_missions_association_id_status ON public.missions(association_id, status);
CREATE INDEX IF NOT EXISTS idx_missions_starts_at_status ON public.missions(starts_at, status);
CREATE INDEX IF NOT EXISTS idx_missions_city_id_status ON public.missions(city_id, status);

CREATE INDEX IF NOT EXISTS idx_mission_participants_user_id_status ON public.mission_participants(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mission_participants_mission_id_status ON public.mission_participants(mission_id, status);

CREATE INDEX IF NOT EXISTS idx_volunteer_skills_user_id_level ON public.volunteer_skills(user_id, level);
CREATE INDEX IF NOT EXISTS idx_volunteer_skills_skill_id_level ON public.volunteer_skills(skill_id, level);

CREATE INDEX IF NOT EXISTS idx_volunteer_preferences_user_id_distance ON public.volunteer_preferences(user_id, max_distance_km);
CREATE INDEX IF NOT EXISTS idx_volunteer_preferences_user_id_duration ON public.volunteer_preferences(user_id, min_duration_minutes, max_duration_minutes);

CREATE INDEX IF NOT EXISTS idx_volunteer_availability_user_id_day ON public.volunteer_availability(user_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_volunteer_availability_user_id_time ON public.volunteer_availability(user_id, start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_type ON public.notifications(user_id, type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON public.notifications(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id_rating ON public.feedbacks(user_id, rating);
CREATE INDEX IF NOT EXISTS idx_feedbacks_mission_id_rating ON public.feedbacks(mission_id, rating);

CREATE INDEX IF NOT EXISTS idx_geocoding_cache_coordinates ON public.geocoding_cache USING gist (ll_to_earth(latitude, longitude));
CREATE INDEX IF NOT EXISTS idx_travel_time_cache_times ON public.travel_time_cache(travel_time_minutes);

CREATE INDEX IF NOT EXISTS idx_optimized_routes_user_id_created_at ON public.optimized_routes(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_optimized_routes_mission_count ON public.optimized_routes(mission_count);

CREATE INDEX IF NOT EXISTS idx_location_webhooks_user_id_active ON public.location_webhooks(user_id, is_active);

-- Index pour les recherches textuelles
CREATE INDEX IF NOT EXISTS idx_missions_title_trgm ON public.missions USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_missions_description_trgm ON public.missions USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_profiles_name_trgm ON public.profiles USING gin ((first_name || ' ' || last_name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_categories_name_trgm ON public.categories USING gin (name gin_trgm_ops);

-- Index pour les recherches géospatiales
CREATE INDEX IF NOT EXISTS idx_missions_location_gist ON public.missions USING gist (ll_to_earth(latitude, longitude));
CREATE INDEX IF NOT EXISTS idx_profiles_location_gist ON public.profiles USING gist (ll_to_earth(latitude, longitude));

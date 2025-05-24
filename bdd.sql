<<<<<<< Updated upstream
-- Script SQL PostgreSQL/Supabase pour MicroBénévole
-- Version enrichie avec localisation, catégories/filtres détaillés, RLS et données de test

-- Activation des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Table des secteurs d'action des associations
CREATE TABLE organization_sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de missions
CREATE TABLE mission_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs (bénévoles et représentants d'associations)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    encrypted_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    profile_picture_url TEXT,
    phone VARCHAR(20),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT),
    is_organization BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users USING GIST(location);

-- Table des profils d'associations
CREATE TABLE organization_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT),
    -- Référence au secteur d'action
    sector_id UUID REFERENCES organization_sectors(id),
    siret_number VARCHAR(14),
    creation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

CREATE INDEX idx_organization_profiles_location ON organization_profiles USING GIST(location);
CREATE INDEX idx_organization_profiles_sector ON organization_profiles(sector_id);

-- Table des missions
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organization_profiles(id) ON DELETE CASCADE,
    -- Référence au type de mission
    mission_type_id UUID REFERENCES mission_types(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER NOT NULL,
    -- Ajout du format de la mission
    format VARCHAR(20) CHECK (format IN ('Présentiel', 'À distance', 'Hybride')),
    location VARCHAR(255), -- Adresse pour le présentiel
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geo_location GEOGRAPHY(POINT), -- Pour les missions présentielles
    available_spots INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('débutant', 'intermédiaire', 'expert')),
    -- Ajout du niveau d'engagement
    engagement_level VARCHAR(30) CHECK (engagement_level IN ('Ultra-rapide', 'Petit coup de main', 'Mission avec suivi', 'Projet long')),
    -- Ajout de l'impact recherché
    desired_impact TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'terminée', 'annulée')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    
    CONSTRAINT positive_duration CHECK (duration_minutes > 0),
    CONSTRAINT positive_spots CHECK (available_spots > 0)
);

CREATE INDEX idx_missions_location ON missions(location);
CREATE INDEX idx_missions_geo_location ON missions USING GIST(geo_location);
CREATE INDEX idx_missions_coordinates ON missions(latitude, longitude);
CREATE INDEX idx_missions_dates ON missions(start_date, end_date);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_type ON missions(mission_type_id);
CREATE INDEX idx_missions_format ON missions(format);
CREATE INDEX idx_missions_engagement ON missions(engagement_level);

-- Table des compétences
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des inscriptions aux missions
CREATE TABLE mission_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'inscrit' CHECK (status IN ('inscrit', 'confirmé', 'annulé', 'terminé')),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmation_date TIMESTAMP WITH TIME ZONE,
    volunteer_feedback TEXT,
    volunteer_rating INTEGER CHECK (volunteer_rating BETWEEN 1 AND 5),
    organization_feedback TEXT,
    organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_mission UNIQUE (user_id, mission_id)
);

-- Table de liaison entre missions et compétences requises
CREATE TABLE mission_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_level VARCHAR(20),
    -- Indique si la compétence est obligatoire ou optionnelle
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_mission_skill UNIQUE (mission_id, skill_id)
);

-- Table des compétences des utilisateurs
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(20),
    validation_date TIMESTAMP WITH TIME ZONE,
    validator_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

-- Table des badges des utilisateurs
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    acquisition_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- Table des témoignages
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT FALSE,
    job_title VARCHAR(100)
);

-- Table des notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    link_url TEXT
);

-- Création de vues pour faciliter les requêtes courantes

-- Vue des missions actives avec détails
CREATE VIEW available_missions_details AS
SELECT 
    m.id AS mission_id,
    m.title,
    m.description,
    m.start_date,
    m.duration_minutes,
    m.format,
    m.location,
    m.latitude,
    m.longitude,
    m.available_spots,
    m.difficulty_level,
    m.engagement_level,
    m.desired_impact,
    m.image_url,
    op.organization_name,
    op.logo_url,
    os.name AS sector_name,
    mt.name AS mission_type_name,
    (SELECT array_agg(s.name) FROM skills s JOIN mission_skills ms ON s.id = ms.skill_id WHERE ms.mission_id = m.id) AS required_skills
FROM missions m
JOIN organization_profiles op ON m.organization_id = op.id
LEFT JOIN organization_sectors os ON op.sector_id = os.id
LEFT JOIN mission_types mt ON m.mission_type_id = mt.id
WHERE m.status = 'active' 
AND m.available_spots > 0
AND m.start_date > CURRENT_TIMESTAMP;

-- Vue des missions par localisation (correction de l'erreur: utilisation de location au lieu de city)
CREATE VIEW missions_by_location AS
SELECT location, COUNT(*) as mission_count
FROM missions
WHERE status = 'active' AND format = 'Présentiel'
GROUP BY location;

-- Vue des compétences les plus demandées
CREATE VIEW popular_skills AS
SELECT s.id, s.name, COUNT(ms.mission_id) as mission_count
FROM skills s
JOIN mission_skills ms ON s.id = ms.skill_id
JOIN missions m ON ms.mission_id = m.id
WHERE m.status = 'active'
GROUP BY s.id, s.name
ORDER BY mission_count DESC;

-- Vue des bénévoles les plus actifs
CREATE VIEW active_volunteers AS
SELECT u.id, u.first_name, u.last_name, COUNT(mr.mission_id) as completed_missions
FROM users u
JOIN mission_registrations mr ON u.id = mr.user_id
WHERE mr.status = 'terminé'
GROUP BY u.id, u.first_name, u.last_name
ORDER BY completed_missions DESC;

-- Fonction pour trouver les missions proches d'un utilisateur
CREATE OR REPLACE FUNCTION nearby_missions(user_uuid UUID, max_distance_km FLOAT DEFAULT 10)
RETURNS TABLE (
    mission_id UUID,
    title VARCHAR(255),
    organization_name VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    distance_km FLOAT,
    mission_type_name VARCHAR(100),
    sector_name VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id AS mission_id,
        m.title,
        op.organization_name,
        m.start_date,
        m.duration_minutes,
        ST_Distance(u.location, m.geo_location) / 1000 AS distance_km,
        mt.name AS mission_type_name,
        os.name AS sector_name
    FROM 
        users u
        JOIN missions m ON ST_DWithin(u.location, m.geo_location, max_distance_km * 1000)
        JOIN organization_profiles op ON m.organization_id = op.id
        LEFT JOIN mission_types mt ON m.mission_type_id = mt.id
        LEFT JOIN organization_sectors os ON op.sector_id = os.id
    WHERE 
        u.id = user_uuid
        AND m.status = 'active'
        AND m.format = 'Présentiel'
        AND m.start_date > CURRENT_TIMESTAMP
    ORDER BY 
        distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Fonctions et triggers pour la gestion automatique

-- Fonction pour mettre à jour le timestamp "updated_at"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le champ de localisation géographique à partir des coordonnées
CREATE OR REPLACE FUNCTION update_location_from_coordinates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le champ de localisation géographique des missions
CREATE OR REPLACE FUNCTION update_mission_location_from_coordinates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geo_location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour automatiquement le champ updated_at
CREATE TRIGGER update_organization_sectors_updated_at BEFORE UPDATE ON organization_sectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mission_types_updated_at BEFORE UPDATE ON mission_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_profiles_updated_at BEFORE UPDATE ON organization_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mission_registrations_updated_at BEFORE UPDATE ON mission_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers pour mettre à jour automatiquement les champs de localisation géographique
CREATE TRIGGER update_users_location BEFORE INSERT OR UPDATE OF latitude, longitude ON users FOR EACH ROW EXECUTE FUNCTION update_location_from_coordinates();
CREATE TRIGGER update_organization_profiles_location BEFORE INSERT OR UPDATE OF latitude, longitude ON organization_profiles FOR EACH ROW EXECUTE FUNCTION update_location_from_coordinates();
CREATE TRIGGER update_missions_location BEFORE INSERT OR UPDATE OF latitude, longitude ON missions FOR EACH ROW EXECUTE FUNCTION update_mission_location_from_coordinates();

-- Fonction pour vérifier la disponibilité des places lors de l'inscription à une mission
CREATE OR REPLACE FUNCTION check_mission_availability()
RETURNS TRIGGER AS $$
DECLARE
    available INTEGER;
BEGIN
    SELECT available_spots INTO available
    FROM missions
    WHERE id = NEW.mission_id;
    
    IF available <= 0 THEN
        RAISE EXCEPTION 'Plus de places disponibles pour cette mission';
    END IF;
    
    -- Réduire le nombre de places disponibles
    UPDATE missions
    SET available_spots = available_spots - 1
    WHERE id = NEW.mission_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier la disponibilité avant l'inscription
CREATE TRIGGER check_mission_availability_trigger BEFORE INSERT ON mission_registrations FOR EACH ROW EXECUTE FUNCTION check_mission_availability();

-- Fonction pour restaurer une place lorsqu'une inscription est annulée
CREATE OR REPLACE FUNCTION restore_mission_spot()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'annulé' AND NEW.status = 'annulé' THEN
        UPDATE missions
        SET available_spots = available_spots + 1
        WHERE id = NEW.mission_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour restaurer une place lors de l'annulation
CREATE TRIGGER restore_mission_spot_trigger AFTER UPDATE OF status ON mission_registrations FOR EACH ROW EXECUTE FUNCTION restore_mission_spot();

-- Fonction pour attribuer automatiquement des badges
CREATE OR REPLACE FUNCTION award_badges()
RETURNS TRIGGER AS $$
DECLARE
    completed_count INTEGER;
    badge_id UUID;
BEGIN
    -- Vérifier si l'utilisateur a terminé une mission
    IF NEW.status = 'terminé' THEN
        -- Compter le nombre de missions terminées par l'utilisateur
        SELECT COUNT(*) INTO completed_count
        FROM mission_registrations
        WHERE user_id = NEW.user_id AND status = 'terminé';
        
        -- Attribuer des badges en fonction du nombre de missions terminées
        IF completed_count = 1 THEN
            -- Badge pour la première mission
            SELECT id INTO badge_id FROM badges WHERE name = 'Première mission';
            IF badge_id IS NOT NULL THEN
                INSERT INTO user_badges (user_id, badge_id)
                VALUES (NEW.user_id, badge_id)
                ON CONFLICT (user_id, badge_id) DO NOTHING;
            END IF;
        ELSIF completed_count = 5 THEN
            -- Badge pour 5 missions
            SELECT id INTO badge_id FROM badges WHERE name = 'Bénévole engagé';
            IF badge_id IS NOT NULL THEN
                INSERT INTO user_badges (user_id, badge_id)
                VALUES (NEW.user_id, badge_id)
                ON CONFLICT (user_id, badge_id) DO NOTHING;
            END IF;
        ELSIF completed_count = 10 THEN
            -- Badge pour 10 missions
            SELECT id INTO badge_id FROM badges WHERE name = 'Bénévole expert';
            IF badge_id IS NOT NULL THEN
                INSERT INTO user_badges (user_id, badge_id)
                VALUES (NEW.user_id, badge_id)
                ON CONFLICT (user_id, badge_id) DO NOTHING;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour attribuer des badges
CREATE TRIGGER award_badges_trigger AFTER UPDATE OF status ON mission_registrations FOR EACH ROW EXECUTE FUNCTION award_badges();

-- Fonction pour créer une notification lors de l'inscription à une mission
CREATE OR REPLACE FUNCTION create_registration_notification()
RETURNS TRIGGER AS $$
DECLARE
    mission_title VARCHAR(255);
    org_id UUID;
    org_user_id UUID;
BEGIN
    -- Récupérer le titre de la mission et l'ID de l'organisation
    SELECT title, organization_id INTO mission_title, org_id
    FROM missions
    WHERE id = NEW.mission_id;
    
    -- Créer une notification pour le bénévole
    INSERT INTO notifications (user_id, title, content, link_url)
    VALUES (
        NEW.user_id,
        'Inscription confirmée',
        'Vous êtes inscrit à la mission : ' || mission_title,
        '/missions/' || NEW.mission_id
    );
    
    -- Récupérer l'ID utilisateur de l'organisation
    SELECT user_id INTO org_user_id
    FROM organization_profiles
    WHERE id = org_id;
    
    -- Créer une notification pour l'organisation
    INSERT INTO notifications (user_id, title, content, link_url)
    VALUES (
        org_user_id,
        'Nouvelle inscription',
        'Un bénévole s''est inscrit à votre mission : ' || mission_title,
        '/missions/' || NEW.mission_id || '/registrations'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer des notifications lors de l'inscription
CREATE TRIGGER create_registration_notification_trigger AFTER INSERT ON mission_registrations FOR EACH ROW EXECUTE FUNCTION create_registration_notification();

-- Fonction pour créer une notification lors de l'annulation d'une inscription
CREATE OR REPLACE FUNCTION create_cancellation_notification()
RETURNS TRIGGER AS $$
DECLARE
    mission_title VARCHAR(255);
    org_id UUID;
    org_user_id UUID;
BEGIN
    IF OLD.status != 'annulé' AND NEW.status = 'annulé' THEN
        -- Récupérer le titre de la mission et l'ID de l'organisation
        SELECT title, organization_id INTO mission_title, org_id
        FROM missions
        WHERE id = NEW.mission_id;
        
        -- Créer une notification pour le bénévole
        INSERT INTO notifications (user_id, title, content, link_url)
        VALUES (
            NEW.user_id,
            'Inscription annulée',
            'Votre inscription à la mission : ' || mission_title || ' a été annulée',
            '/missions/' || NEW.mission_id
        );
        
        -- Récupérer l'ID utilisateur de l'organisation
        SELECT user_id INTO org_user_id
        FROM organization_profiles
        WHERE id = org_id;
        
        -- Créer une notification pour l'organisation
        INSERT INTO notifications (user_id, title, content, link_url)
        VALUES (
            org_user_id,
            'Inscription annulée',
            'Un bénévole a annulé son inscription à votre mission : ' || mission_title,
            '/missions/' || NEW.mission_id || '/registrations'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer des notifications lors de l'annulation
CREATE TRIGGER create_cancellation_notification_trigger AFTER UPDATE OF status ON mission_registrations FOR EACH ROW EXECUTE FUNCTION create_cancellation_notification();

-- Fonction pour créer une notification lorsqu'une mission est sur le point de commencer
CREATE OR REPLACE FUNCTION create_mission_reminder()
RETURNS void AS $$
DECLARE
    mission_record RECORD;
    registration_record RECORD;
BEGIN
    -- Trouver les missions qui commencent dans 24 heures
    FOR mission_record IN
        SELECT id, title, start_date
        FROM missions
        WHERE status = 'active'
        AND start_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
    LOOP
        -- Pour chaque inscription à cette mission
        FOR registration_record IN
            SELECT user_id
            FROM mission_registrations
            WHERE mission_id = mission_record.id
            AND status = 'confirmé'
        LOOP
            -- Créer une notification de rappel
            INSERT INTO notifications (user_id, title, content, link_url)
            VALUES (
                registration_record.user_id,
                'Rappel de mission',
                'Votre mission "' || mission_record.title || '" commence bientôt : ' || mission_record.start_date,
                '/missions/' || mission_record.id
            );
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Création des politiques de sécurité RLS (Row Level Security)

-- Activer RLS sur les tables principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table users
CREATE POLICY users_view_self ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY users_update_self ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Politiques pour la table organization_profiles
CREATE POLICY org_profiles_view_all ON organization_profiles
    FOR SELECT
    USING (true);

CREATE POLICY org_profiles_update_own ON organization_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Politiques pour la table missions
CREATE POLICY missions_view_all ON missions
    FOR SELECT
    USING (true);

CREATE POLICY missions_insert_own_org ON missions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organization_profiles
            WHERE id = organization_id AND user_id = auth.uid()
        )
    );

CREATE POLICY missions_update_own_org ON missions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM organization_profiles
            WHERE id = organization_id AND user_id = auth.uid()
        )
    );

CREATE POLICY missions_delete_own_org ON missions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM organization_profiles
            WHERE id = organization_id AND user_id = auth.uid()
        )
    );

-- Politiques pour la table mission_registrations
CREATE POLICY registrations_view_own ON mission_registrations
    FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM missions m
            JOIN organization_profiles op ON m.organization_id = op.id
            WHERE m.id = mission_id AND op.user_id = auth.uid()
        )
    );

CREATE POLICY registrations_insert_self ON mission_registrations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY registrations_update_own ON mission_registrations
    FOR UPDATE
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM missions m
            JOIN organization_profiles op ON m.organization_id = op.id
            WHERE m.id = mission_id AND op.user_id = auth.uid()
        )
    );

-- Politiques pour la table notifications
CREATE POLICY notifications_view_own ON notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY notifications_update_own ON notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Insertion de données de test pour les secteurs d'action
INSERT INTO organization_sectors (name, description) VALUES
('Environnement', 'Protection de l''environnement, biodiversité, développement durable'),
('Social', 'Aide aux personnes en difficulté, lutte contre l''exclusion'),
('Éducation', 'Soutien scolaire, alphabétisation, formation'),
('Santé', 'Prévention, accompagnement des malades, recherche médicale'),
('Culture', 'Promotion de l''art et de la culture, patrimoine'),
('Sport', 'Promotion du sport et des activités physiques'),
('Humanitaire', 'Aide d''urgence, développement international'),
('Droits humains', 'Défense des droits et libertés fondamentales'),
('Numérique', 'Inclusion numérique, développement technologique');

-- Insertion de données de test pour les types de missions
INSERT INTO mission_types (name, description) VALUES
('Accompagnement', 'Accompagnement de personnes (enfants, personnes âgées, etc.)'),
('Animation', 'Animation d''ateliers, d''événements'),
('Communication', 'Création de contenu, gestion des réseaux sociaux'),
('Logistique', 'Organisation, transport, manutention'),
('Administration', 'Gestion administrative, comptabilité'),
('Technique', 'Réparation, bricolage, informatique'),
('Conseil', 'Expertise, consultation, formation'),
('Collecte', 'Collecte de fonds, de denrées, de matériel'),
('Sensibilisation', 'Information, prévention, plaidoyer');

-- Insertion de données de test pour les compétences
INSERT INTO skills (name, description, category) VALUES
('Rédaction', 'Capacité à rédiger des contenus clairs et engageants', 'Communication'),
('Photographie', 'Prise de vue et retouche photo', 'Communication'),
('Montage vidéo', 'Création et édition de contenu vidéo', 'Communication'),
('Gestion de projet', 'Organisation et suivi de projets', 'Management'),
('Comptabilité', 'Gestion financière et comptable', 'Administration'),
('Développement web', 'Création et maintenance de sites web', 'Technique'),
('Design graphique', 'Création d''identités visuelles et supports', 'Communication'),
('Animation de groupe', 'Capacité à animer des ateliers et groupes', 'Animation'),
('Langues étrangères', 'Maîtrise de langues étrangères', 'Communication'),
('Premiers secours', 'Formation aux gestes de premiers secours', 'Santé'),
('Jardinage', 'Entretien d''espaces verts, permaculture', 'Environnement'),
('Cuisine', 'Préparation de repas, connaissance culinaire', 'Service'),
('Bricolage', 'Réparation, construction, DIY', 'Technique'),
('Conduite', 'Permis de conduire et expérience de conduite', 'Logistique'),
('Médiation', 'Résolution de conflits, facilitation', 'Social');

-- Insertion de données de test pour les badges
INSERT INTO badges (name, description, image_url, requirements) VALUES
('Première mission', 'A complété sa première mission de bénévolat', '/badges/first_mission.png', 'Compléter une mission'),
('Bénévole engagé', 'A complété 5 missions de bénévolat', '/badges/engaged.png', 'Compléter 5 missions'),
('Bénévole expert', 'A complété 10 missions de bénévolat', '/badges/expert.png', 'Compléter 10 missions'),
('Polyvalent', 'A participé à des missions dans 3 domaines différents', '/badges/versatile.png', 'Missions dans 3 secteurs'),
('Fidèle', 'Membre depuis plus d''un an', '/badges/loyal.png', 'Ancienneté > 1 an'),
('Ambassadeur', 'A parrainé 3 nouveaux bénévoles', '/badges/ambassador.png', 'Parrainer 3 bénévoles'),
('Coup de cœur', 'A reçu d''excellentes évaluations', '/badges/favorite.png', '3 évaluations 5 étoiles');





                                                                                                                                                    -- Migration pour adapter la structure existante vers le nouveau schéma
                                                                                                                                                    -- Compatible avec Supabase et l'authentification existante

-- 1. Création des nouvelles tables de référence
CREATE TABLE IF NOT EXISTS public.organization_sectors (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mission_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Création de la table profiles si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name varchar(100),
    last_name varchar(100),
    address text,
    postal_code varchar(10),
    city varchar(100),
    latitude numeric(10,8),
    longitude numeric(11,8),
    profile_picture_url text,
    last_login timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Création d'une table organization_profiles liée aux profiles existants
CREATE TABLE IF NOT EXISTS public.organization_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name varchar(255) NOT NULL,
    description text,
    logo_url text,
    website_url text,
    address text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    sector_id uuid REFERENCES public.organization_sectors(id),
    siret_number varchar(14),
    creation_date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_user_id UNIQUE (user_id)
);

-- 4. Mise à jour de la table missions avec les nouveaux champs
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS mission_type_id uuid REFERENCES public.mission_types(id),
ADD COLUMN IF NOT EXISTS format varchar(20) CHECK (format IN ('Présentiel', 'À distance', 'Hybride')),
ADD COLUMN IF NOT EXISTS difficulty_level varchar(20) CHECK (difficulty_level IN ('débutant', 'intermédiaire', 'expert')),
ADD COLUMN IF NOT EXISTS engagement_level varchar(30) CHECK (engagement_level IN ('Ultra-rapide', 'Petit coup de main', 'Mission avec suivi', 'Projet long')),
ADD COLUMN IF NOT EXISTS desired_impact text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS postal_code varchar(10),
ADD COLUMN IF NOT EXISTS location varchar(255);

-- Renommer les colonnes pour correspondre au nouveau schéma
DO $$
BEGIN
    -- Vérifier si la colonne starts_at existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'missions' AND column_name = 'starts_at'
    ) THEN
        ALTER TABLE public.missions RENAME COLUMN starts_at TO start_date;
    END IF;
    
    -- Vérifier si la colonne ends_at existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'missions' AND column_name = 'ends_at'
    ) THEN
        ALTER TABLE public.missions RENAME COLUMN ends_at TO end_date;
    END IF;
END $$;

-- 5. Mise à jour de la table skills avec les nouveaux champs
ALTER TABLE public.skills 
ADD COLUMN IF NOT EXISTS category varchar(50);

-- 6. Création de la table mission_skills pour les liaisons
CREATE TABLE IF NOT EXISTS public.mission_skills (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_id uuid NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_level varchar(20),
    is_required boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT unique_mission_skill UNIQUE (mission_id, skill_id)
);

-- 7. Renommer mission_participants en mission_registrations pour correspondre au schéma
DO $$
BEGIN
    -- Vérifier si la table mission_participants existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'mission_participants' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.mission_participants RENAME TO mission_registrations;
    END IF;
END $$;

-- Ajouter les nouveaux champs à mission_registrations
ALTER TABLE public.mission_registrations 
ADD COLUMN IF NOT EXISTS registration_date timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS confirmation_date timestamptz,
ADD COLUMN IF NOT EXISTS volunteer_feedback text,
ADD COLUMN IF NOT EXISTS volunteer_rating integer CHECK (volunteer_rating BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS organization_feedback text,
ADD COLUMN IF NOT EXISTS organization_rating integer CHECK (organization_rating BETWEEN 1 AND 5);

-- Ajout de la contrainte unique sans utiliser IF NOT EXISTS (non supporté par PostgreSQL)
DO $$
BEGIN
    -- Vérifier si la contrainte existe déjà
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_mission' 
        AND conrelid = 'public.mission_registrations'::regclass
    ) THEN
        -- Ajouter la contrainte si elle n'existe pas
        ALTER TABLE public.mission_registrations 
        ADD CONSTRAINT unique_user_mission UNIQUE (user_id, mission_id);
    END IF;
END $$;

-- 8. Mise à jour des statuts pour correspondre au nouveau schéma
-- Missions: active, terminée, annulée
-- Registrations: inscrit, confirmé, annulé, terminé

-- 9. Création des index pour les performances
CREATE INDEX IF NOT EXISTS idx_organization_profiles_sector ON public.organization_profiles(sector_id);
CREATE INDEX IF NOT EXISTS idx_missions_type ON public.missions(mission_type_id);
CREATE INDEX IF NOT EXISTS idx_missions_format ON public.missions(format);
CREATE INDEX IF NOT EXISTS idx_missions_engagement ON public.missions(engagement_level);
CREATE INDEX IF NOT EXISTS idx_missions_coordinates ON public.missions(latitude, longitude);

-- 10. Création des vues compatibles avec le nouveau schéma
-- CORRECTION: Supprimer d'abord la vue existante avant de la recréer
DROP VIEW IF EXISTS public.available_missions_details;

CREATE VIEW public.available_missions_details AS
SELECT 
    m.id AS mission_id,
    m.title,
    m.description,
    m.start_date,
    m.duration_minutes,
    m.format,
    m.location,
    m.latitude,
    m.longitude,
    m.available_spots,
    m.difficulty_level,
    m.engagement_level,
    m.desired_impact,
    m.image_url,
    COALESCE(op.organization_name, p.first_name || ' ' || p.last_name) AS organization_name,
    op.logo_url,
    os.name AS sector_name,
    mt.name AS mission_type_name,
    (SELECT array_agg(s.name) FROM public.skills s 
     JOIN public.mission_skills ms ON s.id = ms.skill_id 
     WHERE ms.mission_id = m.id) AS required_skills
FROM public.missions m
LEFT JOIN public.organization_profiles op ON m.organization_id = op.id
LEFT JOIN public.profiles p ON m.organization_id = op.user_id
LEFT JOIN public.organization_sectors os ON op.sector_id = os.id
LEFT JOIN public.mission_types mt ON m.mission_type_id = mt.id
WHERE m.status = 'active' 
AND m.available_spots > 0
AND m.start_date > now();

-- 11. Insertion des données de référence
INSERT INTO public.organization_sectors (name, description) VALUES
('Environnement', 'Protection de l''environnement, biodiversité, développement durable'),
('Social', 'Aide aux personnes en difficulté, lutte contre l''exclusion'),
('Éducation', 'Soutien scolaire, alphabétisation, formation'),
('Santé', 'Prévention, accompagnement des malades, recherche médicale'),
('Culture', 'Promotion de l''art et de la culture, patrimoine'),
('Sport', 'Promotion du sport et des activités physiques'),
('Humanitaire', 'Aide d''urgence, développement international'),
('Droits humains', 'Défense des droits et libertés fondamentales'),
('Numérique', 'Inclusion numérique, développement technologique')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.mission_types (name, description) VALUES
('Accompagnement', 'Accompagnement de personnes (enfants, personnes âgées, etc.)'),
('Animation', 'Animation d''ateliers, d''événements'),
('Communication', 'Création de contenu, gestion des réseaux sociaux'),
('Logistique', 'Organisation, transport, manutention'),
('Administration', 'Gestion administrative, comptabilité'),
('Technique', 'Réparation, bricolage, informatique'),
('Conseil', 'Expertise, consultation, formation'),
('Collecte', 'Collecte de fonds, de denrées, de matériel'),
('Sensibilisation', 'Information, prévention, plaidoyer')
ON CONFLICT (name) DO NOTHING;

-- Mise à jour des skills existantes avec des catégories
DO $$
BEGIN
    -- Vérifier si la table skills existe et contient des données
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'skills' AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM public.skills LIMIT 1
    ) THEN
        UPDATE public.skills SET category = 'Communication' WHERE name IN ('Rédaction', 'Photographie', 'Montage vidéo', 'Design graphique', 'Langues étrangères');
        UPDATE public.skills SET category = 'Management' WHERE name = 'Gestion de projet';
        UPDATE public.skills SET category = 'Administration' WHERE name = 'Comptabilité';
        UPDATE public.skills SET category = 'Technique' WHERE name IN ('Développement web', 'Bricolage');
        UPDATE public.skills SET category = 'Animation' WHERE name = 'Animation de groupe';
        UPDATE public.skills SET category = 'Santé' WHERE name = 'Premiers secours';
        UPDATE public.skills SET category = 'Environnement' WHERE name = 'Jardinage';
        UPDATE public.skills SET category = 'Service' WHERE name = 'Cuisine';
        UPDATE public.skills SET category = 'Logistique' WHERE name = 'Conduite';
        UPDATE public.skills SET category = 'Social' WHERE name = 'Médiation';
    END IF;
END $$;

-- Insertion de nouvelles compétences si elles n'existent pas
INSERT INTO public.skills (name, description, category) VALUES
('Rédaction', 'Capacité à rédiger des contenus clairs et engageants', 'Communication'),
('Photographie', 'Prise de vue et retouche photo', 'Communication'),
('Montage vidéo', 'Création et édition de contenu vidéo', 'Communication'),
('Gestion de projet', 'Organisation et suivi de projets', 'Management'),
('Comptabilité', 'Gestion financière et comptable', 'Administration'),
('Développement web', 'Création et maintenance de sites web', 'Technique'),
('Design graphique', 'Création d''identités visuelles et supports', 'Communication'),
('Animation de groupe', 'Capacité à animer des ateliers et groupes', 'Animation'),
('Langues étrangères', 'Maîtrise de langues étrangères', 'Communication'),
('Premiers secours', 'Formation aux gestes de premiers secours', 'Santé'),
('Jardinage', 'Entretien d''espaces verts, permaculture', 'Environnement'),
('Cuisine', 'Préparation de repas, connaissance culinaire', 'Service'),
('Bricolage', 'Réparation, construction, DIY', 'Technique'),
('Conduite', 'Permis de conduire et expérience de conduite', 'Logistique'),
('Médiation', 'Résolution de conflits, facilitation', 'Social')
ON CONFLICT (name) DO NOTHING;

-- 12. Triggers de mise à jour automatique
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers
DROP TRIGGER IF EXISTS handle_updated_at ON public.organization_sectors;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.organization_sectors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.mission_types;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.mission_types
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.organization_profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.organization_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. Politiques RLS pour les nouvelles tables
ALTER TABLE public.organization_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques pour organization_sectors et mission_types (lecture publique)
CREATE POLICY "Public read access" ON public.organization_sectors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mission_types FOR SELECT USING (true);

-- Politiques pour profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques pour organization_profiles
CREATE POLICY "Public read access" ON public.organization_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their organization profile" ON public.organization_profiles 
    FOR ALL USING (auth.uid() = user_id);

-- Politiques pour mission_skills
CREATE POLICY "Public read access" ON public.mission_skills FOR SELECT USING (true);
-- CORRECTION: Correction de l'erreur "missing FROM-clause entry for table op"
CREATE POLICY "Mission owners can manage skills" ON public.mission_skills 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.missions m 
            JOIN public.organization_profiles op_inner ON m.organization_id = op_inner.id
            WHERE m.id = mission_id 
            AND EXISTS (
                SELECT 1 FROM public.organization_profiles op
                WHERE op.user_id = auth.uid()
                AND op.id = m.organization_id
            )
        )
    );

=======
-- Migration pour mettre à jour la base de données vers la nouvelle structure
-- Compatible avec Supabase

-- 1. Création des types énumérés
DO $$ BEGIN
    CREATE TYPE mission_status_enum AS ENUM ('draft', 'active', 'in_progress', 'completed', 'cancelled', 'validated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE participant_status_enum AS ENUM ('registered', 'confirmed', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE badge_type_enum AS ENUM ('reconnaissance', 'competence', 'participation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM ('location_updated', 'mission_reminder', 'mission_validated', 'mission_cancelled', 'badge_awarded', 'mission_application');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Mise à jour de la table missions avec les nouveaux champs
ALTER TABLE public.missions 
ADD COLUMN IF NOT EXISTS skills_required text[],
ADD COLUMN IF NOT EXISTS min_skills_required text[],
ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS city_id uuid REFERENCES public.cities(id),
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS address text;

-- Mise à jour du type de status pour missions
ALTER TABLE public.missions 
ALTER COLUMN status TYPE text;

-- 3. Mise à jour de la table mission_participants
ALTER TABLE public.mission_participants 
ADD COLUMN IF NOT EXISTS feedback text,
ADD COLUMN IF NOT EXISTS rating integer CHECK (rating >= 1 AND rating <= 5);

-- Mise à jour du type de status pour participants
ALTER TABLE public.mission_participants 
ALTER COLUMN status TYPE text;

-- 4. Mise à jour de la table badges
ALTER TABLE public.badges 
ALTER COLUMN badge_type TYPE text;

-- 5. Ajout de nouvelles tables si elles n'existent pas

-- Table des types de mission
CREATE TABLE IF NOT EXISTS public.mission_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table de cache pour le géocodage
CREATE TABLE IF NOT EXISTS public.geocoding_cache (
    address text PRIMARY KEY,
    latitude numeric,
    longitude numeric,
    formatted_address text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table de cache pour les temps de trajet
CREATE TABLE IF NOT EXISTS public.travel_time_cache (
    origin_lat numeric NOT NULL,
    origin_lon numeric NOT NULL,
    dest_lat numeric NOT NULL,
    dest_lon numeric NOT NULL,
    travel_time_minutes integer,
    distance_km numeric,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (origin_lat, origin_lon, dest_lat, dest_lon)
);

-- Table des disponibilités des bénévoles
CREATE TABLE IF NOT EXISTS public.volunteer_availability (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time time,
    end_time time,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table des routes optimisées
CREATE TABLE IF NOT EXISTS public.optimized_routes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_count integer,
    total_distance_km numeric,
    total_duration_minutes integer,
    route_order jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table des webhooks de localisation
CREATE TABLE IF NOT EXISTS public.location_webhooks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint_url text NOT NULL,
    secret_key text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6. Fonctions utilitaires pour Supabase

-- Fonction de calcul de distance (Haversine)
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric
) RETURNS numeric AS $$
DECLARE
    dlat numeric;
    dlon numeric;
    a numeric;
    c numeric;
    r numeric := 6371; -- Rayon de la Terre en km
BEGIN
    IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
        RETURN NULL;
    END IF;
    
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction de calcul de temps de trajet (estimation simple)
CREATE OR REPLACE FUNCTION public.calculate_travel_time(
    lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric
) RETURNS TABLE(travel_time_minutes integer, distance_km numeric) AS $$
DECLARE
    dist numeric;
    time_min integer;
BEGIN
    -- Vérifier le cache d'abord
    SELECT travel_time_minutes, distance_km 
    INTO time_min, dist
    FROM public.travel_time_cache 
    WHERE origin_lat = lat1 AND origin_lon = lon1 
    AND dest_lat = lat2 AND dest_lon = lon2;
    
    IF FOUND THEN
        RETURN QUERY SELECT time_min, dist;
        RETURN;
    END IF;
    
    -- Calculer la distance
    dist := public.calculate_distance(lat1, lon1, lat2, lon2);
    
    IF dist IS NULL THEN
        RETURN QUERY SELECT NULL::integer, NULL::numeric;
        RETURN;
    END IF;
    
    -- Estimation du temps (vitesse moyenne de 30 km/h en ville)
    time_min := CEIL(dist / 30.0 * 60);
    
    -- Mettre en cache
    INSERT INTO public.travel_time_cache (
        origin_lat, origin_lon, dest_lat, dest_lon, 
        travel_time_minutes, distance_km
    ) VALUES (lat1, lon1, lat2, lon2, time_min, dist)
    ON CONFLICT DO NOTHING;
    
    RETURN QUERY SELECT time_min, dist;
END;
$$ LANGUAGE plpgsql;

-- 7. Mise à jour des triggers

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Appliquer le trigger à toutes les tables
DROP TRIGGER IF EXISTS handle_updated_at ON public.missions;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.missions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.mission_participants;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.mission_participants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.categories;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.badges;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.badges
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.volunteer_availability;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.volunteer_availability
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Triggers de validation

-- Validation des statuts de mission
CREATE OR REPLACE FUNCTION public.check_mission_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status NOT IN ('draft', 'active', 'in_progress', 'completed', 'cancelled', 'validated') THEN
        RAISE EXCEPTION 'Statut de mission invalide: %', NEW.status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_mission_status ON public.missions;
CREATE TRIGGER check_mission_status
    BEFORE INSERT OR UPDATE ON public.missions
    FOR EACH ROW EXECUTE FUNCTION public.check_mission_status();

-- Validation des statuts de participant
CREATE OR REPLACE FUNCTION public.check_participant_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status NOT IN ('registered', 'confirmed', 'completed', 'cancelled', 'no_show') THEN
        RAISE EXCEPTION 'Statut de participant invalide: %', NEW.status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_participant_status ON public.mission_participants;
CREATE TRIGGER check_participant_status
    BEFORE INSERT OR UPDATE ON public.mission_participants
    FOR EACH ROW EXECUTE FUNCTION public.check_participant_status();

-- 9. Fonction de mise à jour des places prises
CREATE OR REPLACE FUNCTION public.update_mission_spots()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le nombre de places prises
    UPDATE public.missions 
    SET spots_taken = (
        SELECT COUNT(*) 
        FROM public.mission_participants 
        WHERE mission_id = COALESCE(NEW.mission_id, OLD.mission_id)
        AND status IN ('registered', 'confirmed', 'completed')
    )
    WHERE id = COALESCE(NEW.mission_id, OLD.mission_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_mission_spots ON public.mission_participants;
CREATE TRIGGER update_mission_spots
    AFTER INSERT OR UPDATE OR DELETE ON public.mission_participants
    FOR EACH ROW EXECUTE FUNCTION public.update_mission_spots();

-- 10. Insertion de données par défaut

-- Catégories par défaut
INSERT INTO public.categories (name, description, icon) VALUES
('Aide alimentaire', 'Distribution de repas et collecte alimentaire', 'utensils'),
('Soutien scolaire', 'Aide aux devoirs et accompagnement éducatif', 'book-open'),
('Environnement', 'Actions pour la protection de l''environnement', 'leaf'),
('Santé', 'Accompagnement et soutien dans le domaine de la santé', 'heart'),
('Personnes âgées', 'Accompagnement et aide aux personnes âgées', 'users'),
('Enfance', 'Activités et soutien pour les enfants', 'baby'),
('Handicap', 'Accompagnement des personnes en situation de handicap', 'accessibility'),
('Insertion', 'Aide à l''insertion sociale et professionnelle', 'briefcase')
ON CONFLICT (name) DO NOTHING;

-- Badges par défaut
INSERT INTO public.badges (name, description, badge_type, icon) VALUES
('Premier pas', 'Première mission réalisée', 'participation', 'star'),
('Assidu', '10 missions réalisées', 'participation', 'award'),
('Fidèle', '50 missions réalisées', 'participation', 'medal'),
('Expert alimentaire', 'Spécialisé dans l''aide alimentaire', 'competence', 'utensils'),
('Mentor éducatif', 'Compétent en soutien scolaire', 'competence', 'graduation-cap'),
('Éco-guerrier', 'Engagé pour l''environnement', 'competence', 'leaf'),
('Ange gardien', 'Dévoué aux personnes âgées', 'reconnaissance', 'heart'),
('Ami des enfants', 'Excellent avec les enfants', 'reconnaissance', 'smile')
ON CONFLICT (name) DO NOTHING;

-- 11. Politiques RLS (Row Level Security)

-- Activer RLS sur les tables sensibles
ALTER TABLE public.mission_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimized_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_webhooks ENABLE ROW LEVEL SECURITY;

-- Politiques pour mission_participants
DROP POLICY IF EXISTS "Users can view their own participations" ON public.mission_participants;
CREATE POLICY "Users can view their own participations" ON public.mission_participants
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own participations" ON public.mission_participants;
CREATE POLICY "Users can insert their own participations" ON public.mission_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own participations" ON public.mission_participants;
CREATE POLICY "Users can update their own participations" ON public.mission_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour volunteer_availability
DROP POLICY IF EXISTS "Users can manage their own availability" ON public.volunteer_availability;
CREATE POLICY "Users can manage their own availability" ON public.volunteer_availability
    FOR ALL USING (auth.uid() = user_id);

-- Politiques pour optimized_routes
DROP POLICY IF EXISTS "Users can manage their own routes" ON public.optimized_routes;
CREATE POLICY "Users can manage their own routes" ON public.optimized_routes
    FOR ALL USING (auth.uid() = user_id);

-- Politiques pour location_webhooks
DROP POLICY IF EXISTS "Users can manage their own webhooks" ON public.location_webhooks;
CREATE POLICY "Users can manage their own webhooks" ON public.location_webhooks
    FOR ALL USING (auth.uid() = user_id);

-- 12. Index pour les performances
CREATE INDEX IF NOT EXISTS idx_missions_status ON public.missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_starts_at ON public.missions(starts_at);
CREATE INDEX IF NOT EXISTS idx_missions_association_id ON public.missions(association_id);
CREATE INDEX IF NOT EXISTS idx_missions_location ON public.missions(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_mission_participants_user_id ON public.mission_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_participants_mission_id ON public.mission_participants(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_participants_status ON public.mission_participants(status);

CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_is_association ON public.profiles(is_association);

-- 13. Contraintes de cohérence
ALTER TABLE public.missions 
ADD CONSTRAINT check_mission_dates CHECK (starts_at < ends_at),
ADD CONSTRAINT check_spots CHECK (spots_taken <= spots_available),
ADD CONSTRAINT check_duration CHECK (duration_minutes > 0);

ALTER TABLE public.mission_participants
ADD CONSTRAINT check_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

ALTER TABLE public.volunteer_availability
ADD CONSTRAINT check_day_of_week CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
ADD CONSTRAINT check_time_order CHECK (start_time IS NULL OR end_time IS NULL OR start_time < end_time);

-- 14. Commentaires pour la documentation
COMMENT ON TABLE public.missions IS 'Table des missions proposées par les associations';
COMMENT ON TABLE public.mission_participants IS 'Table de liaison entre les bénévoles et les missions';
COMMENT ON TABLE public.volunteer_availability IS 'Disponibilités des bénévoles par jour de la semaine';
COMMENT ON TABLE public.geocoding_cache IS 'Cache des adresses géocodées pour éviter les appels API répétés';
COMMENT ON TABLE public.travel_time_cache IS 'Cache des temps de trajet calculés';
COMMENT ON TABLE public.optimized_routes IS 'Routes optimisées pour les bénévoles';

COMMENT ON FUNCTION public.calculate_distance IS 'Calcule la distance entre deux points géographiques (formule de Haversine)';
COMMENT ON FUNCTION public.calculate_travel_time IS 'Estime le temps de trajet entre deux points avec cache';

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
  is_admin BOOLEAN DEFAULT false NOT NULL,
  UNIQUE (id)
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (name, postal_code)
);

-- Ajout de la référence à cities après sa création
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- Table des badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('reconnaissance', 'competence')),
  CONSTRAINT check_badge_name CHECK (length(trim(name)) > 0),
  CONSTRAINT check_badge_description CHECK (length(trim(description)) > 0),
  CONSTRAINT check_badge_icon CHECK (length(trim(icon)) > 0)
);

-- Table de liaison badges <-> utilisateurs
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_user_badge_unique UNIQUE (user_id, badge_id)
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

-- Table de liaison missions <-> catégories
CREATE TABLE IF NOT EXISTS public.mission_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT mission_category_unique UNIQUE (mission_id, category_id)
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
  ),
  CONSTRAINT volunteer_availability_unique UNIQUE (user_id, day_of_week, start_time, end_time)
);

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
  CONSTRAINT volunteer_preferences_unique UNIQUE (user_id)
);

-- Table des compétences des bénévoles
CREATE TABLE IF NOT EXISTS public.volunteer_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  level INTEGER CHECK (level >= 1 AND level <= 5),
  awarded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  awarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT volunteer_skill_unique UNIQUE (user_id, skill_id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('location_updated', 'mission_reminder', 'mission_validated', 'mission_cancelled', 'badge_awarded')),
  title VARCHAR(200) NOT NULL,
  message VARCHAR(1000) NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT notification_unique UNIQUE (user_id, type, title, created_at)
);

-- Table des retours d'expérience
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT feedback_unique UNIQUE (user_id, mission_id)
);

-- Table des webhooks de localisation
CREATE TABLE IF NOT EXISTS public.location_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint_url VARCHAR(255) NOT NULL,
  secret_key VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT location_webhook_unique UNIQUE (user_id, endpoint_url)
);

-- Table du cache de géocodage
CREATE TABLE IF NOT EXISTS public.geocoding_cache (
  address VARCHAR(255) PRIMARY KEY,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  formatted_address VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table du cache des temps de trajet
CREATE TABLE IF NOT EXISTS public.travel_time_cache (
  origin_lat DECIMAL(10, 8),
  origin_lon DECIMAL(11, 8),
  dest_lat DECIMAL(10, 8),
  dest_lon DECIMAL(11, 8),
  travel_time_minutes INTEGER,
  distance_km DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT travel_time_cache_unique PRIMARY KEY (origin_lat, origin_lon, dest_lat, dest_lon)
);

-- Table des itinéraires optimisés
CREATE TABLE IF NOT EXISTS public.optimized_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_distance_km DECIMAL,
  total_duration_minutes INTEGER,
  mission_count INTEGER,
  route_order JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT optimized_route_unique UNIQUE (user_id, created_at)
);
>>>>>>> Stashed changes

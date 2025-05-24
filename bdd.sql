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

-- Vue des missions par ville
CREATE VIEW missions_by_city AS
SELECT city, COUNT(*) as mission_count
FROM missions
WHERE status = 'active' AND format = 'Présentiel'
GROUP BY city;

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
CREATE TRIGGER restore_mission_spot_trigger BEFORE UPDATE ON mission_registrations FOR EACH ROW EXECUTE FUNCTION restore_mission_spot();

-- Fonction pour créer une notification lorsqu'un utilisateur s'inscrit à une mission
CREATE OR REPLACE FUNCTION create_registration_notification()
RETURNS TRIGGER AS $$
DECLARE
    mission_title TEXT;
    organization_id UUID;
    organization_user_id UUID;
    volunteer_name TEXT;
BEGIN
    SELECT m.title, m.organization_id INTO mission_title, organization_id FROM missions m WHERE m.id = NEW.mission_id;
    SELECT op.user_id INTO organization_user_id FROM organization_profiles op WHERE op.id = organization_id;
    SELECT CONCAT(u.first_name, ' ', u.last_name) INTO volunteer_name FROM users u WHERE u.id = NEW.user_id;
    
    INSERT INTO notifications (user_id, title, content, link_url)
    VALUES (
        organization_user_id,
        'Nouvelle inscription à une mission',
        CONCAT('Le bénévole ', volunteer_name, ' s''est inscrit à votre mission "', mission_title, '".'),
        '/missions/' || NEW.mission_id
    );
    
    INSERT INTO notifications (user_id, title, content, link_url)
    VALUES (
        NEW.user_id,
        'Inscription confirmée',
        CONCAT('Vous êtes inscrit à la mission "', mission_title, '". Merci de votre engagement!'),
        '/missions/' || NEW.mission_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer des notifications lors de l'inscription
CREATE TRIGGER create_registration_notification_trigger AFTER INSERT ON mission_registrations FOR EACH ROW EXECUTE FUNCTION create_registration_notification();

-- Fonction pour créer une notification lorsqu'un badge est attribué
CREATE OR REPLACE FUNCTION create_badge_notification()
RETURNS TRIGGER AS $$
DECLARE
    badge_name TEXT;
BEGIN
    SELECT b.name INTO badge_name FROM badges b WHERE b.id = NEW.badge_id;
    
    INSERT INTO notifications (user_id, title, content, link_url)
    VALUES (
        NEW.user_id,
        'Nouveau badge obtenu',
        CONCAT('Félicitations! Vous avez obtenu le badge "', badge_name, '".'),
        '/profile/badges'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer des notifications lors de l'attribution d'un badge
CREATE TRIGGER create_badge_notification_trigger AFTER INSERT ON user_badges FOR EACH ROW EXECUTE FUNCTION create_badge_notification();

-- Configuration des politiques RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE organization_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour les tables de référence (lecture seule pour tous)
CREATE POLICY "Anyone can view organization sectors" ON organization_sectors FOR SELECT USING (true);
CREATE POLICY "Anyone can view mission types" ON mission_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);

-- Politiques pour la table users
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
-- CREATE POLICY "Admins can do anything with users" ON users USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.email = 'admin@microbenevole.fr'));

-- Politiques pour la table organization_profiles
CREATE POLICY "Anyone can view organization profiles" ON organization_profiles FOR SELECT USING (true);
CREATE POLICY "Organizations can update their own profile" ON organization_profiles FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Organizations can create their profile" ON organization_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Politiques pour la table missions
CREATE POLICY "Anyone can view active missions" ON missions FOR SELECT USING (status = 'active' OR organization_id IN (SELECT op.id FROM organization_profiles op WHERE op.user_id = auth.uid()));
CREATE POLICY "Organizations can manage their own missions" ON missions USING (organization_id IN (SELECT op.id FROM organization_profiles op WHERE op.user_id = auth.uid())) WITH CHECK (organization_id IN (SELECT op.id FROM organization_profiles op WHERE op.user_id = auth.uid()));

-- Politiques pour la table mission_registrations
CREATE POLICY "Users can view their own registrations" ON mission_registrations FOR SELECT USING (user_id = auth.uid() OR mission_id IN (SELECT m.id FROM missions m JOIN organization_profiles op ON m.organization_id = op.id WHERE op.user_id = auth.uid()));
CREATE POLICY "Users can register for missions" ON mission_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own registrations" ON mission_registrations FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Organizations can manage registrations for their missions" ON mission_registrations USING (mission_id IN (SELECT m.id FROM missions m JOIN organization_profiles op ON m.organization_id = op.id WHERE op.user_id = auth.uid())) WITH CHECK (mission_id IN (SELECT m.id FROM missions m JOIN organization_profiles op ON m.organization_id = op.id WHERE op.user_id = auth.uid()));

-- Politiques pour la table notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Politiques pour les autres tables
CREATE POLICY "Users can view their own skills" ON user_skills FOR SELECT USING (user_id = auth.uid() OR validator_id = auth.uid());
CREATE POLICY "Organizations can validate skills" ON user_skills FOR INSERT WITH CHECK (validator_id = auth.uid());
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can view public testimonials" ON testimonials FOR SELECT USING (is_visible = true OR user_id = auth.uid());
CREATE POLICY "Users can create their own testimonials" ON testimonials FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own testimonials" ON testimonials FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anyone can view mission skills" ON mission_skills FOR SELECT USING (true);

-- Insertion de données d'exemple

-- Insertion des secteurs d'action
INSERT INTO organization_sectors (name, description) VALUES
('Humanitaire & Urgence', 'Aide en situation de crise, secours'),
('Alimentation & Précarité', 'Aide alimentaire, lutte contre la pauvreté'),
('Enfance & Éducation', 'Soutien scolaire, protection de l''enfance'),
('Personnes âgées & isolées', 'Accompagnement, lutte contre l''isolement'),
('Handicap & Inclusion', 'Soutien aux personnes en situation de handicap'),
('Migrants & Réfugiés', 'Accueil, accompagnement juridique et social'),
('Santé & Soins', 'Accès aux soins, prévention, recherche'),
('Femmes & Égalité', 'Lutte contre les violences, promotion de l''égalité'),
('Environnement & Écologie', 'Protection de la nature, sensibilisation'),
('Animaux', 'Protection animale, refuges');

-- Insertion des types de missions
INSERT INTO mission_types (name, description) VALUES
('Aide alimentaire', 'Distribution de repas, collecte de denrées'),
('Accompagnement humain', 'Visites, écoute, soutien moral'),
('Soutien scolaire / éducatif', 'Aide aux devoirs, lecture, alphabétisation'),
('Aide administrative', 'Aide pour remplir des documents, médiation'),
('Traduction / langue', 'Interprétariat, traduction de documents'),
('Logistique / manutention', 'Déménagement, tri, rangement'),
('Communication / graphisme', 'Création de supports visuels, gestion des réseaux sociaux'),
('Événementiel', 'Aide à l''organisation, tenue de stands'),
('Soins / bien-être', 'Coiffure, soins esthétiques, aide aux soins de base'),
('Sensibilisation / prévention', 'Animation d''ateliers, information du public'),
('Numérique / informatique', 'Création de site web, réparation, initiation');

-- Insertion des compétences
INSERT INTO skills (name, description, category) VALUES
('Communication', 'Capacité à communiquer efficacement à l''oral et à l''écrit', 'Soft skills'),
('Organisation', 'Capacité à planifier et organiser des tâches', 'Soft skills'),
('Travail d''équipe', 'Capacité à collaborer efficacement avec d''autres personnes', 'Soft skills'),
('Cuisine', 'Préparation de repas et connaissance des techniques culinaires', 'Pratique'),
('Jardinage', 'Entretien de jardins et connaissance des plantes', 'Pratique'),
('Informatique', 'Utilisation d''outils informatiques et numériques', 'Technique'),
('Premiers secours', 'Connaissances de base en premiers secours', 'Santé'),
('Accompagnement de personnes', 'Capacité à accompagner des personnes vulnérables', 'Social'),
('Enseignement', 'Capacité à transmettre des connaissances', 'Éducation'),
('Bricolage', 'Réparations et travaux manuels', 'Pratique'),
('Photographie', 'Prise de vue et retouche photo', 'Artistique'),
('Rédaction', 'Rédaction de contenus et articles', 'Communication'),
('Langues étrangères', 'Maîtrise de langues étrangères', 'Communication'),
('Animation', 'Animation de groupes et d''activités', 'Social'),
('Logistique', 'Organisation et gestion de ressources matérielles', 'Pratique');

-- Insertion des badges
INSERT INTO badges (name, description, image_url, requirements) VALUES
('Première mission', 'A complété sa première mission de bénévolat', '/badges/premiere_mission.png', 'Compléter une mission'),
('Héros du quotidien', 'A complété 10 missions de bénévolat', '/badges/heros_quotidien.png', 'Compléter 10 missions'),
('Expert en communication', 'A excellé dans des missions de communication', '/badges/expert_communication.png', 'Obtenir 5 validations en communication'),
('Bénévole engagé', 'A participé régulièrement à des missions pendant 3 mois', '/badges/benevole_engage.png', 'Participer à au moins une mission par mois pendant 3 mois'),
('Polyvalent', 'A complété des missions dans 5 domaines différents', '/badges/polyvalent.png', 'Compléter des missions dans 5 catégories différentes'),
('Mentor', 'A aidé d''autres bénévoles à s''intégrer', '/badges/mentor.png', 'Accompagner 3 nouveaux bénévoles'),
('Fidèle', 'Membre actif depuis plus d''un an', '/badges/fidele.png', 'Être inscrit et actif depuis plus d''un an'),
('Impact social', 'A contribué à des missions à fort impact social', '/badges/impact_social.png', 'Participer à 5 missions d''aide aux personnes vulnérables'),
('Écocitoyen', 'Engagé pour l''environnement', '/badges/ecocitoyen.png', 'Participer à 5 missions environnementales'),
('Coup de main', 'Toujours prêt à aider en cas d''urgence', '/badges/coup_de_main.png', 'Répondre présent à 3 missions urgentes');

-- Insertion d'utilisateurs (bénévoles et associations)
INSERT INTO users (id, email, encrypted_password, first_name, last_name, bio, profile_picture_url, phone, city, postal_code, address, latitude, longitude, is_organization, last_login) VALUES
-- Bénévoles
('11111111-1111-1111-1111-111111111111', 'marie.dupont@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Marie', 'Dupont', 'Infirmière passionnée par l''aide aux autres', '/profiles/marie.jpg', '0601020304', 'Paris', '75011', '15 rue de la République, 75011 Paris', 48.8566, 2.3522, false, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'thomas.martin@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Thomas', 'Martin', 'Étudiant en informatique, disponible les week-ends', '/profiles/thomas.jpg', '0602030405', 'Lyon', '69003', '8 avenue Berthelot, 69003 Lyon', 45.7640, 4.8357, false, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('33333333-3333-3333-3333-333333333333', 'julie.petit@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Julie', 'Petit', 'Étudiante en marketing, je souhaite mettre mes compétences au service des associations', '/profiles/julie.jpg', '0603040506', 'Bordeaux', '33000', '25 cours Victor Hugo, 33000 Bordeaux', 44.8378, -0.5792, false, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('44444444-4444-4444-4444-444444444444', 'lucas.bernard@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Lucas', 'Bernard', 'Retraité actif, ancien professeur de mathématiques', '/profiles/lucas.jpg', '0604050607', 'Marseille', '13006', '12 rue Paradis, 13006 Marseille', 43.2965, 5.3698, false, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('55555555-5555-5555-5555-555555555555', 'emma.moreau@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Emma', 'Moreau', 'Graphiste freelance, disponible pour des missions créatives', '/profiles/emma.jpg', '0605060708', 'Lille', '59000', '45 rue Nationale, 59000 Lille', 50.6292, 3.0573, false, CURRENT_TIMESTAMP - INTERVAL '12 hours'),

-- Associations
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'contact@restosducoeur.org', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Restos', 'du Cœur', 'Association d''aide alimentaire et d''insertion', '/profiles/restos.jpg', '0101020304', 'Paris', '75008', '42 rue de Clichy, 75008 Paris', 48.8800, 2.3278, true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'contact@environnementvert.org', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Environnement', 'Vert', 'Association de protection de l''environnement', '/profiles/environnement.jpg', '0102030405', 'Lyon', '69007', '15 rue de Gerland, 69007 Lyon', 45.7320, 4.8320, true, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'contact@aideeducative.org', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Aide', 'Éducative', 'Soutien scolaire pour les enfants défavorisés', '/profiles/education.jpg', '0103040506', 'Bordeaux', '33800', '8 rue des Écoles, 33800 Bordeaux', 44.8250, -0.5700, true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'contact@solidarite-seniors.org', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Solidarité', 'Seniors', 'Accompagnement des personnes âgées isolées', '/profiles/seniors.jpg', '0104050607', 'Marseille', '13008', '25 avenue du Prado, 13008 Marseille', 43.2715, 5.3800, true, CURRENT_TIMESTAMP - INTERVAL '5 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'contact@animaux-protection.org', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Protection', 'Animaux', 'Refuge et protection des animaux abandonnés', '/profiles/animaux.jpg', '0105060708', 'Lille', '59160', '10 rue des Animaux, 59160 Lille', 50.6500, 3.0800, true, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Insertion des profils d'associations avec secteurs
INSERT INTO organization_profiles (id, user_id, organization_name, description, logo_url, website_url, address, latitude, longitude, sector_id, siret_number, creation_date) VALUES
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Les Restos du Cœur', 'Association d''aide alimentaire et d''insertion sociale fondée par Coluche en 1985', '/logos/restos.png', 'https://www.restosducoeur.org', '42 rue de Clichy, 75008 Paris', 48.8800, 2.3278, (SELECT id FROM organization_sectors WHERE name = 'Alimentation & Précarité'), '12345678901234', '1985-10-15'),
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Environnement Vert', 'Association dédiée à la protection de l''environnement et à la sensibilisation écologique', '/logos/environnement.png', 'https://www.environnementvert.org', '15 rue de Gerland, 69007 Lyon', 45.7320, 4.8320, (SELECT id FROM organization_sectors WHERE name = 'Environnement & Écologie'), '23456789012345', '2005-04-22'),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Aide Éducative', 'Association proposant du soutien scolaire aux enfants défavorisés', '/logos/education.png', 'https://www.aideeducative.org', '8 rue des Écoles, 33800 Bordeaux', 44.8250, -0.5700, (SELECT id FROM organization_sectors WHERE name = 'Enfance & Éducation'), '34567890123456', '2010-09-01'),
('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Solidarité Seniors', 'Association d''accompagnement des personnes âgées isolées', '/logos/seniors.png', 'https://www.solidarite-seniors.org', '25 avenue du Prado, 13008 Marseille', 43.2715, 5.3800, (SELECT id FROM organization_sectors WHERE name = 'Personnes âgées & isolées'), '45678901234567', '2008-06-15'),
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Protection Animaux', 'Association de protection et de défense des animaux', '/logos/animaux.png', 'https://www.animaux-protection.org', '10 rue des Animaux, 59160 Lille', 50.6500, 3.0800, (SELECT id FROM organization_sectors WHERE name = 'Animaux'), '56789012345678', '2012-03-30');

-- Insertion de missions avec types, formats, niveaux d'engagement et impacts
INSERT INTO missions (id, organization_id, mission_type_id, title, description, start_date, end_date, duration_minutes, format, location, latitude, longitude, available_spots, difficulty_level, engagement_level, desired_impact, status, image_url) VALUES
-- Missions des Restos du Cœur
('m1m1m1m1-m1m1-m1m1-m1m1-m1m1m1m1m1m1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', (SELECT id FROM mission_types WHERE name = 'Aide alimentaire'), 'Distribution de repas', 'Participer à la distribution de repas chauds aux personnes dans le besoin', CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '2 hours', 120, 'Présentiel', 'Centre de distribution Paris 11e', 48.8630, 2.3790, 5, 'débutant', 'Petit coup de main', 'Lutter contre l''exclusion', 'active', '/missions/distribution.jpg'),
('m2m2m2m2-m2m2-m2m2-m2m2-m2m2m2m2m2m2', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', (SELECT id FROM mission_types WHERE name = 'Logistique / manutention'), 'Tri des dons alimentaires', 'Aider au tri et au rangement des denrées alimentaires reçues', CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '1 hour', 60, 'Présentiel', 'Entrepôt Paris 18e', 48.8920, 2.3500, 3, 'débutant', 'Petit coup de main', 'Agir pour une cause urgente', 'active', '/missions/tri.jpg'),
('m3m3m3m3-m3m3-m3m3-m3m3-m3m3m3m3m3m3', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', (SELECT id FROM mission_types WHERE name = 'Accompagnement humain'), 'Accueil et orientation', 'Accueillir les bénéficiaires et les orienter vers les services adaptés', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '3 hours', 180, 'Présentiel', 'Centre d''accueil Paris 13e', 48.8300, 2.3650, 2, 'intermédiaire', 'Mission avec suivi', 'Créer du lien humain', 'active', '/missions/accueil.jpg'),

-- Missions d'Environnement Vert
('m4m4m4m4-m4m4-m4m4-m4m4-m4m4m4m4m4m4', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', (SELECT id FROM mission_types WHERE name = 'Logistique / manutention'), 'Nettoyage des berges du Rhône', 'Participer au ramassage des déchets sur les berges du Rhône', CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '3 hours', 180, 'Présentiel', 'Berges du Rhône, Lyon', 45.7550, 4.8450, 10, 'débutant', 'Petit coup de main', 'Protéger l''environnement', 'active', '/missions/nettoyage.jpg'),
('m5m5m5m5-m5m5-m5m5-m5m5-m5m5m5m5m5m5', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', (SELECT id FROM mission_types WHERE name = 'Sensibilisation / prévention'), 'Atelier de sensibilisation écologique', 'Animer un atelier de sensibilisation à l''écologie pour des enfants', CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP + INTERVAL '7 days' + INTERVAL '2 hours', 120, 'Présentiel', 'École primaire Lyon 7e', 45.7320, 4.8320, 2, 'intermédiaire', 'Mission avec suivi', 'Éduquer et sensibiliser', 'active', '/missions/atelier.jpg'),
('m6m6m6m6-m6m6-m6m6-m6m6-m6m6m6m6m6m6', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', (SELECT id FROM mission_types WHERE name = 'Logistique / manutention'), 'Plantation d''arbres', 'Participer à une opération de reboisement urbain', CURRENT_TIMESTAMP + INTERVAL '10 days', CURRENT_TIMESTAMP + INTERVAL '10 days' + INTERVAL '4 hours', 240, 'Présentiel', 'Parc de la Tête d''Or, Lyon', 45.7770, 4.8520, 8, 'débutant', 'Projet long', 'Protéger l''environnement', 'active', '/missions/plantation.jpg'),

-- Missions d'Aide Éducative
('m7m7m7m7-m7m7-m7m7-m7m7-m7m7m7m7m7m7', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', (SELECT id FROM mission_types WHERE name = 'Soutien scolaire / éducatif'), 'Aide aux devoirs', 'Accompagner des collégiens dans leurs devoirs', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '1 hour', 60, 'Présentiel', 'Collège Victor Hugo, Bordeaux', 44.8350, -0.5750, 5, 'intermédiaire', 'Mission avec suivi', 'Faire progresser l''égalité', 'active', '/missions/devoirs.jpg'),
('m8m8m8m8-m8m8-m8m8-m8m8-m8m8m8m8m8m8', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', (SELECT id FROM mission_types WHERE name = 'Soutien scolaire / éducatif'), 'Lecture pour enfants', 'Animer une séance de lecture pour des enfants de 6 à 8 ans', CURRENT_TIMESTAMP + INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '45 minutes', 45, 'Présentiel', 'Bibliothèque municipale, Bordeaux', 44.8400, -0.5700, 2, 'débutant', 'Petit coup de main', 'Créer du lien humain', 'active', '/missions/lecture.jpg'),
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', (SELECT id FROM mission_types WHERE name = 'Numérique / informatique'), 'Atelier d''initiation à l''informatique', 'Initier des jeunes aux bases de la programmation', CURRENT_TIMESTAMP + INTERVAL '6 days', CURRENT_TIMESTAMP + INTERVAL '6 days' + INTERVAL '2 hours', 120, 'À distance', NULL, NULL, NULL, 3, 'expert', 'Mission avec suivi', 'Faire progresser l''égalité', 'active', '/missions/informatique.jpg'),

-- Missions de Solidarité Seniors
('m10m10m10-m10m-m10m-m10m-m10m10m10m10', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', (SELECT id FROM mission_types WHERE name = 'Accompagnement humain'), 'Visite à domicile', 'Rendre visite à une personne âgée isolée pour un moment de convivialité', CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '1 hour', 60, 'Présentiel', 'Quartier du Prado, Marseille', 43.2715, 5.3800, 1, 'débutant', 'Petit coup de main', 'Créer du lien humain', 'active', '/missions/visite.jpg'),
('m11m11m11-m11m-m11m-m11m-m11m11m11m11', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', (SELECT id FROM mission_types WHERE name = 'Accompagnement humain'), 'Aide aux courses', 'Accompagner une personne âgée pour faire ses courses', CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '2 hours', 120, 'Présentiel', 'Quartier Vieux-Port, Marseille', 43.2950, 5.3650, 1, 'débutant', 'Petit coup de main', 'Lutter contre l''exclusion', 'active', '/missions/courses.jpg'),
('m12m12m12-m12m-m12m-m12m-m12m12m12m12', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', (SELECT id FROM mission_types WHERE name = 'Animation'), 'Animation d''atelier mémoire', 'Animer un atelier pour stimuler la mémoire des seniors', CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '5 days' + INTERVAL '1 hour 30 minutes', 90, 'Présentiel', 'Maison de retraite Les Oliviers, Marseille', 43.2800, 5.3900, 2, 'intermédiaire', 'Mission avec suivi', 'Créer du lien humain', 'active', '/missions/memoire.jpg'),

-- Missions de Protection Animaux
('m13m13m13-m13m-m13m-m13m-m13m13m13m13', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', (SELECT id FROM mission_types WHERE name = 'Accompagnement humain'), 'Promenade de chiens', 'Promener les chiens du refuge', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '1 hour', 60, 'Présentiel', 'Refuge animalier, Lille', 50.6500, 3.0800, 4, 'débutant', 'Petit coup de main', 'Sauver des vies / protéger', 'active', '/missions/promenade.jpg'),
('m14m14m14-m14m-m14m-m14m-m14m14m14m14', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', (SELECT id FROM mission_types WHERE name = 'Logistique / manutention'), 'Nettoyage des enclos', 'Aider au nettoyage et à l''entretien des enclos des animaux', CURRENT_TIMESTAMP + INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '2 hours', 120, 'Présentiel', 'Refuge animalier, Lille', 50.6500, 3.0800, 3, 'intermédiaire', 'Petit coup de main', 'Sauver des vies / protéger', 'active', '/missions/enclos.jpg'),
('m15m15m15-m15m-m15m-m15m-m15m15m15m15', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', (SELECT id FROM mission_types WHERE name = 'Événementiel'), 'Stand d''information', 'Tenir un stand d''information sur la protection animale', CURRENT_TIMESTAMP + INTERVAL '6 days', CURRENT_TIMESTAMP + INTERVAL '6 days' + INTERVAL '3 hours', 180, 'Présentiel', 'Centre commercial Euralille, Lille', 50.6370, 3.0700, 2, 'intermédiaire', 'Mission avec suivi', 'Éduquer et sensibiliser', 'active', '/missions/stand.jpg'),
('m16m16m16-m16m-m16m-m16m-m16m16m16m16', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', (SELECT id FROM mission_types WHERE name = 'Communication / graphisme'), 'Création de visuels pour réseaux sociaux', 'Créer des visuels attractifs pour la campagne de Noël des Restos du Coeur', CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '15 days', 15, 'À distance', NULL, NULL, NULL, 1, 'intermédiaire', 'Ultra-rapide', 'Agir pour une cause urgente', 'active', '/missions/visuels.jpg');

-- Insertion des compétences requises pour les missions
INSERT INTO mission_skills (mission_id, skill_id, is_required) VALUES
-- Compétences pour les missions des Restos du Cœur
('m1m1m1m1-m1m1-m1m1-m1m1-m1m1m1m1m1m1', (SELECT id FROM skills WHERE name = 'Travail d''équipe'), true),
('m1m1m1m1-m1m1-m1m1-m1m1-m1m1m1m1m1m1', (SELECT id FROM skills WHERE name = 'Communication'), false),
('m2m2m2m2-m2m2-m2m2-m2m2-m2m2m2m2m2m2', (SELECT id FROM skills WHERE name = 'Organisation'), true),
('m3m3m3m3-m3m3-m3m3-m3m3-m3m3m3m3m3m3', (SELECT id FROM skills WHERE name = 'Communication'), true),
('m3m3m3m3-m3m3-m3m3-m3m3-m3m3m3m3m3m3', (SELECT id FROM skills WHERE name = 'Accompagnement de personnes'), true),
('m16m16m16-m16m-m16m-m16m-m16m16m16m16', (SELECT id FROM skills WHERE name = 'Photographie'), true),
('m16m16m16-m16m-m16m-m16m-m16m16m16m16', (SELECT id FROM skills WHERE name = 'Communication'), false),

-- Compétences pour les missions d'Environnement Vert
('m4m4m4m4-m4m4-m4m4-m4m4-m4m4m4m4m4m4', (SELECT id FROM skills WHERE name = 'Travail d''équipe'), true),
('m5m5m5m5-m5m5-m5m5-m5m5-m5m5m5m5m5m5', (SELECT id FROM skills WHERE name = 'Communication'), true),
('m5m5m5m5-m5m5-m5m5-m5m5-m5m5m5m5m5m5', (SELECT id FROM skills WHERE name = 'Enseignement'), true),
('m6m6m6m6-m6m6-m6m6-m6m6-m6m6m6m6m6m6', (SELECT id FROM skills WHERE name = 'Jardinage'), false),
('m6m6m6m6-m6m6-m6m6-m6m6-m6m6m6m6m6m6', (SELECT id FROM skills WHERE name = 'Travail d''équipe'), true),

-- Compétences pour les missions d'Aide Éducative
('m7m7m7m7-m7m7-m7m7-m7m7-m7m7m7m7m7m7', (SELECT id FROM skills WHERE name = 'Enseignement'), true),
('m7m7m7m7-m7m7-m7m7-m7m7-m7m7m7m7m7m7', (SELECT id FROM skills WHERE name = 'Communication'), false),
('m8m8m8m8-m8m8-m8m8-m8m8-m8m8m8m8m8m8', (SELECT id FROM skills WHERE name = 'Communication'), true),
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', (SELECT id FROM skills WHERE name = 'Informatique'), true),
('m9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9', (SELECT id FROM skills WHERE name = 'Enseignement'), true),

-- Compétences pour les missions de Solidarité Seniors
('m10m10m10-m10m-m10m-m10m-m10m10m10m10', (SELECT id FROM skills WHERE name = 'Communication'), true),
('m10m10m10-m10m-m10m-m10m-m10m10m10m10', (SELECT id FROM skills WHERE name = 'Accompagnement de personnes'), true),
('m11m11m11-m11m-m11m-m11m-m11m11m11m11', (SELECT id FROM skills WHERE name = 'Accompagnement de personnes'), true),
('m12m12m12-m12m-m12m-m12m-m12m12m12m12', (SELECT id FROM skills WHERE name = 'Animation'), true),
('m12m12m12-m12m-m12m-m12m-m12m12m12m12', (SELECT id FROM skills WHERE name = 'Communication'), false),

-- Compétences pour les missions de Protection Animaux
('m13m13m13-m13m-m13m-m13m-m13m13m13m13', (SELECT id FROM skills WHERE name = 'Travail d''équipe'), false),
('m14m14m14-m14m-m14m-m14m-m14m14m14m14', (SELECT id FROM skills WHERE name = 'Travail d''équipe'), false),
('m15m15m15-m15m-m15m-m15m-m15m15m15m15', (SELECT id FROM skills WHERE name = 'Communication'), true);

-- Insertion des inscriptions aux missions
INSERT INTO mission_registrations (user_id, mission_id, status, registration_date, confirmation_date) VALUES
-- Marie s'est inscrite à plusieurs missions
('11111111-1111-1111-1111-111111111111', 'm1m1m1m1-m1m1-m1m1-m1m1-m1m1m1m1m1m1', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('11111111-1111-1111-1111-111111111111', 'm10m10m10-m10m-m10m-m10m-m10m10m10m10', 'inscrit', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),

-- Thomas s'est inscrit à des missions environnementales
('22222222-2222-2222-2222-222222222222', 'm4m4m4m4-m4m4-m4m4-m4m4-m4m4m4m4m4m4', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '6 days'),
('22222222-2222-2222-2222-222222222222', 'm6m6m6m6-m6m6-m6m6-m6m6-m6m6m6m6m6m6', 'inscrit', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),

-- Julie s'est inscrite à des missions éducatives
('33333333-3333-3333-3333-333333333333', 'm7m7m7m7-m7m7-m7m7-m7m7-m7m7m7m7m7m7', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days'),
('33333333-3333-3333-3333-333333333333', 'm8m8m8m8-m8m8-m8m8-m8m8-m8m8m8m8m8m8', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('33333333-3333-3333-3333-333333333333', 'm15m15m15-m15m-m15m-m15m-m15m15m15m15', 'inscrit', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),

-- Lucas s'est inscrit à des missions pour seniors
('44444444-4444-4444-4444-444444444444', 'm10m10m10-m10m-m10m-m10m-m10m10m10m10', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
('44444444-4444-4444-4444-444444444444', 'm11m11m11-m11m-m11m-m11m-m11m11m11m11', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('44444444-4444-4444-4444-444444444444', 'm12m12m12-m12m-m12m-m12m-m12m12m12m12', 'inscrit', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),

-- Emma s'est inscrite à des missions diverses
('55555555-5555-5555-5555-555555555555', 'm2m2m2m2-m2m2-m2m2-m2m2-m2m2m2m2m2m2', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('55555555-5555-5555-5555-555555555555', 'm13m13m13-m13m-m13m-m13m-m13m13m13m13', 'confirmé', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('55555555-5555-5555-5555-555555555555', 'm5m5m5m5-m5m5-m5m5-m5m5-m5m5m5m5m5m5', 'inscrit', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),
('55555555-5555-5555-5555-555555555555', 'm16m16m16-m16m-m16m-m16m-m16m16m16m16', 'inscrit', CURRENT_TIMESTAMP - INTERVAL '1 hour', NULL);

-- Insertion des compétences validées pour les utilisateurs
INSERT INTO user_skills (user_id, skill_id, level, validation_date, validator_id) VALUES
-- Compétences de Marie
('11111111-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', CURRENT_TIMESTAMP - INTERVAL '30 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Accompagnement de personnes'), 'expert', CURRENT_TIMESTAMP - INTERVAL '60 days', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Premiers secours'), 'expert', CURRENT_TIMESTAMP - INTERVAL '90 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

-- Compétences de Thomas
('22222222-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Informatique'), 'expert', CURRENT_TIMESTAMP - INTERVAL '45 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Travail d''équipe'), 'intermédiaire', CURRENT_TIMESTAMP - INTERVAL '60 days', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Jardinage'), 'débutant', CURRENT_TIMESTAMP - INTERVAL '30 days', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),

-- Compétences de Julie
('33333333-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', CURRENT_TIMESTAMP - INTERVAL '40 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Enseignement'), 'intermédiaire', CURRENT_TIMESTAMP - INTERVAL '70 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Rédaction'), 'expert', CURRENT_TIMESTAMP - INTERVAL '100 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

-- Compétences de Lucas
('44444444-4444-4444-4444-444444444444', (SELECT id FROM skills WHERE name = 'Enseignement'), 'expert', CURRENT_TIMESTAMP - INTERVAL '120 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM skills WHERE name = 'Accompagnement de personnes'), 'avancé', CURRENT_TIMESTAMP - INTERVAL '80 days', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', CURRENT_TIMESTAMP - INTERVAL '90 days', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),

-- Compétences d'Emma
('55555555-5555-5555-5555-555555555555', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', CURRENT_TIMESTAMP - INTERVAL '50 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM skills WHERE name = 'Organisation'), 'intermédiaire', CURRENT_TIMESTAMP - INTERVAL '70 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM skills WHERE name = 'Photographie'), 'expert', CURRENT_TIMESTAMP - INTERVAL '100 days', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');

-- Insertion des badges obtenus par les utilisateurs
INSERT INTO user_badges (user_id, badge_id, acquisition_date) VALUES
-- Badges de Marie
('11111111-1111-1111-1111-111111111111', (SELECT id FROM badges WHERE name = 'Première mission'), CURRENT_TIMESTAMP - INTERVAL '60 days'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM badges WHERE name = 'Bénévole engagé'), CURRENT_TIMESTAMP - INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM badges WHERE name = 'Impact social'), CURRENT_TIMESTAMP - INTERVAL '15 days'),

-- Badges de Thomas
('22222222-2222-2222-2222-222222222222', (SELECT id FROM badges WHERE name = 'Première mission'), CURRENT_TIMESTAMP - INTERVAL '70 days'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM badges WHERE name = 'Écocitoyen'), CURRENT_TIMESTAMP - INTERVAL '40 days'),

-- Badges de Julie
('33333333-3333-3333-3333-333333333333', (SELECT id FROM badges WHERE name = 'Première mission'), CURRENT_TIMESTAMP - INTERVAL '100 days'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM badges WHERE name = 'Expert en communication'), CURRENT_TIMESTAMP - INTERVAL '50 days'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM badges WHERE name = 'Polyvalent'), CURRENT_TIMESTAMP - INTERVAL '20 days'),

-- Badges de Lucas
('44444444-4444-4444-4444-444444444444', (SELECT id FROM badges WHERE name = 'Première mission'), CURRENT_TIMESTAMP - INTERVAL '120 days'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM badges WHERE name = 'Bénévole engagé'), CURRENT_TIMESTAMP - INTERVAL '90 days'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM badges WHERE name = 'Mentor'), CURRENT_TIMESTAMP - INTERVAL '60 days'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM badges WHERE name = 'Fidèle'), CURRENT_TIMESTAMP - INTERVAL '30 days'),

-- Badges d'Emma
('55555555-5555-5555-5555-555555555555', (SELECT id FROM badges WHERE name = 'Première mission'), CURRENT_TIMESTAMP - INTERVAL '80 days'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM badges WHERE name = 'Polyvalent'), CURRENT_TIMESTAMP - INTERVAL '40 days'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM badges WHERE name = 'Coup de main'), CURRENT_TIMESTAMP - INTERVAL '20 days');

-- Insertion des témoignages
INSERT INTO testimonials (user_id, content, created_at, is_visible, job_title) VALUES
('11111111-1111-1111-1111-111111111111', 'MicroBénévole m''a permis d''intégrer le bénévolat dans mon quotidien chargé. Je peux aider quand j''ai un moment, sans culpabiliser les jours où je ne suis pas disponible.', CURRENT_TIMESTAMP - INTERVAL '45 days', true, 'Infirmière'),
('22222222-2222-2222-2222-222222222222', 'Grâce à cette plateforme, j''ai pu découvrir des associations près de chez moi dont j''ignorais l''existence. Les missions courtes sont parfaites pour mon emploi du temps d''étudiant.', CURRENT_TIMESTAMP - INTERVAL '30 days', true, 'Étudiant en informatique'),
('33333333-3333-3333-3333-333333333333', 'J''ai pu valider des compétences réelles en communication tout en aidant une cause qui me tient à cœur. Les badges obtenus valorisent mon profil professionnel de façon concrète.', CURRENT_TIMESTAMP - INTERVAL '60 days', true, 'Étudiante en marketing'),
('44444444-4444-4444-4444-444444444444', 'À la retraite, je cherchais un moyen de rester actif et utile. MicroBénévole m''a permis de trouver des missions adaptées à mon rythme et de rencontrer des personnes formidables.', CURRENT_TIMESTAMP - INTERVAL '90 days', true, 'Retraité, Ancien professeur'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Grâce à cette plateforme, notre association a pu trouver des volontaires pour des tâches ponctuelles que nous n''aurions pas pu réaliser seuls. Un vrai gain de temps et d''efficacité !', CURRENT_TIMESTAMP - INTERVAL '75 days', true, 'Responsable, Les Restos du Cœur'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'L''application est intuitive et nous permet de poster rapidement nos besoins. En quelques minutes, nous avons souvent plusieurs volontaires qui se manifestent. Impressionnant !', CURRENT_TIMESTAMP - INTERVAL '50 days', true, 'Directeur, Association Protection Animaux');

-- Insertion des notifications
INSERT INTO notifications (user_id, title, content, is_read, created_at, link_url) VALUES
-- Notifications pour Marie
('11111111-1111-1111-1111-111111111111', 'Confirmation de mission', 'Votre participation à la mission "Distribution de repas" a été confirmée.', true, CURRENT_TIMESTAMP - INTERVAL '4 days', '/missions/m1m1m1m1-m1m1-m1m1-m1m1-m1m1m1m1m1m1'),
('11111111-1111-1111-1111-111111111111', 'Nouvelle mission près de chez vous', 'Une nouvelle mission "Visite à domicile" est disponible à 1,5 km de chez vous.', false, CURRENT_TIMESTAMP - INTERVAL '2 days', '/missions/m10m10m10-m10m-m10m-m10m-m10m10m10m10'),
('11111111-1111-1111-1111-111111111111', 'Badge obtenu', 'Félicitations ! Vous avez obtenu le badge "Impact social".', true, CURRENT_TIMESTAMP - INTERVAL '15 days', '/profile/badges'),

-- Notifications pour Thomas
('22222222-2222-2222-2222-222222222222', 'Confirmation de mission', 'Votre participation à la mission "Nettoyage des berges du Rhône" a été confirmée.', true, CURRENT_TIMESTAMP - INTERVAL '6 days', '/missions/m4m4m4m4-m4m4-m4m4-m4m4-m4m4m4m4m4m4'),
('22222222-2222-2222-2222-222222222222', 'Nouvelle compétence validée', 'Votre compétence "Jardinage" a été validée par Environnement Vert.', false, CURRENT_TIMESTAMP - INTERVAL '30 days', '/profile/skills'),

-- Notifications pour Julie
('33333333-3333-3333-3333-333333333333', 'Confirmation de mission', 'Votre participation à la mission "Aide aux devoirs" a été confirmée.', true, CURRENT_TIMESTAMP - INTERVAL '9 days', '/missions/m7m7m7m7-m7m7-m7m7-m7m7-m7m7m7m7m7m7'),
('33333333-3333-3333-3333-333333333333', 'Confirmation de mission', 'Votre participation à la mission "Lecture pour enfants" a été confirmée.', true, CURRENT_TIMESTAMP - INTERVAL '4 days', '/missions/m8m8m8m8-m8m8-m8m8-m8m8-m8m8m8m8m8m8'),
('33333333-3333-3333-3333-333333333333', 'Badge obtenu', 'Félicitations ! Vous avez obtenu le badge "Polyvalent".', false, CURRENT_TIMESTAMP - INTERVAL '20 days', '/profile/badges'),

-- Notifications pour les associations
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nouvelle inscription', 'Marie Dupont s''est inscrite à votre mission "Distribution de repas".', true, CURRENT_TIMESTAMP - INTERVAL '5 days', '/missions/m1m1m1m1-m1m1-m1m1-m1m1-m1m1m1m1m1m1/registrations'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Nouvelle inscription', 'Thomas Martin s''est inscrit à votre mission "Nettoyage des berges du Rhône".', true, CURRENT_TIMESTAMP - INTERVAL '7 days', '/missions/m4m4m4m4-m4m4-m4m4-m4m4-m4m4m4m4m4m4/registrations'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Nouvelle inscription', 'Julie Petit s''est inscrite à votre mission "Aide aux devoirs".', true, CURRENT_TIMESTAMP - INTERVAL '10 days', '/missions/m7m7m7m7-m7m7-m7m7-m7m7-m7m7m7m7m7m7/registrations');

-- Commentaires sur l'utilisation avec Supabase
/*
Pour utiliser ce script avec Supabase:

1. Connectez-vous à votre projet Supabase
2. Allez dans l'éditeur SQL
3. Copiez et collez ce script
4. Exécutez le script

Notes importantes:
- Ce script inclut l'extension PostGIS pour la géolocalisation
- Toutes les politiques RLS (Row Level Security) sont configurées
- Des données de test complètes sont incluses
- La localisation des utilisateurs est prise en charge
- Les catégories d'associations et de missions sont intégrées
- Les formats de missions (Présentiel, À distance) sont gérés
- Des fonctions pour trouver des missions à proximité sont implémentées

Pour tester la fonctionnalité de localisation:
- Utilisez la fonction nearby_missions(user_uuid, max_distance_km) pour trouver les missions proches d'un utilisateur
  Exemple: SELECT * FROM nearby_missions('11111111-1111-1111-1111-111111111111', 5);

Pour l'authentification:
- Utilisez les fonctionnalités intégrées de Supabase Auth
- Configurez les webhooks pour synchroniser les utilisateurs Supabase Auth avec la table users
*/

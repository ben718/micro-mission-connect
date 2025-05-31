
-- Seeds de données de production pour MicroBénévole
-- À exécuter après la création des tables

-- Insertion des secteurs d'activité
INSERT INTO organization_sectors (id, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Éducation', 'Organisations éducatives et formation'),
('550e8400-e29b-41d4-a716-446655440002', 'Santé', 'Secteur médical et sanitaire'),
('550e8400-e29b-41d4-a716-446655440003', 'Environnement', 'Protection de l''environnement et développement durable'),
('550e8400-e29b-41d4-a716-446655440004', 'Social', 'Action sociale et solidarité'),
('550e8400-e29b-41d4-a716-446655440005', 'Culture', 'Arts, culture et patrimoine'),
('550e8400-e29b-41d4-a716-446655440006', 'Sport', 'Activités sportives et bien-être'),
('550e8400-e29b-41d4-a716-446655440007', 'Technologie', 'Innovation technologique et numérique'),
('550e8400-e29b-41d4-a716-446655440008', 'Humanitaire', 'Aide humanitaire et urgence')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- Insertion des types de missions
INSERT INTO mission_types (id, name, description) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Distribution alimentaire', 'Aide à la distribution de repas et colis alimentaires'),
('660e8400-e29b-41d4-a716-446655440002', 'Soutien scolaire', 'Accompagnement éducatif et aide aux devoirs'),
('660e8400-e29b-41d4-a716-446655440003', 'Nettoyage environnemental', 'Opérations de nettoyage et préservation de l''environnement'),
('660e8400-e29b-41d4-a716-446655440004', 'Accompagnement seniors', 'Visite et aide aux personnes âgées'),
('660e8400-e29b-41d4-a716-446655440005', 'Animation événements', 'Organisation et animation d''événements culturels'),
('660e8400-e29b-41d4-a716-446655440006', 'Support informatique', 'Aide technique et formation numérique'),
('660e8400-e29b-41d4-a716-446655440007', 'Collecte de dons', 'Organisation de collectes et campagnes de dons'),
('660e8400-e29b-41d4-a716-446655440008', 'Encadrement sportif', 'Animation d''activités sportives et de loisirs')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- Insertion des compétences de base
INSERT INTO skills (id, name, description, category) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Communication', 'Compétences en communication orale et écrite', 'soft_skills'),
('770e8400-e29b-41d4-a716-446655440002', 'Organisation', 'Capacité d''organisation et de planification', 'soft_skills'),
('770e8400-e29b-41d4-a716-446655440003', 'Informatique', 'Maîtrise des outils informatiques de base', 'technical'),
('770e8400-e29b-41d4-a716-446655440004', 'Langues étrangères', 'Compétences linguistiques', 'language'),
('770e8400-e29b-41d4-a716-446655440005', 'Premiers secours', 'Formation aux gestes de premiers secours', 'safety'),
('770e8400-e29b-41d4-a716-446655440006', 'Animation', 'Compétences en animation de groupes', 'social'),
('770e8400-e29b-41d4-a716-446655440007', 'Cuisine', 'Compétences culinaires et préparation de repas', 'practical'),
('770e8400-e29b-41d4-a716-446655440008', 'Conduite', 'Permis de conduire et véhicule disponible', 'practical'),
('770e8400-e29b-41d4-a716-446655440009', 'Photographie', 'Compétences en photographie et vidéo', 'creative'),
('770e8400-e29b-41d4-a716-446655440010', 'Comptabilité', 'Notions de comptabilité et gestion', 'administrative')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, category = EXCLUDED.category;

-- Insertion des badges de reconnaissance
INSERT INTO badges (id, name, description, image_url, requirements) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Première mission', 'Félicitations pour votre première mission !', '/badges/first-mission.svg', 'Compléter sa première mission'),
('880e8400-e29b-41d4-a716-446655440002', 'Bénévole actif', '5 missions accomplies avec succès', '/badges/active-volunteer.svg', 'Compléter 5 missions'),
('880e8400-e29b-41d4-a716-446655440003', 'Pilier de la communauté', '20 missions accomplies', '/badges/community-pillar.svg', 'Compléter 20 missions'),
('880e8400-e29b-41d4-a716-446655440004', 'Spécialiste social', 'Expert dans le domaine social', '/badges/social-expert.svg', 'Compléter 10 missions sociales'),
('880e8400-e29b-41d4-a716-446655440005', 'Défenseur de l''environnement', 'Engagement pour l''environnement', '/badges/eco-warrior.svg', 'Compléter 5 missions environnementales'),
('880e8400-e29b-41d4-a716-446655440006', 'Mentor éducatif', 'Excellence dans l''accompagnement éducatif', '/badges/education-mentor.svg', 'Compléter 10 missions éducatives'),
('880e8400-e29b-41d4-a716-446655440007', 'Innovateur', 'Contribution exceptionnelle à l''innovation', '/badges/innovator.svg', 'Proposer une amélioration adoptée'),
('880e8400-e29b-41d4-a716-446655440008', 'Ambassadeur', 'Rayonnement exceptionnel de la plateforme', '/badges/ambassador.svg', 'Parrainer 5 nouveaux bénévoles')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, image_url = EXCLUDED.image_url, requirements = EXCLUDED.requirements;

-- Insertion des villes principales de France
INSERT INTO cities (id, name, postal_code, department, region) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Paris', '75000', 'Paris', 'Île-de-France'),
('990e8400-e29b-41d4-a716-446655440002', 'Marseille', '13000', 'Bouches-du-Rhône', 'Provence-Alpes-Côte d''Azur'),
('990e8400-e29b-41d4-a716-446655440003', 'Lyon', '69000', 'Rhône', 'Auvergne-Rhône-Alpes'),
('990e8400-e29b-41d4-a716-446655440004', 'Toulouse', '31000', 'Haute-Garonne', 'Occitanie'),
('990e8400-e29b-41d4-a716-446655440005', 'Nice', '06000', 'Alpes-Maritimes', 'Provence-Alpes-Côte d''Azur'),
('990e8400-e29b-41d4-a716-446655440006', 'Nantes', '44000', 'Loire-Atlantique', 'Pays de la Loire'),
('990e8400-e29b-41d4-a716-446655440007', 'Strasbourg', '67000', 'Bas-Rhin', 'Grand Est'),
('990e8400-e29b-41d4-a716-446655440008', 'Montpellier', '34000', 'Hérault', 'Occitanie'),
('990e8400-e29b-41d4-a716-446655440009', 'Bordeaux', '33000', 'Gironde', 'Nouvelle-Aquitaine'),
('990e8400-e29b-41d4-a716-446655440010', 'Lille', '59000', 'Nord', 'Hauts-de-France')
ON CONFLICT (name, postal_code) DO NOTHING;

-- Création des index de performance
CREATE INDEX IF NOT EXISTS idx_missions_location ON missions USING GIN (to_tsvector('french', location));
CREATE INDEX IF NOT EXISTS idx_missions_status_date ON missions (status, start_date);
CREATE INDEX IF NOT EXISTS idx_missions_organization ON missions (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_registrations_user_status ON mission_registrations (user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles (city, postal_code);

-- Ajout des contraintes de performance (seulement si elles n'existent pas)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_positive_duration') THEN
        ALTER TABLE missions ADD CONSTRAINT check_positive_duration CHECK (duration_minutes > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_positive_spots') THEN
        ALTER TABLE missions ADD CONSTRAINT check_positive_spots CHECK (available_spots > 0);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_future_date') THEN
        ALTER TABLE missions ADD CONSTRAINT check_future_date CHECK (start_date > created_at);
    END IF;
END $$;


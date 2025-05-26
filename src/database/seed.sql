-- Insertion des associations de test
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'a444bae9-3193-465c-853b-9528abe1023e') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role) VALUES
        ('a444bae9-3193-465c-853b-9528abe1023e', 'rioall77@gmail.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Alpha","last_name":"Assos"}', false, 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = 'ea44982b-ba08-45cd-b051-255541c38bff') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role) VALUES
        ('ea44982b-ba08-45cd-b051-255541c38bff', 'benmvouama@gmail.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Ben","last_name":"Mvouama"}', false, 'authenticated');
    END IF;
END $$;

-- Insertion des profils des associations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM organization_profiles WHERE id = 'a444bae9-3193-465c-853b-9528abe1023e') THEN
        INSERT INTO organization_profiles (
            id, 
            user_id, 
            organization_name, 
            description, 
            website_url, 
            sector_id,
            address,
            latitude,
            longitude,
            siret_number,
            creation_date
        ) VALUES (
            'a444bae9-3193-465c-853b-9528abe1023e',
            'a444bae9-3193-465c-853b-9528abe1023e',
            'Alpha Association',
            'Association pour le développement social et culturel',
            'https://alpha-assos.fr',
            'bbc8250a-0554-4f3e-abd2-c012ee3a8d39',
            '123 Rue de la Paix, 75001 Paris',
            48.8566,
            2.3522,
            '12345678901234',
            '2020-01-01'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM organization_profiles WHERE id = 'ea44982b-ba08-45cd-b051-255541c38bff') THEN
        INSERT INTO organization_profiles (
            id, 
            user_id, 
            organization_name, 
            description, 
            website_url, 
            sector_id,
            address,
            latitude,
            longitude,
            siret_number,
            creation_date
        ) VALUES (
            'ea44982b-ba08-45cd-b051-255541c38bff',
            'ea44982b-ba08-45cd-b051-255541c38bff',
            'Micro Mission Connect',
            'Plateforme de mise en relation entre associations et bénévoles',
            'https://micro-mission-connect.fr',
            '7b413d7a-961b-4b63-b047-f0021df9ef99',
            '456 Avenue des Champs-Élysées, 75008 Paris',
            48.8698,
            2.3079,
            '98765432109876',
            '2021-01-01'
        );
    END IF;
END $$;

-- Insertion des bénévoles de test
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '990e8400-e29b-41d4-a716-446655440000') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role) VALUES
        ('990e8400-e29b-41d4-a716-446655440000', 'jean.dupont@email.fr', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Jean","last_name":"Dupont","bio":"Passionné de sport et d''animation","city":"c1391df0-246f-4655-b642-16e4c7e0d8d2"}', false, 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '990e8400-e29b-41d4-a716-446655440001') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role) VALUES
        ('990e8400-e29b-41d4-a716-446655440001', 'marie.martin@email.fr', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Marie","last_name":"Martin","bio":"Éducatrice spécialisée avec 10 ans d''expérience","city":"ae2ab990-78c0-4acc-9180-fdef6c153b3d"}', false, 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '990e8400-e29b-41d4-a716-446655440002') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role) VALUES
        ('990e8400-e29b-41d4-a716-446655440002', 'pierre.durand@email.fr', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"first_name":"Pierre","last_name":"Durand","bio":"Ingénieur informatique, bénévole depuis 5 ans","city":"48d6924a-613d-4244-8ee9-52680129ea9a"}', false, 'authenticated');
    END IF;
END $$;

-- Insertion des compétences
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Animation de groupe') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('f5970a53-6ddc-4923-9725-86f23e5013ff', 'Animation de groupe', 'Capacité à animer et encadrer un groupe', 'Animation');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Premiers secours') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'Premiers secours', 'Connaissances en premiers secours et sécurité', 'Santé');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Éducation') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('745bca38-82c2-4029-aac2-4503f4a585a2', 'Éducation', 'Capacité à enseigner et transmettre des connaissances', 'Enseignement');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Rédaction') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('7884cbfc-73ae-4a13-b28b-3fbd62f0a8b8', 'Rédaction', 'Capacité à rédiger des textes clairs et structurés', 'Communication');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Médiation') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('f1744b3a-5604-4885-a92b-8b1fd84ee217', 'Médiation', 'Capacité à gérer les conflits et faciliter la communication', 'Social');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Gestion de projet') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('e1d6d061-fcff-487c-bb4e-4017b48efcd0', 'Gestion de projet', 'Capacité à organiser et coordonner des projets', 'Management');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM skills WHERE name = 'Design graphique') THEN
        INSERT INTO skills (id, name, description, category) VALUES
        ('791cabe6-9b4e-4ede-982b-92052821cb1a', 'Design graphique', 'Capacité à créer des supports visuels', 'Création');
    END IF;
END $$;

-- Insertion des profils utilisateurs
DO $$ 
BEGIN
    -- Jean Dupont
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = '990e8400-e29b-41d4-a716-446655440000') THEN
        INSERT INTO profiles (
            id,
            first_name,
            last_name,
            address,
            postal_code,
            city,
            latitude,
            longitude,
            profile_picture_url,
            last_login
        ) VALUES (
            '990e8400-e29b-41d4-a716-446655440000',
            'Jean',
            'Dupont',
            '15 Rue des Sports',
            '75001',
            'Paris',
            48.8566,
            2.3522,
            'https://example.com/profiles/jean.jpg',
            NOW()
        );
    END IF;

    -- Marie Martin
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = '990e8400-e29b-41d4-a716-446655440001') THEN
        INSERT INTO profiles (
            id,
            first_name,
            last_name,
            address,
            postal_code,
            city,
            latitude,
            longitude,
            profile_picture_url,
            last_login
        ) VALUES (
            '990e8400-e29b-41d4-a716-446655440001',
            'Marie',
            'Martin',
            '25 Avenue de la Musique',
            '75008',
            'Paris',
            48.8698,
            2.3079,
            'https://example.com/profiles/marie.jpg',
            NOW()
        );
    END IF;

    -- Pierre Durand
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = '990e8400-e29b-41d4-a716-446655440002') THEN
        INSERT INTO profiles (
            id,
            first_name,
            last_name,
            address,
            postal_code,
            city,
            latitude,
            longitude,
            profile_picture_url,
            last_login
        ) VALUES (
            '990e8400-e29b-41d4-a716-446655440002',
            'Pierre',
            'Durand',
            '8 Rue des Animaux',
            '75016',
            'Paris',
            48.8647,
            2.2750,
            'https://example.com/profiles/pierre.jpg',
            NOW()
        );
    END IF;
END $$;

-- Insertion des compétences des bénévoles
INSERT INTO user_skills (id, user_id, skill_id) VALUES
('990e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', '7884cbfc-73ae-4a13-b28b-3fbd62f0a8b8'), -- Jean Dupont - Rédaction
('990e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440000', 'f5970a53-6ddc-4923-9725-86f23e5013ff'), -- Jean Dupont - Animation de groupe
('990e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440000', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c'), -- Jean Dupont - Premiers secours
('990e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001', '7884cbfc-73ae-4a13-b28b-3fbd62f0a8b8'), -- Marie Martin - Rédaction
('990e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001', '745bca38-82c2-4029-aac2-4503f4a585a2'), -- Marie Martin - Éducation
('990e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440001', 'f1744b3a-5604-4885-a92b-8b1fd84ee217'), -- Marie Martin - Médiation
('990e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440002', '287b9e59-0b0f-4c14-86eb-465d5fb54931'), -- Pierre Durand - Développement web
('990e8400-e29b-41d4-a716-446655440007', '990e8400-e29b-41d4-a716-446655440002', 'e1d6d061-fcff-487c-bb4e-4017b48efcd0'), -- Pierre Durand - Gestion de projet
('990e8400-e29b-41d4-a716-446655440008', '990e8400-e29b-41d4-a716-446655440002', '791cabe6-9b4e-4ede-982b-92052821cb1a'); -- Pierre Durand - Design graphique

-- Insertion des types de missions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM mission_types WHERE name = 'Animation') THEN
        INSERT INTO mission_types (id, name, description) VALUES
        ('mt1', 'Animation', 'Activités d''animation et d''encadrement de groupes');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM mission_types WHERE name = 'Éducation') THEN
        INSERT INTO mission_types (id, name, description) VALUES
        ('mt2', 'Éducation', 'Activités d''enseignement et de formation');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM mission_types WHERE name = 'Soins aux animaux') THEN
        INSERT INTO mission_types (id, name, description) VALUES
        ('mt3', 'Soins aux animaux', 'Activités liées aux soins et à l''entretien des animaux');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM mission_types WHERE name = 'Événementiel') THEN
        INSERT INTO mission_types (id, name, description) VALUES
        ('mt4', 'Événementiel', 'Organisation et gestion d''événements');
    END IF;
END $$;

-- Insertion des missions de test
INSERT INTO missions (
    id,
    organization_id,
    title,
    description,
    start_date,
    end_date,
    duration_minutes,
    format,
    location,
    latitude,
    longitude,
    available_spots,
    difficulty_level,
    engagement_level,
    desired_impact,
    status,
    address,
    postal_code
) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'a444bae9-3193-465c-853b-9528abe1023e', 'Animation sportive', 'Animation d''activités sportives pour enfants', 
NOW(), NOW() + INTERVAL '2 hours', 120, 'présentiel', 'Gymnase municipal', 48.8566, 2.3522, 5, 'débutant', 'ponctuel', 
'Permettre aux enfants de découvrir différentes activités sportives', 'active', '123 Rue de la Paix', '75001'),

('aa0e8400-e29b-41d4-a716-446655440001', 'a444bae9-3193-465c-853b-9528abe1023e', 'Cours de piano', 'Donner des cours de piano débutant',
NOW(), NOW() + INTERVAL '1 hour', 60, 'présentiel', 'Salle de musique', 48.8566, 2.3522, 3, 'débutant', 'régulier',
'Initier les enfants à la musique classique', 'active', '123 Rue de la Paix', '75001'),

('aa0e8400-e29b-41d4-a716-446655440002', 'ea44982b-ba08-45cd-b051-255541c38bff', 'Soins aux animaux', 'Aide aux soins des animaux du refuge',
NOW(), NOW() + INTERVAL '3 hours', 180, 'présentiel', 'Refuge animalier', 48.8698, 2.3079, 2, 'intermédiaire', 'régulier',
'Améliorer le bien-être des animaux abandonnés', 'active', '456 Avenue des Champs-Élysées', '75008'),

('aa0e8400-e29b-41d4-a716-446655440003', 'a444bae9-3193-465c-853b-9528abe1023e', 'Tournoi de football', 'Organisation d''un tournoi de football pour jeunes',
NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 4 hours', 240, 'présentiel', 'Stade municipal', 48.8566, 2.3522, 10, 'tous niveaux', 'ponctuel',
'Promouvoir le sport et la cohésion sociale', 'active', '123 Rue de la Paix', '75001'),

('aa0e8400-e29b-41d4-a716-446655440004', 'ea44982b-ba08-45cd-b051-255541c38bff', 'Cours de guitare', 'Enseignement de la guitare pour débutants',
NOW(), NOW() + INTERVAL '1 hour', 60, 'présentiel', 'Salle de musique', 48.8698, 2.3079, 4, 'débutant', 'régulier',
'Développer la créativité musicale des jeunes', 'active', '456 Avenue des Champs-Élysées', '75008'),

('aa0e8400-e29b-41d4-a716-446655440005', 'ea44982b-ba08-45cd-b051-255541c38bff', 'Promenade des chiens', 'Promenade quotidienne des chiens du refuge',
NOW(), NOW() + INTERVAL '1 hour', 60, 'présentiel', 'Refuge animalier', 48.8698, 2.3079, 3, 'débutant', 'régulier',
'Assurer l''exercice quotidien des chiens', 'active', '456 Avenue des Champs-Élysées', '75008'),

('aa0e8400-e29b-41d4-a716-446655440006', 'a444bae9-3193-465c-853b-9528abe1023e', 'Entraînement basket', 'Encadrement d''une séance d''entraînement de basket',
NOW(), NOW() + INTERVAL '2 hours', 120, 'présentiel', 'Gymnase municipal', 48.8566, 2.3522, 8, 'intermédiaire', 'régulier',
'Développer les compétences techniques des joueurs', 'active', '123 Rue de la Paix', '75001'),

('aa0e8400-e29b-41d4-a716-446655440007', 'ea44982b-ba08-45cd-b051-255541c38bff', 'Concert caritatif', 'Organisation d''un concert pour financer les activités',
NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 4 hours', 240, 'présentiel', 'Salle de concert', 48.8698, 2.3079, 15, 'tous niveaux', 'ponctuel',
'Collecter des fonds pour les activités associatives', 'active', '456 Avenue des Champs-Élysées', '75008'),

('aa0e8400-e29b-41d4-a716-446655440008', 'ea44982b-ba08-45cd-b051-255541c38bff', 'Nettoyage du refuge', 'Aide au nettoyage et à l''entretien des locaux',
NOW(), NOW() + INTERVAL '2 hours', 120, 'présentiel', 'Refuge animalier', 48.8698, 2.3079, 5, 'débutant', 'ponctuel',
'Maintenir un environnement sain pour les animaux', 'active', '456 Avenue des Champs-Élysées', '75008'),

('aa0e8400-e29b-41d4-a716-446655440009', 'a444bae9-3193-465c-853b-9528abe1023e', 'Stage multisports', 'Animation d''un stage multisports pendant les vacances',
NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 8 hours', 480, 'présentiel', 'Complexe sportif', 48.8566, 2.3522, 20, 'tous niveaux', 'ponctuel',
'Offrir une activité sportive variée pendant les vacances', 'active', '123 Rue de la Paix', '75001');

-- Mise à jour des missions avec leurs types
UPDATE missions SET mission_type_id = 'mt1' WHERE id IN ('aa0e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440006', 'aa0e8400-e29b-41d4-a716-446655440009');
UPDATE missions SET mission_type_id = 'mt2' WHERE id IN ('aa0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440004');
UPDATE missions SET mission_type_id = 'mt3' WHERE id IN ('aa0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440008');
UPDATE missions SET mission_type_id = 'mt4' WHERE id IN ('aa0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440007');

-- Insertion des compétences requises pour les missions
INSERT INTO mission_skills (mission_id, skill_id, required_level, is_required) VALUES
-- Animation sportive
('aa0e8400-e29b-41d4-a716-446655440000', 'f5970a53-6ddc-4923-9725-86f23e5013ff', 'intermédiaire', true), -- Animation de groupe
('aa0e8400-e29b-41d4-a716-446655440000', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'débutant', true), -- Premiers secours

-- Cours de piano
('aa0e8400-e29b-41d4-a716-446655440001', '745bca38-82c2-4029-aac2-4503f4a585a2', 'intermédiaire', true), -- Éducation
('aa0e8400-e29b-41d4-a716-446655440001', '7884cbfc-73ae-4a13-b28b-3fbd62f0a8b8', 'débutant', false), -- Rédaction

-- Soins aux animaux
('aa0e8400-e29b-41d4-a716-446655440002', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'intermédiaire', true), -- Premiers secours
('aa0e8400-e29b-41d4-a716-446655440002', 'f1744b3a-5604-4885-a92b-8b1fd84ee217', 'débutant', false), -- Médiation

-- Tournoi de football
('aa0e8400-e29b-41d4-a716-446655440003', 'e1d6d061-fcff-487c-bb4e-4017b48efcd0', 'intermédiaire', true), -- Gestion de projet
('aa0e8400-e29b-41d4-a716-446655440003', 'f5970a53-6ddc-4923-9725-86f23e5013ff', 'débutant', true), -- Animation de groupe
('aa0e8400-e29b-41d4-a716-446655440003', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'débutant', true), -- Premiers secours

-- Cours de guitare
('aa0e8400-e29b-41d4-a716-446655440004', '745bca38-82c2-4029-aac2-4503f4a585a2', 'intermédiaire', true), -- Éducation
('aa0e8400-e29b-41d4-a716-446655440004', '7884cbfc-73ae-4a13-b28b-3fbd62f0a8b8', 'débutant', false), -- Rédaction

-- Promenade des chiens
('aa0e8400-e29b-41d4-a716-446655440005', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'débutant', true), -- Premiers secours
('aa0e8400-e29b-41d4-a716-446655440005', 'f1744b3a-5604-4885-a92b-8b1fd84ee217', 'débutant', false), -- Médiation

-- Entraînement basket
('aa0e8400-e29b-41d4-a716-446655440006', 'f5970a53-6ddc-4923-9725-86f23e5013ff', 'intermédiaire', true), -- Animation de groupe
('aa0e8400-e29b-41d4-a716-446655440006', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'débutant', true), -- Premiers secours

-- Concert caritatif
('aa0e8400-e29b-41d4-a716-446655440007', 'e1d6d061-fcff-487c-bb4e-4017b48efcd0', 'intermédiaire', true), -- Gestion de projet
('aa0e8400-e29b-41d4-a716-446655440007', '791cabe6-9b4e-4ede-982b-92052821cb1a', 'débutant', false), -- Design graphique
('aa0e8400-e29b-41d4-a716-446655440007', '7884cbfc-73ae-4a13-b28b-3fbd62f0a8b8', 'débutant', false), -- Rédaction

-- Nettoyage du refuge
('aa0e8400-e29b-41d4-a716-446655440008', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'débutant', true), -- Premiers secours
('aa0e8400-e29b-41d4-a716-446655440008', 'f1744b3a-5604-4885-a92b-8b1fd84ee217', 'débutant', false), -- Médiation

-- Stage multisports
('aa0e8400-e29b-41d4-a716-446655440009', 'f5970a53-6ddc-4923-9725-86f23e5013ff', 'intermédiaire', true), -- Animation de groupe
('aa0e8400-e29b-41d4-a716-446655440009', '0ee042bb-19fd-444f-9f7c-c7dd95fdbe8c', 'débutant', true), -- Premiers secours
('aa0e8400-e29b-41d4-a716-446655440009', 'e1d6d061-fcff-487c-bb4e-4017b48efcd0', 'débutant', false); -- Gestion de projet

-- Insertion des candidatures de test
INSERT INTO mission_registrations (
    id,
    user_id,
    mission_id,
    status,
    registration_date,
    confirmation_date,
    volunteer_feedback,
    volunteer_rating,
    organization_feedback,
    organization_rating
) VALUES
-- Jean Dupont - Animation sportive (en attente)
('mr1', '990e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440000', 'inscrit', NOW(), NULL, NULL, NULL, NULL, NULL),

-- Marie Martin - Cours de piano (accepté)
('mr2', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'accepté', NOW(), NOW() + INTERVAL '1 day', 
'Très bonne expérience d''enseignement', 5, 'Marie est une excellente enseignante', 5),

-- Pierre Durand - Soins aux animaux (en attente)
('mr3', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', 'inscrit', NOW(), NULL, NULL, NULL, NULL, NULL),

-- Jean Dupont - Tournoi de football (accepté)
('mr4', '990e8400-e29b-41d4-a716-446655440000', 'aa0e8400-e29b-41d4-a716-446655440003', 'accepté', NOW(), NOW() + INTERVAL '2 days',
'Superbe organisation du tournoi', 4, 'Jean a été très impliqué dans l''organisation', 4),

-- Marie Martin - Cours de guitare (en attente)
('mr5', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440004', 'inscrit', NOW(), NULL, NULL, NULL, NULL, NULL),

-- Pierre Durand - Promenade des chiens (accepté)
('mr6', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440005', 'accepté', NOW(), NOW() + INTERVAL '3 days',
'Très enrichissant de travailler avec les animaux', 5, 'Pierre est très attentionné avec les animaux', 5);

-- Insertion des disponibilités des missions
INSERT INTO mission_availability (mission_id, day_of_week, start_time, end_time) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'monday', '14:00', '16:00'),
('aa0e8400-e29b-41d4-a716-446655440000', 'wednesday', '14:00', '16:00'),
('aa0e8400-e29b-41d4-a716-446655440001', 'tuesday', '17:00', '19:00'),
('aa0e8400-e29b-41d4-a716-446655440001', 'thursday', '17:00', '19:00'),
('aa0e8400-e29b-41d4-a716-446655440002', 'monday', '09:00', '12:00'),
('aa0e8400-e29b-41d4-a716-446655440002', 'wednesday', '09:00', '12:00'),
('aa0e8400-e29b-41d4-a716-446655440002', 'friday', '09:00', '12:00'),
('aa0e8400-e29b-41d4-a716-446655440003', 'saturday', '10:00', '18:00'),
('aa0e8400-e29b-41d4-a716-446655440004', 'monday', '18:00', '20:00'),
('aa0e8400-e29b-41d4-a716-446655440004', 'wednesday', '18:00', '20:00'),
('aa0e8400-e29b-41d4-a716-446655440005', 'tuesday', '14:00', '16:00'),
('aa0e8400-e29b-41d4-a716-446655440005', 'thursday', '14:00', '16:00'),
('aa0e8400-e29b-41d4-a716-446655440006', 'friday', '17:00', '19:00'),
('aa0e8400-e29b-41d4-a716-446655440007', 'saturday', '19:00', '23:00'),
('aa0e8400-e29b-41d4-a716-446655440008', 'monday', '10:00', '12:00'),
('aa0e8400-e29b-41d4-a716-446655440008', 'wednesday', '10:00', '12:00'),
('aa0e8400-e29b-41d4-a716-446655440009', 'monday', '09:00', '17:00'),
('aa0e8400-e29b-41d4-a716-446655440009', 'tuesday', '09:00', '17:00'),
('aa0e8400-e29b-41d4-a716-446655440009', 'wednesday', '09:00', '17:00'),
('aa0e8400-e29b-41d4-a716-446655440009', 'thursday', '09:00', '17:00'),
('aa0e8400-e29b-41d4-a716-446655440009', 'friday', '09:00', '17:00');

-- Politiques RLS pour les tables d'authentification
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent créer leur propre profil" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politiques pour la table organization_profiles
CREATE POLICY "Les utilisateurs peuvent voir les profils d'organisation" ON public.organization_profiles
    FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent créer leur profil d'organisation" ON public.organization_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leur profil d'organisation" ON public.organization_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour la table user_skills
CREATE POLICY "Les utilisateurs peuvent voir les compétences des utilisateurs" ON public.user_skills
    FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent ajouter leurs compétences" ON public.user_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs compétences" ON public.user_skills
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_location_from_coordinates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_mission_location_from_coordinates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geo_location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_mission_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM missions 
        WHERE id = NEW.mission_id 
        AND available_spots <= (
            SELECT COUNT(*) FROM mission_registrations 
            WHERE mission_id = NEW.mission_id 
            AND status = 'accepté'
        )
    ) THEN
        RAISE EXCEPTION 'Plus de places disponibles pour cette mission';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restore_mission_spot()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'accepté' AND NEW.status = 'annulé' THEN
        UPDATE missions 
        SET available_spots = available_spots + 1 
        WHERE id = NEW.mission_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION award_badges()
RETURNS TRIGGER AS $$
BEGIN
    -- Logique d'attribution des badges basée sur les missions complétées
    IF NEW.status = 'terminé' THEN
        -- Exemple : Badge pour 5 missions complétées
        IF (
            SELECT COUNT(*) 
            FROM mission_registrations 
            WHERE user_id = NEW.user_id 
            AND status = 'terminé'
        ) = 5 THEN
            INSERT INTO user_badges (user_id, badge_id)
            SELECT NEW.user_id, id 
            FROM badges 
            WHERE name = 'Bénévole assidu'
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_registration_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        related_id
    ) VALUES (
        NEW.user_id,
        'inscription',
        'Nouvelle inscription',
        'Votre inscription à la mission a été enregistrée',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_cancellation_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'annulé' AND NEW.status = 'annulé' THEN
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_id
        ) VALUES (
            NEW.user_id,
            'annulation',
            'Inscription annulée',
            'Votre inscription à la mission a été annulée',
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création des triggers
-- Triggers pour updated_at
CREATE TRIGGER update_organization_sectors_updated_at
    BEFORE UPDATE ON organization_sectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mission_types_updated_at
    BEFORE UPDATE ON mission_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_profiles_updated_at
    BEFORE UPDATE ON organization_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at
    BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at
    BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mission_registrations_updated_at
    BEFORE UPDATE ON mission_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at
    BEFORE UPDATE ON user_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers pour la gestion des locations
CREATE TRIGGER update_users_location
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_location_from_coordinates();

CREATE TRIGGER update_organization_profiles_location
    BEFORE INSERT OR UPDATE ON organization_profiles
    FOR EACH ROW EXECUTE FUNCTION update_location_from_coordinates();

CREATE TRIGGER update_missions_location
    BEFORE INSERT OR UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_mission_location_from_coordinates();

-- Triggers pour la gestion des inscriptions
CREATE TRIGGER check_mission_availability_trigger
    BEFORE INSERT ON mission_registrations
    FOR EACH ROW EXECUTE FUNCTION check_mission_availability();

CREATE TRIGGER restore_mission_spot_trigger
    AFTER UPDATE ON mission_registrations
    FOR EACH ROW EXECUTE FUNCTION restore_mission_spot();

CREATE TRIGGER award_badges_trigger
    AFTER UPDATE ON mission_registrations
    FOR EACH ROW EXECUTE FUNCTION award_badges();

CREATE TRIGGER create_registration_notification_trigger
    AFTER INSERT ON mission_registrations
    FOR EACH ROW EXECUTE FUNCTION create_registration_notification();

CREATE TRIGGER create_cancellation_notification_trigger
    AFTER UPDATE ON mission_registrations
    FOR EACH ROW EXECUTE FUNCTION create_cancellation_notification(); 
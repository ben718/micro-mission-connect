
-- Script complet de données pour MicroBénévole
-- Inclut les données de production + données de test complètes

-- Réinitialisation des tables (optionnel - à décommenter si besoin)
-- TRUNCATE TABLE mission_registrations, missions, organization_profiles, user_badges, user_skills, profiles CASCADE;

-- ... keep existing code (profiles insertion) the same ...

-- 1. Insertion des utilisateurs de test dans la table profiles
INSERT INTO profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    bio, 
    city, 
    postal_code, 
    phone,
    profile_picture_url,
    created_at,
    updated_at
) VALUES 
-- Bénévoles
('11111111-1111-1111-1111-111111111111', 'Marie', 'Dubois', 'marie.dubois@email.com', 'Passionnée d''éducation et d''aide aux personnes âgées. 5 ans d''expérience dans le bénévolat.', 'Paris', '75001', '+33123456789', '/avatars/marie.jpg', now(), now()),
('22222222-2222-2222-2222-222222222222', 'Pierre', 'Martin', 'pierre.martin@email.com', 'Développeur web souhaitant partager ses compétences techniques avec les associations.', 'Lyon', '69000', '+33987654321', '/avatars/pierre.jpg', now(), now()),
('33333333-3333-3333-3333-333333333333', 'Sophie', 'Leroy', 'sophie.leroy@email.com', 'Étudiante en médecine, active dans l''aide humanitaire et les premiers secours.', 'Marseille', '13000', '+33456789123', '/avatars/sophie.jpg', now(), now()),
('44444444-4444-4444-4444-444444444444', 'Thomas', 'Durand', 'thomas.durand@email.com', 'Photographe professionnel engagé dans la protection de l''environnement.', 'Toulouse', '31000', '+33789123456', '/avatars/thomas.jpg', now(), now()),
('55555555-5555-5555-5555-555555555555', 'Emma', 'Moreau', 'emma.moreau@email.com', 'Chef cuisinière bénévole pour les associations caritatives.', 'Nice', '06000', '+33321654987', '/avatars/emma.jpg', now(), now()),

-- Responsables d'organisations
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jean', 'Responsable', 'jean@croixrouge.fr', 'Coordinateur bénévole à la Croix-Rouge française.', 'Paris', '75008', '+33111111111', '/avatars/jean.jpg', now(), now()),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Claire', 'Coordinatrice', 'claire@restosducoeur.fr', 'Responsable des bénévoles aux Restos du Cœur.', 'Lyon', '69001', '+33222222222', '/avatars/claire.jpg', now(), now()),
('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Marc', 'Directeur', 'marc@emmaus.fr', 'Directeur régional d''Emmaüs France.', 'Marseille', '13001', '+33333333333', '/avatars/marc.jpg', now(), now()),
('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Julie', 'Manager', 'julie@secourspopulaire.fr', 'Responsable du Secours Populaire local.', 'Bordeaux', '33000', '+33444444444', '/avatars/julie.jpg', now(), now()),
('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'David', 'Coordinateur', 'david@unicef.fr', 'Coordinateur régional UNICEF France.', 'Strasbourg', '67000', '+33555555555', '/avatars/david.jpg', now(), now())

ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    updated_at = now();

-- ... keep existing code (organization profiles insertion) the same ...

-- 2. Insertion des profils d'organisations
INSERT INTO organization_profiles (
    id,
    user_id,
    organization_name,
    description,
    sector_id,
    address,
    website_url,
    logo_url,
    siret_number,
    creation_date,
    latitude,
    longitude,
    created_at,
    updated_at
) VALUES 
('org00001-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Croix-Rouge française', 'Organisation humanitaire internationale active dans l''aide d''urgence, l''action sociale et la formation aux premiers secours.', (SELECT id FROM organization_sectors WHERE name = 'Humanitaire'), '98 Rue Didot, 75014 Paris', 'https://www.croix-rouge.fr', '/logos/croix-rouge.png', '77567227900224', '1864-02-17', 48.8317, 2.3200, now(), now()),

('org00002-2222-2222-2222-222222222222', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Restos du Cœur', 'Association caritative française qui distribue des repas gratuits aux plus démunis et propose un accompagnement vers l''insertion.', (SELECT id FROM organization_sectors WHERE name = 'Social'), '25 Rue du Louvre, 75001 Paris', 'https://www.restosducoeur.org', '/logos/restos-du-coeur.png', '32206653900189', '1985-09-26', 48.8606, 2.3376, now(), now()),

('org00003-3333-3333-3333-333333333333', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Emmaüs France', 'Mouvement de lutte contre l''exclusion fondé sur l''accueil inconditionnel et le travail avec les plus démunis.', (SELECT id FROM organization_sectors WHERE name = 'Social'), '47 Avenue de la Résistance, 93104 Montreuil', 'https://www.emmaus-france.org', '/logos/emmaus.png', '77561403200275', '1954-01-01', 48.8589, 2.4390, now(), now()),

('org00004-4444-4444-4444-444444444444', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Secours Populaire Français', 'Association à but non lucratif reconnue d''utilité publique qui agit contre la pauvreté et l''exclusion en France et dans le monde.', (SELECT id FROM organization_sectors WHERE name = 'Humanitaire'), '9-11 Rue Froissart, 75003 Paris', 'https://www.secourspopulaire.fr', '/logos/secours-populaire.png', '77568476200289', '1945-05-29', 48.8606, 2.3660, now(), now()),

('org00005-5555-5555-5555-555555555555', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'UNICEF France', 'Fonds des Nations unies pour l''enfance qui œuvre pour la défense des droits des enfants dans le monde.', (SELECT id FROM organization_sectors WHERE name = 'Humanitaire'), '3 Rue Duguay-Trouin, 75006 Paris', 'https://www.unicef.fr', '/logos/unicef.png', '77566576700123', '1946-12-11', 48.8489, 2.3292, now(), now()),

('org00006-6666-6666-6666-666666666666', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'WWF France', 'Organisation mondiale de protection de la nature et de l''environnement.', (SELECT id FROM organization_sectors WHERE name = 'Environnement'), '1 Carrefour de Longchamp, 75016 Paris', 'https://www.wwf.fr', '/logos/wwf.png', '30236406400047', '1973-03-07', 48.8590, 2.2869, now(), now()),

('org00007-7777-7777-7777-777777777777', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Médecins Sans Frontières', 'Organisation médicale humanitaire internationale qui apporte une assistance médicale aux populations en détresse.', (SELECT id FROM organization_sectors WHERE name = 'Santé'), '8 Rue Saint-Sabin, 75011 Paris', 'https://www.msf.fr', '/logos/msf.png', '31798653400203', '1971-12-20', 48.8566, 2.3703, now(), now()),

('org00008-8888-8888-8888-888888888888', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Greenpeace France', 'Organisation environnementale qui mène des campagnes pour la protection de l''environnement.', (SELECT id FROM organization_sectors WHERE name = 'Environnement'), '13 Rue d''Enghien, 75010 Paris', 'https://www.greenpeace.fr', '/logos/greenpeace.png', '39509121700096', '1971-09-15', 48.8713, 2.3503, now(), now())

ON CONFLICT (id) DO UPDATE SET
    organization_name = EXCLUDED.organization_name,
    description = EXCLUDED.description,
    updated_at = now();

-- ... keep existing code (user skills insertion) the same ...

-- 3. Attribution des compétences aux utilisateurs
INSERT INTO user_skills (id, user_id, skill_id, level, created_at, updated_at) VALUES 
-- Marie Dubois (Éducation/Social)
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Communication'), 'expert', now(), now()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Animation'), 'expert', now(), now()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Organisation'), 'avancé', now(), now()),

-- Pierre Martin (Tech)
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Informatique'), 'expert', now(), now()),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', now(), now()),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Organisation'), 'avancé', now(), now()),

-- Sophie Leroy (Santé)
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Premiers secours'), 'expert', now(), now()),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', now(), now()),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Langues étrangères'), 'intermédiaire', now(), now()),

-- Thomas Durand (Environnement/Créatif)
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', (SELECT id FROM skills WHERE name = 'Photographie'), 'expert', now(), now()),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', now(), now()),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', (SELECT id FROM skills WHERE name = 'Conduite'), 'avancé', now(), now()),

-- Emma Moreau (Cuisine/Social)
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', (SELECT id FROM skills WHERE name = 'Cuisine'), 'expert', now(), now()),
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', (SELECT id FROM skills WHERE name = 'Organisation'), 'avancé', now(), now()),
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', (SELECT id FROM skills WHERE name = 'Animation'), 'intermédiaire', now(), now())

ON CONFLICT (user_id, skill_id) DO UPDATE SET
    level = EXCLUDED.level,
    updated_at = now();

-- ... keep existing code (user badges insertion) the same ...

-- 4. Attribution des premiers badges
INSERT INTO user_badges (id, user_id, badge_id, acquisition_date, created_at) VALUES 
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (SELECT id FROM badges WHERE name = 'Première mission'), now() - interval '6 months', now()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (SELECT id FROM badges WHERE name = 'Bénévole actif'), now() - interval '3 months', now()),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', (SELECT id FROM badges WHERE name = 'Spécialiste social'), now() - interval '1 month', now()),

(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', (SELECT id FROM badges WHERE name = 'Première mission'), now() - interval '4 months', now()),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', (SELECT id FROM badges WHERE name = 'Bénévole actif'), now() - interval '2 months', now()),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', (SELECT id FROM badges WHERE name = 'Innovateur'), now() - interval '1 week', now()),

(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', (SELECT id FROM badges WHERE name = 'Première mission'), now() - interval '2 months', now()),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', (SELECT id FROM badges WHERE name = 'Bénévole actif'), now() - interval '2 weeks', now()),

(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', (SELECT id FROM badges WHERE name = 'Première mission'), now() - interval '5 months', now()),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', (SELECT id FROM badges WHERE name = 'Défenseur de l''environnement'), now() - interval '1 month', now()),

(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', (SELECT id FROM badges WHERE name = 'Première mission'), now() - interval '3 months', now())

ON CONFLICT (user_id, badge_id) DO NOTHING;

-- ... keep existing code (missions insertion) the same ...

-- 5. Création de missions variées
INSERT INTO missions (
    id,
    organization_id,
    title,
    description,
    location,
    address,
    postal_code,
    start_date,
    end_date,
    duration_minutes,
    available_spots,
    format,
    difficulty_level,
    engagement_level,
    mission_type_id,
    desired_impact,
    status,
    image_url,
    latitude,
    longitude,
    created_at,
    updated_at
) VALUES 

-- Missions Croix-Rouge
('mission01-1111-1111-1111-111111111111', 'org00001-1111-1111-1111-111111111111', 'Distribution alimentaire hebdomadaire', 'Aidez-nous à distribuer des colis alimentaires aux familles dans le besoin. Formation fournie sur place.', 'Paris 14e', '98 Rue Didot, 75014 Paris', '75014', now() + interval '3 days', now() + interval '3 days' + interval '4 hours', 240, 15, 'onsite', 'beginner', 'medium', (SELECT id FROM mission_types WHERE name = 'Distribution alimentaire'), 'Nourrir 150 familles en précarité alimentaire', 'active', '/missions/distribution-alimentaire.jpg', 48.8317, 2.3200, now(), now()),

('mission02-2222-2222-2222-222222222222', 'org00001-1111-1111-1111-111111111111', 'Formation premiers secours', 'Devenez formateur aux gestes qui sauvent ! Formation d''une journée pour apprendre à enseigner les premiers secours.', 'Paris 8e', '1 Place Henry Dunant, 75008 Paris', '75008', now() + interval '1 week', now() + interval '1 week' + interval '8 hours', 480, 8, 'onsite', 'intermediate', 'high', (SELECT id FROM mission_types WHERE name = 'Soutien scolaire'), 'Former 50 nouveaux secouristes dans l''année', 'active', '/missions/premiers-secours.jpg', 48.8742, 2.3089, now(), now()),

-- Missions Restos du Cœur
('mission03-3333-3333-3333-333333333333', 'org00002-2222-2222-2222-222222222222', 'Service repas du soir', 'Servir des repas chauds aux personnes sans-abri. Accueil, service et écoute bienveillante.', 'Lyon 1er', '25 Rue de la République, 69001 Lyon', '69001', now() + interval '2 days', now() + interval '2 days' + interval '3 hours', 180, 12, 'onsite', 'beginner', 'medium', (SELECT id FROM mission_types WHERE name = 'Distribution alimentaire'), 'Servir 80 repas par soirée', 'active', '/missions/service-repas.jpg', 45.7640, 4.8357, now(), now()),

('mission04-4444-4444-4444-444444444444', 'org00002-2222-2222-2222-222222222222', 'Collecte alimentaire en supermarché', 'Sensibiliser les clients et collecter des denrées alimentaires dans un supermarché partenaire.', 'Lyon 3e', 'Centre Commercial Part-Dieu, 69003 Lyon', '69003', now() + interval '5 days', now() + interval '5 days' + interval '6 hours', 360, 6, 'onsite', 'beginner', 'low', (SELECT id FROM mission_types WHERE name = 'Collecte de dons'), 'Collecter 500kg de denrées', 'active', '/missions/collecte-supermarche.jpg', 45.7606, 4.8506, now(), now()),

-- Missions Emmaüs
('mission05-5555-5555-5555-555555555555', 'org00003-3333-3333-3333-333333333333', 'Tri et valorisation d''objets', 'Participez au tri et à la remise en état d''objets donnés. Contribuez à l''économie circulaire !', 'Montreuil', '47 Avenue de la Résistance, 93104 Montreuil', '93104', now() + interval '4 days', now() + interval '4 days' + interval '4 hours', 240, 10, 'onsite', 'beginner', 'medium', (SELECT id FROM mission_types WHERE name = 'Nettoyage environnemental'), 'Valoriser 200 objets par jour', 'active', '/missions/tri-objets.jpg', 48.8589, 2.4390, now(), now()),

-- Missions environnementales
('mission06-6666-6666-6666-666666666666', 'org00006-6666-6666-6666-666666666666', 'Nettoyage de la Seine', 'Action écologique de nettoyage des berges de Seine. Matériel fourni, tenue adaptée recommandée.', 'Bois de Boulogne', 'Lac Inférieur, 75016 Paris', '75016', now() + interval '6 days', now() + interval '6 days' + interval '3 hours', 180, 25, 'onsite', 'beginner', 'low', (SELECT id FROM mission_types WHERE name = 'Nettoyage environnemental'), 'Nettoyer 2km de berges', 'active', '/missions/nettoyage-seine.jpg', 48.8590, 2.2869, now(), now()),

('mission07-7777-7777-7777-777777777777', 'org00008-8888-8888-8888-888888888888', 'Sensibilisation recyclage', 'Campagne de sensibilisation au recyclage dans les écoles primaires. Animation ludique et pédagogique.', 'Paris 10e', 'École élémentaire, Rue de Marseille, 75010 Paris', '75010', now() + interval '1 week', now() + interval '1 week' + interval '2 hours', 120, 4, 'onsite', 'intermediate', 'medium', (SELECT id FROM mission_types WHERE name = 'Animation événements'), 'Sensibiliser 150 enfants', 'active', '/missions/sensibilisation-ecole.jpg', 48.8713, 2.3503, now(), now()),

-- Missions de soutien scolaire
('mission08-8888-8888-8888-888888888888', 'org00004-4444-4444-4444-444444444444', 'Aide aux devoirs primaire', 'Accompagnement scolaire d''enfants de CP à CM2. Patience et bienveillance essentielles.', 'Bordeaux Centre', '15 Rue Sainte-Catherine, 33000 Bordeaux', '33000', now() + interval '2 days', now() + interval '2 days' + interval '2 hours', 120, 8, 'onsite', 'beginner', 'high', (SELECT id FROM mission_types WHERE name = 'Soutien scolaire'), 'Accompagner 20 enfants par semaine', 'active', '/missions/aide-devoirs.jpg', 44.8378, -0.5792, now(), now()),

-- Missions tech/innovation
('mission09-9999-9999-9999-999999999999', 'org00005-5555-5555-5555-555555555555', 'Formation numérique seniors', 'Initiation à l''informatique pour les personnes âgées. Tablettes et smartphones au programme.', 'Paris 6e', '3 Rue Duguay-Trouin, 75006 Paris', '75006', now() + interval '8 days', now() + interval '8 days' + interval '3 hours', 180, 6, 'onsite', 'intermediate', 'medium', (SELECT id FROM mission_types WHERE name = 'Support informatique'), 'Former 30 seniors au numérique', 'active', '/missions/formation-seniors.jpg', 48.8489, 2.3292, now(), now()),

-- Mission à distance
('mission10-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'org00007-7777-7777-7777-777777777777', 'Traduction documents médicaux', 'Traduction de documents de sensibilisation santé en plusieurs langues. Travail à distance.', 'Télétravail', 'Mission à distance', '', now() + interval '3 days', now() + interval '10 days', 600, 5, 'remote', 'intermediate', 'high', (SELECT id FROM mission_types WHERE name = 'Support informatique'), 'Traduire guides en 5 langues', 'active', '/missions/traduction.jpg', null, null, now(), now())

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = now();

-- ... keep existing code (mission skills insertion) the same ...

-- 6. Compétences requises pour les missions
INSERT INTO mission_skills (id, mission_id, skill_id, required_level, is_required, created_at) VALUES 
-- Distribution alimentaire - Communication recommandée
(gen_random_uuid(), 'mission01-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Communication'), 'débutant', false, now()),
(gen_random_uuid(), 'mission01-1111-1111-1111-111111111111', (SELECT id FROM skills WHERE name = 'Organisation'), 'débutant', false, now()),

-- Formation premiers secours - Compétences requises
(gen_random_uuid(), 'mission02-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Premiers secours'), 'avancé', true, now()),
(gen_random_uuid(), 'mission02-2222-2222-2222-222222222222', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', true, now()),

-- Service repas - Communication importante
(gen_random_uuid(), 'mission03-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Communication'), 'débutant', false, now()),
(gen_random_uuid(), 'mission03-3333-3333-3333-333333333333', (SELECT id FROM skills WHERE name = 'Cuisine'), 'débutant', false, now()),

-- Soutien scolaire - Animation requise
(gen_random_uuid(), 'mission08-8888-8888-8888-888888888888', (SELECT id FROM skills WHERE name = 'Animation'), 'intermédiaire', true, now()),
(gen_random_uuid(), 'mission08-8888-8888-8888-888888888888', (SELECT id FROM skills WHERE name = 'Communication'), 'intermédiaire', false, now()),

-- Formation numérique - Informatique requise
(gen_random_uuid(), 'mission09-9999-9999-9999-999999999999', (SELECT id FROM skills WHERE name = 'Informatique'), 'avancé', true, now()),
(gen_random_uuid(), 'mission09-9999-9999-9999-999999999999', (SELECT id FROM skills WHERE name = 'Communication'), 'intermédiaire', true, now()),

-- Traduction - Langues requises
(gen_random_uuid(), 'mission10-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT id FROM skills WHERE name = 'Langues étrangères'), 'expert', true, now())

ON CONFLICT (mission_id, skill_id) DO UPDATE SET
    required_level = EXCLUDED.required_level,
    is_required = EXCLUDED.is_required;

-- ... keep existing code (mission registrations insertion) the same ...

-- 7. Inscriptions aux missions (historique et actuelles)
INSERT INTO mission_registrations (
    id,
    user_id,
    mission_id,
    status,
    registration_date,
    confirmation_date,
    volunteer_rating,
    organization_rating,
    volunteer_feedback,
    organization_feedback,
    created_at,
    updated_at
) VALUES 

-- Inscriptions confirmées
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'mission01-1111-1111-1111-111111111111', 'confirmé', now() - interval '2 days', now() - interval '1 day', null, null, null, null, now() - interval '2 days', now() - interval '1 day'),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'mission02-2222-2222-2222-222222222222', 'confirmé', now() - interval '3 days', now() - interval '2 days', null, null, null, null, now() - interval '3 days', now() - interval '2 days'),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'mission03-3333-3333-3333-333333333333', 'inscrit', now() - interval '1 day', null, null, null, null, null, now() - interval '1 day', now() - interval '1 day'),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'mission06-6666-6666-6666-666666666666', 'inscrit', now() - interval '1 day', null, null, null, null, null, now() - interval '1 day', now() - interval '1 day'),
(gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 'mission03-3333-3333-3333-333333333333', 'confirmé', now() - interval '2 days', now() - interval '1 day', null, null, null, null, now() - interval '2 days', now() - interval '1 day'),

-- Missions terminées avec évaluations
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'mission04-4444-4444-4444-444444444444', 'terminé', now() - interval '1 month', now() - interval '3 weeks', 5, 4, 'Mission très enrichissante, organisation parfaite !', 'Bénévole très motivée et efficace.', now() - interval '1 month', now() - interval '3 weeks'),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'mission05-5555-5555-5555-555555555555', 'terminé', now() - interval '2 weeks', now() - interval '10 days', 4, 5, 'Très bonne expérience, équipe accueillante.', 'Compétences techniques très appréciées.', now() - interval '2 weeks', now() - interval '10 days'),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'mission07-7777-7777-7777-777777777777', 'terminé', now() - interval '3 weeks', now() - interval '2 weeks', 5, 5, 'Mission parfaitement organisée, impact visible.', 'Excellent bénévole, créatif et engagé.', now() - interval '3 weeks', now() - interval '2 weeks')

ON CONFLICT (user_id, mission_id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = now();

-- 8. Notifications de test
INSERT INTO notifications (
    id,
    user_id,
    title,
    content,
    is_read,
    link_url,
    created_at
) VALUES 
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Mission confirmée !', 'Votre participation à "Distribution alimentaire hebdomadaire" a été confirmée.', false, '/missions/mission01-1111-1111-1111-111111111111', now() - interval '1 day'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Nouveau badge obtenu !', 'Félicitations ! Vous avez obtenu le badge "Spécialiste social".', false, '/profile', now() - interval '1 month'),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Rappel de mission', 'Votre mission "Formation premiers secours" commence demain.', false, '/missions/mission02-2222-2222-2222-222222222222', now() - interval '2 hours'),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Nouvelle mission disponible', 'Une mission "Aide aux devoirs" correspond à vos compétences !', true, '/missions', now() - interval '2 days'),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'Évaluation en attente', 'N''oubliez pas d''évaluer votre dernière mission terminée.', false, '/profile/missions', now() - interval '3 days')

ON CONFLICT (id) DO NOTHING;

-- ... keep existing code (testimonials insertion) the same ...

-- 9. Témoignages publics
INSERT INTO testimonials (
    id,
    user_id,
    content,
    job_title,
    is_visible,
    created_at,
    updated_at
) VALUES 
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'MicroBénévole m''a permis de trouver des missions parfaitement adaptées à mes compétences. L''équipe de la Croix-Rouge était formidable !', 'Éducatrice spécialisée', true, now() - interval '2 weeks', now() - interval '2 weeks'),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Grâce à cette plateforme, j''ai pu mettre mes compétences techniques au service d''associations qui en avaient vraiment besoin.', 'Développeur web', true, now() - interval '1 month', now() - interval '1 month'),
(gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 'Une expérience enrichissante ! J''ai pu contribuer à la sensibilisation environnementale tout en développant de nouvelles compétences.', 'Photographe', true, now() - interval '3 weeks', now() - interval '3 weeks')

ON CONFLICT (id) DO NOTHING;

-- Mise à jour des statistiques (optionnel)
ANALYZE profiles, organization_profiles, missions, mission_registrations, user_skills, user_badges;

-- Message de confirmation
SELECT 
    'Script exécuté avec succès !' as message,
    (SELECT COUNT(*) FROM profiles) as nb_profiles,
    (SELECT COUNT(*) FROM organization_profiles) as nb_organizations,
    (SELECT COUNT(*) FROM missions) as nb_missions,
    (SELECT COUNT(*) FROM mission_registrations) as nb_registrations,
    (SELECT COUNT(*) FROM user_skills) as nb_user_skills,
    (SELECT COUNT(*) FROM user_badges) as nb_user_badges,
    (SELECT COUNT(*) FROM notifications) as nb_notifications;



-- Script complet de données pour MicroBénévole
-- Utilise les utilisateurs existants pour les tests

-- IMPORTANT: Ce script utilise des utilisateurs existants dans auth.users
-- Utilisateurs de test :
-- a444bae9-3193-465c-853b-9528abe1023e - rioall77@gmail.com (Alpha Association)
-- ea44982b-ba08-45cd-b051-255541c38bff - benmvouama@gmail.com (Ben, bénévole)

-- 1. Mise à jour des profils existants avec des données de test enrichies
UPDATE profiles SET 
    first_name = 'Alpha',
    last_name = 'Association',
    bio = 'Association humanitaire engagée dans l''aide aux plus démunis et l''action sociale locale.',
    city = 'Paris',
    postal_code = '75001',
    phone = '+33123456789',
    profile_picture_url = '/avatars/alpha.jpg',
    updated_at = now()
WHERE id = 'a444bae9-3193-465c-853b-9528abe1023e';

UPDATE profiles SET 
    first_name = 'Ben',
    last_name = 'Mvouama',
    bio = 'Bénévole passionné souhaitant aider les associations dans leurs missions d''aide sociale.',
    city = 'Lyon',
    postal_code = '69000',
    phone = '+33987654321',
    profile_picture_url = '/avatars/ben.jpg',
    updated_at = now()
WHERE id = 'ea44982b-ba08-45cd-b051-255541c38bff';

-- 2. Création du profil d'organisation pour Alpha Association
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
('org-alpha-001', 'a444bae9-3193-465c-853b-9528abe1023e', 'Alpha Association', 'Association humanitaire française active dans l''aide d''urgence, l''action sociale et la formation aux premiers secours.', (SELECT id FROM organization_sectors WHERE name = 'Humanitaire'), '98 Rue de Rivoli, 75001 Paris', 'https://www.alpha-association.fr', '/logos/alpha.png', '77567227900224', '2020-01-15', 48.8606, 2.3376, now(), now())

ON CONFLICT (id) DO UPDATE SET
    organization_name = EXCLUDED.organization_name,
    description = EXCLUDED.description,
    updated_at = now();

-- 3. Attribution des compétences aux utilisateurs réels uniquement
INSERT INTO user_skills (id, user_id, skill_id, level, created_at, updated_at) VALUES 
-- Ben (bénévole) - Compétences variées
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', now(), now()),
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', (SELECT id FROM skills WHERE name = 'Organisation'), 'intermédiaire', now(), now()),
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', (SELECT id FROM skills WHERE name = 'Informatique'), 'avancé', now(), now())

ON CONFLICT (user_id, skill_id) DO UPDATE SET
    level = EXCLUDED.level,
    updated_at = now();

-- 4. Attribution des premiers badges
INSERT INTO user_badges (id, user_id, badge_id, acquisition_date, created_at) VALUES 
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', (SELECT id FROM badges WHERE name = 'Première mission'), now() - interval '2 months', now()),
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', (SELECT id FROM badges WHERE name = 'Bénévole actif'), now() - interval '1 month', now())

ON CONFLICT (user_id, badge_id) DO NOTHING;

-- 5. Création de missions par Alpha Association
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

-- Missions créées par Alpha Association
('mission-alpha-01', 'org-alpha-001', 'Distribution alimentaire hebdomadaire', 'Aidez-nous à distribuer des colis alimentaires aux familles dans le besoin. Formation fournie sur place.', 'Paris 1er', '98 Rue de Rivoli, 75001 Paris', '75001', now() + interval '3 days', now() + interval '3 days' + interval '4 hours', 240, 15, 'Présentiel', 'débutant', 'Petit coup de main', (SELECT id FROM mission_types WHERE name = 'Collecte'), 'Nourrir 150 familles en précarité alimentaire', 'active', '/missions/distribution-alimentaire.jpg', 48.8606, 2.3376, now(), now()),

('mission-alpha-02', 'org-alpha-001', 'Formation premiers secours', 'Devenez formateur aux gestes qui sauvent ! Formation d''une journée pour apprendre à enseigner les premiers secours.', 'Paris 1er', '98 Rue de Rivoli, 75001 Paris', '75001', now() + interval '1 week', now() + interval '1 week' + interval '8 hours', 480, 8, 'Présentiel', 'intermédiaire', 'Mission avec suivi', (SELECT id FROM mission_types WHERE name = 'Conseil'), 'Former 50 nouveaux secouristes dans l''année', 'active', '/missions/premiers-secours.jpg', 48.8606, 2.3376, now(), now()),

('mission-alpha-03', 'org-alpha-001', 'Accompagnement scolaire', 'Aidez des enfants en difficulté scolaire avec leurs devoirs et leçons. Patience et bienveillance essentielles.', 'Paris 1er', '12 Rue des Écoles, 75001 Paris', '75001', now() + interval '2 days', now() + interval '2 days' + interval '2 hours', 120, 6, 'Présentiel', 'débutant', 'Mission avec suivi', (SELECT id FROM mission_types WHERE name = 'Accompagnement'), 'Accompagner 20 enfants par semaine', 'active', '/missions/aide-devoirs.jpg', 48.8522, 2.3470, now(), now()),

('mission-alpha-04', 'org-alpha-001', 'Collecte vestimentaire', 'Participez à notre collecte de vêtements pour les personnes sans-abri. Tri et distribution prévus.', 'Paris 1er', '25 Rue Saint-Honoré, 75001 Paris', '75001', now() + interval '5 days', now() + interval '5 days' + interval '6 hours', 360, 10, 'Présentiel', 'débutant', 'Ultra-rapide', (SELECT id FROM mission_types WHERE name = 'Collecte'), 'Collecter et distribuer 500 vêtements', 'active', '/missions/collecte-vetements.jpg', 48.8628, 2.3292, now(), now())

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = now();

-- 6. Compétences requises pour les missions
INSERT INTO mission_skills (id, mission_id, skill_id, required_level, is_required, created_at) VALUES 
-- Distribution alimentaire - Communication recommandée
(gen_random_uuid(), 'mission-alpha-01', (SELECT id FROM skills WHERE name = 'Communication'), 'débutant', false, now()),
(gen_random_uuid(), 'mission-alpha-01', (SELECT id FROM skills WHERE name = 'Organisation'), 'débutant', false, now()),

-- Formation premiers secours - Compétences requises
(gen_random_uuid(), 'mission-alpha-02', (SELECT id FROM skills WHERE name = 'Premiers secours'), 'avancé', true, now()),
(gen_random_uuid(), 'mission-alpha-02', (SELECT id FROM skills WHERE name = 'Communication'), 'avancé', true, now()),

-- Accompagnement scolaire - Animation recommandée
(gen_random_uuid(), 'mission-alpha-03', (SELECT id FROM skills WHERE name = 'Animation'), 'intermédiaire', false, now()),
(gen_random_uuid(), 'mission-alpha-03', (SELECT id FROM skills WHERE name = 'Communication'), 'intermédiaire', true, now())

ON CONFLICT (mission_id, skill_id) DO UPDATE SET
    required_level = EXCLUDED.required_level,
    is_required = EXCLUDED.is_required;

-- 7. Inscriptions de Ben aux missions
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

-- Ben inscrit à la distribution alimentaire (confirmé)
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', 'mission-alpha-01', 'confirmé', now() - interval '2 days', now() - interval '1 day', null, null, null, null, now() - interval '2 days', now() - interval '1 day'),

-- Ben inscrit à l'accompagnement scolaire (en attente)
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', 'mission-alpha-03', 'inscrit', now() - interval '1 day', null, null, null, null, null, now() - interval '1 day', now() - interval '1 day')

ON CONFLICT (user_id, mission_id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = now();

-- 8. Notifications pour les utilisateurs réels
INSERT INTO notifications (
    id,
    user_id,
    title,
    content,
    is_read,
    link_url,
    created_at
) VALUES 
-- Notifications pour Ben
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', 'Mission confirmée !', 'Votre participation à "Distribution alimentaire hebdomadaire" a été confirmée.', false, '/missions/mission-alpha-01', now() - interval '1 day'),
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', 'Nouveau badge obtenu !', 'Félicitations ! Vous avez obtenu le badge "Bénévole actif".', false, '/profile', now() - interval '1 month'),
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', 'Nouvelle mission disponible', 'Une mission "Collecte vestimentaire" correspond à vos compétences !', true, '/missions', now() - interval '2 days'),

-- Notifications pour Alpha Association
(gen_random_uuid(), 'a444bae9-3193-465c-853b-9528abe1023e', 'Nouvelle inscription', 'Ben s''est inscrit à votre mission "Distribution alimentaire".', false, '/missions/mission-alpha-01', now() - interval '2 days'),
(gen_random_uuid(), 'a444bae9-3193-465c-853b-9528abe1023e', 'Mission bientôt complète', 'Il ne reste que 3 places pour "Formation premiers secours".', false, '/missions/mission-alpha-02', now() - interval '1 day')

ON CONFLICT (id) DO NOTHING;

-- 9. Témoignages avec les vrais utilisateurs
INSERT INTO testimonials (
    id,
    user_id,
    content,
    job_title,
    is_visible,
    created_at,
    updated_at
) VALUES 
(gen_random_uuid(), 'ea44982b-ba08-45cd-b051-255541c38bff', 'MicroBénévole m''a permis de trouver facilement des missions qui correspondent à mes compétences. L''équipe d''Alpha Association était formidable !', 'Développeur', true, now() - interval '2 weeks', now() - interval '2 weeks')

ON CONFLICT (id) DO NOTHING;

-- Message de confirmation
SELECT 
    'Script exécuté avec succès avec les vrais utilisateurs !' as message,
    (SELECT COUNT(*) FROM profiles WHERE id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff')) as nb_profiles_reels,
    (SELECT COUNT(*) FROM organization_profiles WHERE user_id = 'a444bae9-3193-465c-853b-9528abe1023e') as nb_organizations,
    (SELECT COUNT(*) FROM missions WHERE organization_id = 'org-alpha-001') as nb_missions_alpha,
    (SELECT COUNT(*) FROM mission_registrations WHERE user_id = 'ea44982b-ba08-45cd-b051-255541c38bff') as nb_inscriptions_ben;


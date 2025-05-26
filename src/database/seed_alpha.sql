-- Suppression des données existantes
DELETE FROM notifications WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM mission_registrations WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM mission_skills WHERE mission_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM missions WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM user_badges WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM user_skills WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM profiles WHERE id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM skills WHERE id IN ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777');
DELETE FROM mission_types WHERE id IN ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
DELETE FROM organization_profiles WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e');

-- Insertion des types de mission
INSERT INTO mission_types (
  id,
  name,
  description,
  created_at,
  updated_at
) VALUES 
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Animation Créative',
    'Missions liées à l''animation et à l''encadrement de groupes',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Soutien Scolaire',
    'Missions liées à l''enseignement et au soutien scolaire',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Insertion des compétences
INSERT INTO skills (
  id,
  name,
  description,
  category,
  created_at,
  updated_at
) VALUES 
  (
    '55555555-5555-5555-5555-555555555555',
    'Animation de Groupe Créatif',
    'Capacité à animer et coordonner des groupes de personnes',
    'Animation',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Premiers Secours et Sécurité',
    'Connaissance des gestes de premiers secours et de la sécurité',
    'Santé',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Accompagnement Scolaire',
    'Capacité à enseigner et transmettre des connaissances',
    'Éducation',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Insertion du profil de l'organisation
INSERT INTO organization_profiles (
  id,
  user_id,
  organization_name,
  description,
  logo_url,
  website_url,
  address,
  latitude,
  longitude,
  siret_number,
  creation_date,
  created_at,
  updated_at,
  location,
  sector_id
) VALUES (
  'a444bae9-3193-465c-853b-9528abe1023e',
  'a444bae9-3193-465c-853b-9528abe1023e',
  'Alpha Association',
  'Association dédiée à l''éducation et au développement social',
  'https://example.com/alpha-logo.png',
  'https://alpha-association.org',
  '123 Rue de la Solidarité',
  48.8566,
  2.3522,
  '12345678901234',
  '2020-01-01',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  NULL,
  NULL
);

-- Insertion des profils
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
  last_login,
  created_at,
  updated_at
) VALUES 
  (
    'a444bae9-3193-465c-853b-9528abe1023e',
    'Alpha',
    'Association',
    '123 Rue de la Solidarité',
    '75001',
    'Paris',
    48.8566,
    2.3522,
    'https://example.com/alpha-logo.png',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'ea44982b-ba08-45cd-b051-255541c38bff',
    'Ben',
    'Mvouama',
    '456 Avenue des Volontaires',
    '75002',
    'Paris',
    48.8566,
    2.3522,
    'https://example.com/ben-avatar.png',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Insertion des missions
INSERT INTO missions (
  id,
  organization_id,
  mission_type_id,
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
  image_url,
  address,
  postal_code,
  created_at,
  updated_at,
  geo_location
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'a444bae9-3193-465c-853b-9528abe1023e',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Animation d''ateliers créatifs',
    'Animation d''ateliers créatifs pour enfants dans le cadre de notre programme d''été.',
    '2025-07-01 09:00:00+02',
    '2025-08-31 17:00:00+02',
    120,
    'Présentiel',
    'Paris',
    48.8566,
    2.3522,
    5,
    'débutant',
    'Petit coup de main',
    'Permettre aux enfants de développer leur créativité et leur confiance en soi',
    'active',
    'https://example.com/atelier-creatif.jpg',
    '123 Rue de la Solidarité',
    '75001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    NULL
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'a444bae9-3193-465c-853b-9528abe1023e',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Soutien scolaire',
    'Soutien scolaire pour des élèves en difficulté dans les matières principales.',
    '2025-09-01 14:00:00+02',
    '2025-12-31 18:00:00+02',
    60,
    'Présentiel',
    'Paris',
    48.8566,
    2.3522,
    3,
    'intermédiaire',
    'Mission avec suivi',
    'Aider les élèves à surmonter leurs difficultés scolaires et à reprendre confiance',
    'active',
    'https://example.com/soutien-scolaire.jpg',
    '123 Rue de la Solidarité',
    '75001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    NULL
  );

-- Insertion des compétences requises pour les missions
INSERT INTO mission_skills (
  id,
  mission_id,
  skill_id,
  required_level,
  is_required,
  created_at
) VALUES 
  (
    '99999999-9999-9999-9999-999999999999',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    '3', -- Valeur numérique sous forme de chaîne
    true,
    CURRENT_TIMESTAMP
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    '2', -- Valeur numérique sous forme de chaîne
    false,
    CURRENT_TIMESTAMP
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    '77777777-7777-7777-7777-777777777777',
    '4', -- Valeur numérique sous forme de chaîne
    true,
    CURRENT_TIMESTAMP
  );

-- Insertion des inscriptions aux missions
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
  organization_rating,
  created_at,
  updated_at
) VALUES 
  (
    '88888888-8888-8888-8888-888888888888',
    'ea44982b-ba08-45cd-b051-255541c38bff',
    '11111111-1111-1111-1111-111111111111',
    'inscrit',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'Mission très enrichissante et bien organisée',
    5,
    'Bénévole très impliqué et compétent',
    5,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Insertion des notifications (structure corrigée)
INSERT INTO notifications (
  id,
  user_id,
  title,
  content,
  is_read,
  created_at,
  link_url
) VALUES 
  (
    uuid_generate_v4(),
    'ea44982b-ba08-45cd-b051-255541c38bff',
    'Inscription acceptée',
    'Votre inscription à l''atelier créatif a été acceptée.',
    false,
    CURRENT_TIMESTAMP,
    '/missions/11111111-1111-1111-1111-111111111111'
  ),
  (
    uuid_generate_v4(),
    'a444bae9-3193-465c-853b-9528abe1023e',
    'Nouvelle inscription',
    'Ben Mvouama s''est inscrit à l''atelier créatif.',
    false,
    CURRENT_TIMESTAMP,
    '/missions/11111111-1111-1111-1111-111111111111'
  );

-- Insertion des badges
INSERT INTO badges (
  id,
  name,
  description,
  image_url,
  created_at,
  updated_at
) VALUES 
  (
    '55555555-5555-5555-5555-555555555555',
    'Bénévole Créatif',
    'Badge décerné aux bénévoles ayant participé à des missions créatives',
    'https://example.com/badges/creative.png',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Insertion des badges utilisateur
INSERT INTO user_badges (
  id,
  user_id,
  badge_id,
  acquisition_date,
  created_at
) VALUES 
  (
    uuid_generate_v4(),
    'ea44982b-ba08-45cd-b051-255541c38bff',
    '55555555-5555-5555-5555-555555555555',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

-- Suppression des données existantes
DELETE FROM notifications WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM mission_registrations WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM mission_skills WHERE mission_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM missions WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM user_badges WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM user_skills WHERE user_id IN ('a444bae9-3193-465c-853b-9528abe1023e', 'ea44982b-ba08-45cd-b051-255541c38bff');
DELETE FROM profiles WHERE id IN ('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
DELETE FROM skills WHERE id IN ('55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777');
DELETE FROM mission_types WHERE id IN ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd');

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
    'Animation',
    'Missions liées à l''animation et à l''encadrement de groupes',
    NOW(),
    NOW()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Éducation',
    'Missions liées à l''enseignement et au soutien scolaire',
    NOW(),
    NOW()
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
    'Animation de groupe',
    'Capacité à animer et coordonner des groupes de personnes',
    'Animation',
    NOW(),
    NOW()
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Premiers secours',
    'Connaissance des gestes de premiers secours et de la sécurité',
    'Santé',
    NOW(),
    NOW()
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Éducation',
    'Capacité à enseigner et transmettre des connaissances',
    'Éducation',
    NOW(),
    NOW()
  );

-- Insertion du profil de l'association
INSERT INTO profiles (
  id,
  email,
  encrypted_password,
  first_name,
  last_name,
  bio,
  profile_picture_url,
  phone,
  city,
  postal_code,
  address,
  latitude,
  longitude,
  is_organization,
  last_login,
  created_at,
  updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'rioall77@gmail.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', -- Mot de passe hashé
  'Alpha',
  'Association',
  'Association dédiée à l''aide aux personnes en difficulté et au développement communautaire.',
  'https://example.com/alpha-logo.png',
  '+33612345678',
  'Paris',
  '75001',
  '123 Rue de la Solidarité',
  48.8566,
  2.3522,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Insertion du profil du bénévole
INSERT INTO profiles (
  id,
  email,
  encrypted_password,
  first_name,
  last_name,
  bio,
  profile_picture_url,
  phone,
  city,
  postal_code,
  address,
  latitude,
  longitude,
  is_organization,
  last_login,
  created_at,
  updated_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'benmvouama@gmail.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', -- Mot de passe hashé
  'Ben',
  'Mvouama',
  'Passionné par l''aide humanitaire et le développement communautaire.',
  'https://example.com/ben-avatar.png',
  '+33698765432',
  'Paris',
  '75002',
  '456 Avenue des Volontaires',
  48.8566,
  2.3522,
  false,
  NOW(),
  NOW(),
  NOW()
);

-- Insertion des badges du bénévole
INSERT INTO user_badges (user_id, badge_id, earned_at, created_at, updated_at)
VALUES 
  ('ea44982b-ba08-45cd-b051-255541c38bff', 1, NOW(), NOW(), NOW()), -- Bénévole actif
  ('ea44982b-ba08-45cd-b051-255541c38bff', 2, NOW(), NOW(), NOW()); -- Animateur confirmé

-- Insertion des compétences du bénévole
INSERT INTO user_skills (user_id, skill_id, level, created_at, updated_at)
VALUES 
  ('ea44982b-ba08-45cd-b051-255541c38bff', '55555555-5555-5555-5555-555555555555', 4, NOW(), NOW()), -- Animation de groupe
  ('ea44982b-ba08-45cd-b051-255541c38bff', '66666666-6666-6666-6666-666666666666', 3, NOW(), NOW()), -- Premiers secours
  ('ea44982b-ba08-45cd-b051-255541c38bff', '77777777-7777-7777-7777-777777777777', 5, NOW(), NOW()); -- Éducation

-- Insertion des missions de l'association
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
  updated_at
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Animation d''ateliers créatifs',
    'Animation d''ateliers créatifs pour enfants dans le cadre de notre programme d''été.',
    '2025-07-01 09:00:00+02',
    '2025-08-31 17:00:00+02',
    120,
    'présentiel',
    'Paris',
    48.8566,
    2.3522,
    5,
    '2',
    '3',
    'Permettre aux enfants de développer leur créativité et leur confiance en soi',
    'active',
    'https://example.com/atelier-creatif.jpg',
    '123 Rue de la Solidarité',
    '75001',
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Soutien scolaire',
    'Soutien scolaire pour des élèves en difficulté dans les matières principales.',
    '2025-09-01 14:00:00+02',
    '2025-12-31 18:00:00+02',
    60,
    'présentiel',
    'Paris',
    48.8566,
    2.3522,
    3,
    '3',
    '4',
    'Aider les élèves à surmonter leurs difficultés scolaires et à reprendre confiance',
    'active',
    'https://example.com/soutien-scolaire.jpg',
    '123 Rue de la Solidarité',
    '75001',
    NOW(),
    NOW()
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
    '3',
    true,
    NOW()
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    '2',
    false,
    NOW()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    '77777777-7777-7777-7777-777777777777',
    '4',
    true,
    NOW()
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
    'accepted',
    NOW(),
    NOW(),
    'Mission très enrichissante et bien organisée',
    5,
    'Bénévole très impliqué et compétent',
    5,
    NOW(),
    NOW()
  );

-- Insertion des notifications
INSERT INTO notifications (
  user_id,
  type,
  title,
  message,
  related_id,
  read,
  created_at,
  updated_at
) VALUES 
  (
    'ea44982b-ba08-45cd-b051-255541c38bff',
    'mission_accepted',
    'Inscription acceptée',
    'Votre inscription à l''atelier créatif a été acceptée.',
    '11111111-1111-1111-1111-111111111111',
    false,
    NOW(),
    NOW()
  ),
  (
    'a444bae9-3193-465c-853b-9528abe1023e',
    'new_registration',
    'Nouvelle inscription',
    'Ben Mvouama s''est inscrit à l''atelier créatif.',
    '11111111-1111-1111-1111-111111111111',
    false,
    NOW(),
    NOW()
  ); 
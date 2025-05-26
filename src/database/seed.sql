-- Insertion des secteurs d'activité
INSERT INTO organization_sectors (id, name) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Éducation'),
('550e8400-e29b-41d4-a716-446655440001', 'Santé'),
('550e8400-e29b-41d4-a716-446655440002', 'Environnement'),
('550e8400-e29b-41d4-a716-446655440003', 'Culture'),
('550e8400-e29b-41d4-a716-446655440004', 'Social'),
('550e8400-e29b-41d4-a716-446655440005', 'Sport'),
('550e8400-e29b-41d4-a716-446655440006', 'Humanitaire');

-- Insertion des compétences
INSERT INTO skills (id, name) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Communication'),
('660e8400-e29b-41d4-a716-446655440001', 'Gestion de projet'),
('660e8400-e29b-41d4-a716-446655440002', 'Animation'),
('660e8400-e29b-41d4-a716-446655440003', 'Informatique'),
('660e8400-e29b-41d4-a716-446655440004', 'Langues étrangères'),
('660e8400-e29b-41d4-a716-446655440005', 'Premiers secours'),
('660e8400-e29b-41d4-a716-446655440006', 'Médiation'),
('660e8400-e29b-41d4-a716-446655440007', 'Éducation'),
('660e8400-e29b-41d4-a716-446655440008', 'Marketing'),
('660e8400-e29b-41d4-a716-446655440009', 'Comptabilité');

-- Insertion des villes
INSERT INTO cities (id, name, postal_code) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'Paris', '75000'),
('770e8400-e29b-41d4-a716-446655440001', 'Lyon', '69000'),
('770e8400-e29b-41d4-a716-446655440002', 'Marseille', '13000'),
('770e8400-e29b-41d4-a716-446655440003', 'Bordeaux', '33000'),
('770e8400-e29b-41d4-a716-446655440004', 'Lille', '59000'),
('770e8400-e29b-41d4-a716-446655440005', 'Toulouse', '31000'),
('770e8400-e29b-41d4-a716-446655440006', 'Nantes', '44000'),
('770e8400-e29b-41d4-a716-446655440007', 'Strasbourg', '67000');

-- Insertion des associations de test
INSERT INTO profiles (id, first_name, last_name, email, is_association, is_organization, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'Association Sportive', 'Paris', 'sport@paris.fr', true, true, NOW()),
('880e8400-e29b-41d4-a716-446655440001', 'École de Musique', 'Lyon', 'musique@lyon.fr', true, true, NOW()),
('880e8400-e29b-41d4-a716-446655440002', 'Protection Animale', 'Marseille', 'animaux@marseille.fr', true, true, NOW());

-- Insertion des données des associations
INSERT INTO organization_data (profile_id, organization_name, description, website_url, phone, sector_id) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'Association Sportive Paris', 'Promotion du sport pour tous à Paris', 'https://sport-paris.fr', '0123456789', '550e8400-e29b-41d4-a716-446655440005'),
('880e8400-e29b-41d4-a716-446655440001', 'École de Musique Lyon', 'École de musique pour tous les niveaux', 'https://musique-lyon.fr', '0123456788', '550e8400-e29b-41d4-a716-446655440003'),
('880e8400-e29b-41d4-a716-446655440002', 'Protection Animale Marseille', 'Protection et adoption des animaux abandonnés', 'https://animaux-marseille.fr', '0123456787', '550e8400-e29b-41d4-a716-446655440002');

-- Insertion des bénévoles de test
INSERT INTO profiles (id, first_name, last_name, email, bio, location, is_association, is_organization, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440000', 'Jean', 'Dupont', 'jean.dupont@email.fr', 'Passionné de sport et d''animation', 'Paris', false, false, NOW()),
('990e8400-e29b-41d4-a716-446655440001', 'Marie', 'Martin', 'marie.martin@email.fr', 'Éducatrice spécialisée avec 10 ans d''expérience', 'Lyon', false, false, NOW()),
('990e8400-e29b-41d4-a716-446655440002', 'Pierre', 'Durand', 'pierre.durand@email.fr', 'Ingénieur informatique, bénévole depuis 5 ans', 'Marseille', false, false, NOW());

-- Insertion des compétences des bénévoles
INSERT INTO volunteer_skills (profile_id, skill_id) VALUES
('990e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000'), -- Jean Dupont - Communication
('990e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002'), -- Jean Dupont - Animation
('990e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440005'), -- Jean Dupont - Premiers secours
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000'), -- Marie Martin - Communication
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440007'), -- Marie Martin - Éducation
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440006'), -- Marie Martin - Médiation
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003'), -- Pierre Durand - Informatique
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'), -- Pierre Durand - Gestion de projet
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440008'); -- Pierre Durand - Marketing

-- Insertion des missions de test
INSERT INTO missions (id, title, description, organization_id, status, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'Animation sportive', 'Animation d''activités sportives pour enfants', '880e8400-e29b-41d4-a716-446655440000', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440001', 'Cours de piano', 'Donner des cours de piano débutant', '880e8400-e29b-41d4-a716-446655440001', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', 'Soins aux animaux', 'Aide aux soins des animaux du refuge', '880e8400-e29b-41d4-a716-446655440002', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', 'Tournoi de football', 'Organisation d''un tournoi de football pour jeunes', '880e8400-e29b-41d4-a716-446655440000', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440004', 'Cours de guitare', 'Enseignement de la guitare pour débutants', '880e8400-e29b-41d4-a716-446655440001', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', 'Promenade des chiens', 'Promenade quotidienne des chiens du refuge', '880e8400-e29b-41d4-a716-446655440002', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', 'Entraînement basket', 'Encadrement d''une séance d''entraînement de basket', '880e8400-e29b-41d4-a716-446655440000', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440007', 'Concert caritatif', 'Organisation d''un concert pour financer les activités', '880e8400-e29b-41d4-a716-446655440001', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440008', 'Nettoyage du refuge', 'Aide au nettoyage et à l''entretien des locaux', '880e8400-e29b-41d4-a716-446655440002', 'open', NOW()),
('aa0e8400-e29b-41d4-a716-446655440009', 'Stage multisports', 'Animation d''un stage multisports pendant les vacances', '880e8400-e29b-41d4-a716-446655440000', 'open', NOW());

-- Insertion des compétences requises pour les missions
INSERT INTO mission_skills (mission_id, skill_id) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002'), -- Animation sportive - Animation
('aa0e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440005'), -- Animation sportive - Premiers secours
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440007'), -- Cours de piano - Éducation
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005'), -- Soins aux animaux - Premiers secours
('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001'), -- Tournoi de football - Gestion de projet
('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002'), -- Tournoi de football - Animation
('aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440007'), -- Cours de guitare - Éducation
('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005'), -- Promenade des chiens - Premiers secours
('aa0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002'), -- Entraînement basket - Animation
('aa0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440001'), -- Concert caritatif - Gestion de projet
('aa0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440008'), -- Concert caritatif - Marketing
('aa0e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440000'), -- Nettoyage du refuge - Communication
('aa0e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440002'), -- Stage multisports - Animation
('aa0e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440005'); -- Stage multisports - Premiers secours

-- Insertion des candidatures de test
INSERT INTO mission_applications (mission_id, volunteer_id, status, created_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 'pending', NOW()),
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'accepted', NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'pending', NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440000', 'accepted', NOW()),
('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001', 'pending', NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440002', 'accepted', NOW());

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
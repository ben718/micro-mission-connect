-- Insertion des secteurs d'activité
INSERT INTO organization_sectors (id, name) VALUES
(1, 'Éducation'),
(2, 'Santé'),
(3, 'Environnement'),
(4, 'Culture'),
(5, 'Social'),
(6, 'Sport'),
(7, 'Humanitaire');

-- Insertion des compétences
INSERT INTO skills (id, name) VALUES
(1, 'Communication'),
(2, 'Gestion de projet'),
(3, 'Animation'),
(4, 'Informatique'),
(5, 'Langues étrangères'),
(6, 'Premiers secours'),
(7, 'Médiation'),
(8, 'Éducation'),
(9, 'Marketing'),
(10, 'Comptabilité');

-- Insertion des villes
INSERT INTO cities (id, name, postal_code) VALUES
(1, 'Paris', '75000'),
(2, 'Lyon', '69000'),
(3, 'Marseille', '13000'),
(4, 'Bordeaux', '33000'),
(5, 'Lille', '59000'),
(6, 'Toulouse', '31000'),
(7, 'Nantes', '44000'),
(8, 'Strasbourg', '67000');

-- Insertion des associations de test
INSERT INTO profiles (id, first_name, last_name, email, is_association, is_organization, created_at) VALUES
('asso1', 'Association Sportive', 'Paris', 'sport@paris.fr', true, true, NOW()),
('asso2', 'École de Musique', 'Lyon', 'musique@lyon.fr', true, true, NOW()),
('asso3', 'Protection Animale', 'Marseille', 'animaux@marseille.fr', true, true, NOW());

-- Insertion des données des associations
INSERT INTO organization_data (profile_id, organization_name, description, website_url, phone, sector_id) VALUES
('asso1', 'Association Sportive Paris', 'Promotion du sport pour tous à Paris', 'https://sport-paris.fr', '0123456789', 6),
('asso2', 'École de Musique Lyon', 'École de musique pour tous les niveaux', 'https://musique-lyon.fr', '0123456788', 4),
('asso3', 'Protection Animale Marseille', 'Protection et adoption des animaux abandonnés', 'https://animaux-marseille.fr', '0123456787', 3);

-- Insertion des bénévoles de test
INSERT INTO profiles (id, first_name, last_name, email, bio, location, is_association, is_organization, created_at) VALUES
('bene1', 'Jean', 'Dupont', 'jean.dupont@email.fr', 'Passionné de sport et d''animation', 'Paris', false, false, NOW()),
('bene2', 'Marie', 'Martin', 'marie.martin@email.fr', 'Éducatrice spécialisée avec 10 ans d''expérience', 'Lyon', false, false, NOW()),
('bene3', 'Pierre', 'Durand', 'pierre.durand@email.fr', 'Ingénieur informatique, bénévole depuis 5 ans', 'Marseille', false, false, NOW());

-- Insertion des compétences des bénévoles
INSERT INTO volunteer_skills (profile_id, skill_id) VALUES
('bene1', 1), -- Jean Dupont - Communication
('bene1', 3), -- Jean Dupont - Animation
('bene1', 6), -- Jean Dupont - Premiers secours
('bene2', 1), -- Marie Martin - Communication
('bene2', 8), -- Marie Martin - Éducation
('bene2', 7), -- Marie Martin - Médiation
('bene3', 4), -- Pierre Durand - Informatique
('bene3', 2), -- Pierre Durand - Gestion de projet
('bene3', 9); -- Pierre Durand - Marketing

-- Insertion des missions de test
INSERT INTO missions (id, title, description, organization_id, status, created_at) VALUES
(1, 'Animation sportive', 'Animation d''activités sportives pour enfants', 'asso1', 'open', NOW()),
(2, 'Cours de piano', 'Donner des cours de piano débutant', 'asso2', 'open', NOW()),
(3, 'Soins aux animaux', 'Aide aux soins des animaux du refuge', 'asso3', 'open', NOW()),
(4, 'Tournoi de football', 'Organisation d''un tournoi de football pour jeunes', 'asso1', 'open', NOW()),
(5, 'Cours de guitare', 'Enseignement de la guitare pour débutants', 'asso2', 'open', NOW()),
(6, 'Promenade des chiens', 'Promenade quotidienne des chiens du refuge', 'asso3', 'open', NOW()),
(7, 'Entraînement basket', 'Encadrement d''une séance d''entraînement de basket', 'asso1', 'open', NOW()),
(8, 'Concert caritatif', 'Organisation d''un concert pour financer les activités', 'asso2', 'open', NOW()),
(9, 'Nettoyage du refuge', 'Aide au nettoyage et à l''entretien des locaux', 'asso3', 'open', NOW()),
(10, 'Stage multisports', 'Animation d''un stage multisports pendant les vacances', 'asso1', 'open', NOW());

-- Insertion des compétences requises pour les missions
INSERT INTO mission_skills (mission_id, skill_id) VALUES
(1, 3), -- Animation sportive - Animation
(1, 6), -- Animation sportive - Premiers secours
(2, 8), -- Cours de piano - Éducation
(3, 6), -- Soins aux animaux - Premiers secours
(4, 2), -- Tournoi de football - Gestion de projet
(4, 3), -- Tournoi de football - Animation
(5, 8), -- Cours de guitare - Éducation
(6, 6), -- Promenade des chiens - Premiers secours
(7, 3), -- Entraînement basket - Animation
(8, 2), -- Concert caritatif - Gestion de projet
(8, 9), -- Concert caritatif - Marketing
(9, 1), -- Nettoyage du refuge - Communication
(10, 3), -- Stage multisports - Animation
(10, 6); -- Stage multisports - Premiers secours

-- Insertion des candidatures de test
INSERT INTO mission_applications (mission_id, volunteer_id, status, created_at) VALUES
(1, 'bene1', 'pending', NOW()),
(2, 'bene2', 'accepted', NOW()),
(3, 'bene3', 'pending', NOW()),
(4, 'bene1', 'accepted', NOW()),
(5, 'bene2', 'pending', NOW()),
(6, 'bene3', 'accepted', NOW());

-- Insertion des disponibilités des missions
INSERT INTO mission_availability (mission_id, day_of_week, start_time, end_time) VALUES
(1, 'monday', '14:00', '16:00'),
(1, 'wednesday', '14:00', '16:00'),
(2, 'tuesday', '17:00', '19:00'),
(2, 'thursday', '17:00', '19:00'),
(3, 'monday', '09:00', '12:00'),
(3, 'wednesday', '09:00', '12:00'),
(3, 'friday', '09:00', '12:00'),
(4, 'saturday', '10:00', '18:00'),
(5, 'monday', '18:00', '20:00'),
(5, 'wednesday', '18:00', '20:00'),
(6, 'tuesday', '14:00', '16:00'),
(6, 'thursday', '14:00', '16:00'),
(7, 'friday', '17:00', '19:00'),
(8, 'saturday', '19:00', '23:00'),
(9, 'monday', '10:00', '12:00'),
(9, 'wednesday', '10:00', '12:00'),
(10, 'monday', '09:00', '17:00'),
(10, 'tuesday', '09:00', '17:00'),
(10, 'wednesday', '09:00', '17:00'),
(10, 'thursday', '09:00', '17:00'),
(10, 'friday', '09:00', '17:00'); 
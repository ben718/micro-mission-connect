
-- Création d'une table pour les profils utilisateurs
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_association BOOLEAN DEFAULT false NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Création d'une table pour les badges/compétences
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Création d'une table pour associer les badges aux utilisateurs
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Création d'une table pour les missions
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  association_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  duration_minutes INTEGER NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  spots_available INTEGER NOT NULL DEFAULT 1,
  spots_taken INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'completed', 'cancelled')),
  skills_required TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Création d'une table pour les inscriptions aux missions
CREATE TABLE public.mission_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'completed', 'cancelled')),
  feedback TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (mission_id, user_id)
);
ALTER TABLE public.mission_participants ENABLE ROW LEVEL SECURITY;

-- Création d'une table pour les catégories de missions
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Création d'une table pour associer les missions aux catégories
CREATE TABLE public.mission_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (mission_id, category_id)
);
ALTER TABLE public.mission_categories ENABLE ROW LEVEL SECURITY;

-- Création d'une fonction pour mettre à jour la colonne updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création des triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_missions_updated_at
BEFORE UPDATE ON public.missions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_mission_participants_updated_at
BEFORE UPDATE ON public.mission_participants
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Création d'une fonction pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, is_association)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name', 
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_association')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer un profil lors de la création d'un utilisateur
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Création d'une fonction pour mettre à jour le compteur de places prises
CREATE OR REPLACE FUNCTION public.update_mission_spots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
    UPDATE public.missions
    SET spots_taken = spots_taken + 1
    WHERE id = NEW.mission_id;
    
    -- Si toutes les places sont prises, mettre à jour le statut de la mission
    UPDATE public.missions
    SET status = 'filled'
    WHERE id = NEW.mission_id AND spots_taken >= spots_available;
  ELSIF TG_OP = 'DELETE' AND OLD.status IN ('registered', 'confirmed') THEN
    UPDATE public.missions
    SET 
      spots_taken = GREATEST(spots_taken - 1, 0),
      status = CASE 
        WHEN status = 'filled' THEN 'open'
        ELSE status
      END
    WHERE id = OLD.mission_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status IN ('registered', 'confirmed') AND NEW.status = 'cancelled' THEN
    UPDATE public.missions
    SET 
      spots_taken = GREATEST(spots_taken - 1, 0),
      status = CASE 
        WHEN status = 'filled' THEN 'open'
        ELSE status
      END
    WHERE id = NEW.mission_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour le nombre de places prises
CREATE TRIGGER on_mission_participant_change
AFTER INSERT OR UPDATE OR DELETE ON public.mission_participants
FOR EACH ROW EXECUTE FUNCTION public.update_mission_spots();

-- Politiques de sécurité RLS
-- Tout le monde peut voir les profils publics
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Un utilisateur peut modifier son propre profil
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Tout le monde peut voir les badges
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges FOR SELECT 
USING (true);

-- Les administrateurs peuvent gérer les badges (exemple, à adapter selon votre logique d'administration)
CREATE POLICY "Administrators can manage badges" 
ON public.badges FOR ALL 
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE is_association = true
));

-- Tout le monde peut voir les badges des utilisateurs
CREATE POLICY "User badges are viewable by everyone" 
ON public.user_badges FOR SELECT 
USING (true);

-- Les administrateurs peuvent attribuer des badges
CREATE POLICY "Administrators can manage user badges" 
ON public.user_badges FOR ALL 
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE is_association = true
));

-- Tout le monde peut voir les missions
CREATE POLICY "Missions are viewable by everyone" 
ON public.missions FOR SELECT 
USING (true);

-- Les associations peuvent créer et gérer leurs propres missions
CREATE POLICY "Associations can create missions" 
ON public.missions FOR INSERT 
WITH CHECK (auth.uid() = association_id AND (
  SELECT is_association FROM public.profiles WHERE id = auth.uid()
) = true);

CREATE POLICY "Associations can update their own missions" 
ON public.missions FOR UPDATE 
USING (auth.uid() = association_id);

CREATE POLICY "Associations can delete their own missions" 
ON public.missions FOR DELETE 
USING (auth.uid() = association_id);

-- Tout le monde peut voir les inscriptions aux missions
CREATE POLICY "Mission participants are viewable by everyone" 
ON public.mission_participants FOR SELECT 
USING (true);

-- Les utilisateurs peuvent s'inscrire aux missions
CREATE POLICY "Users can register for missions" 
ON public.mission_participants FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour ou annuler leur propre inscription
CREATE POLICY "Users can update their own registration" 
ON public.mission_participants FOR UPDATE 
USING (auth.uid() = user_id);

-- Les associations peuvent mettre à jour le statut des participants à leurs missions
CREATE POLICY "Associations can update participant status" 
ON public.mission_participants FOR UPDATE 
USING (auth.uid() IN (
  SELECT association_id FROM public.missions WHERE id = mission_id
));

-- Tout le monde peut voir les catégories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

-- Les administrateurs peuvent gérer les catégories
CREATE POLICY "Administrators can manage categories" 
ON public.categories FOR ALL 
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE is_association = true
));

-- Tout le monde peut voir les associations mission-catégorie
CREATE POLICY "Mission categories are viewable by everyone" 
ON public.mission_categories FOR SELECT 
USING (true);

-- Les associations peuvent gérer les catégories de leurs missions
CREATE POLICY "Associations can manage mission categories" 
ON public.mission_categories FOR ALL 
USING (auth.uid() IN (
  SELECT association_id FROM public.missions WHERE id = mission_id
));

-- Insertion de données de test pour les badges
INSERT INTO public.badges (name, description, icon) VALUES
('Premier pas', 'A complété sa première mission', 'award'),
('Humanitaire', 'A participé à une mission humanitaire', 'heart'),
('Environnement', 'A contribué à une mission environnementale', 'leaf'),
('Social', 'A aidé lors d''une mission sociale', 'users'),
('Éducation', 'A soutenu une mission éducative', 'book'),
('Super Bénévole', 'A complété plus de 10 missions', 'star');

-- Insertion de données de test pour les catégories
INSERT INTO public.categories (name, description, icon) VALUES
('Humanitaire', 'Actions d''aide aux personnes en difficulté', 'heart'),
('Environnement', 'Protection de la nature et développement durable', 'leaf'),
('Social', 'Aide aux personnes en situation d''exclusion', 'users'),
('Éducation', 'Soutien scolaire et formation', 'book'),
('Santé', 'Assistance médicale et prévention', 'activity'),
('Culture', 'Promotion de l''art et de la culture', 'music'),
('Sport', 'Activités sportives et loisirs', 'zap'),
('Animaux', 'Protection et soins aux animaux', 'github');

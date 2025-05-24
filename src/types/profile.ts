
export interface Profile {
  id?: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  
  // Propriétés calculées pour la compatibilité avec le code existant
  avatar_url?: string; // Alias pour profile_picture_url
  is_association?: boolean; // Calculé à partir des organization_profiles
  location?: string; // Calculé à partir de city
  role?: string; // 'association' ou 'volunteer' calculé à partir de is_association
  badges?: string[]; // Pour la compatibilité avec UserProfile
  email?: string; // Pour la compatibilité avec useAuth
  bio?: string; // Ajouté pour compatibilité
  skills?: string[]; // Ajouté pour compatibilité
}

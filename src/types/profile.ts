
export interface Profile {
  id?: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  is_association: boolean;
  association_description?: string;
  website?: string;
  skills?: string[];
  categories?: string[];
  
  // Propriétés synthétiques pour la compatibilité avec le code existant
  name?: string; // Calculé à partir de first_name + last_name
  role?: string; // 'association' ou 'benevole' calculé à partir de is_association
  avatar?: string; // Alias pour avatar_url
  badges?: string[]; // Pour la compatibilité avec UserProfile
  email?: string; // Pour la compatibilité avec useAuth
}

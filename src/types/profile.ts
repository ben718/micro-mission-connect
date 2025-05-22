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
} 
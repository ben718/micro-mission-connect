
// Types pour l'application
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'volunteer' | 'association';
  languages?: string[];
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Association {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  siret?: string;
  category?: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  social_media?: Record<string, any>;
  contact_name: string;
  contact_role: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
  notification_preferences?: Record<string, any>;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  short_description: string;
  association_id: string;
  association_name: string;
  association_logo?: string;
  category: string;
  image_url?: string;
  address: string;
  city: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  date: string;
  time_start: string;
  time_end: string;
  duration: number;
  spots: {
    available: number;
    taken: number;
  };
  spots_available: number;
  spots_taken: number;
  skills_required?: string[];
  languages_needed?: string[];
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  is_recurring: boolean;
  recurrence_pattern?: any;
  created_at: string;
  updated_at: string;
  registration_status?: string;
  requirements?: string[];
  impact?: string;
  timing?: string;
  distance?: number;
  location?: {
    address: string;
    city: string;
    postal_code: string;
  };
  organization?: string;
}

export interface MissionFilters {
  timing: string | null;
  duration: number | null;
  category: string | null;
  distance: number | null;
}

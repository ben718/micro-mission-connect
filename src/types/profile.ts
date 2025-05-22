export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'benevole' | 'association';
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  badges?: string[];
  skills?: string[];
  createdAt: string;
  updatedAt: string;
} 
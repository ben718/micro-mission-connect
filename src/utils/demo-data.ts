
import { MissionWithDetails } from "@/types/mission";

// Cette fonction vérifie si l'application est en mode démo
export function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO_MODE === "true" || 
         !import.meta.env.VITE_SUPABASE_URL || 
         import.meta.env.VITE_SUPABASE_URL === "your_supabase_url_here";
}

// Plus de données de démo - tout provient maintenant de la base de données
export const DEMO_MISSIONS: Partial<MissionWithDetails>[] = [];
export const DEMO_ORGANIZATIONS = [];


import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { envValidator } from '@/utils/envValidation';

// Valider la configuration avant de créer le client
let supabaseUrl: string;
let supabaseAnonKey: string;

try {
  const config = envValidator.getConfig();
  supabaseUrl = config.VITE_SUPABASE_URL;
  supabaseAnonKey = config.VITE_SUPABASE_ANON_KEY;
  
  // Log du statut de validation en développement
  if (import.meta.env.DEV) {
    envValidator.logValidationStatus();
  }
} catch (error) {
  console.error('❌ Erreur de configuration Supabase:', error);
  
  // En mode développement, fournir des instructions détaillées
  if (import.meta.env.DEV) {
    console.error(`
🔧 Pour configurer Supabase:
1. Copiez .env.example vers .env
2. Ajoutez vos clés Supabase dans .env
3. Redémarrez le serveur de développement

📚 Documentation: https://supabase.com/docs/guides/getting-started
    `);
  }
  
  throw error;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Vérification de la connexion en développement
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state changed:', event, session?.user?.email || 'No user');
  });
}

import { createClient } from '@supabase/supabase-js';
import { mappers, type SupabaseData } from './mappers';

// Configuration Supabase
const supabaseUrl = 'https://uqpcjxpbxnbrbjefkwar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcGNqeHBieG5icmJqZWZrd2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDQ2ODMsImV4cCI6MjA2NDY4MDY4M30.DBtB4CcgKmW4BKee70uPKlfZBGssxSXrYCzTb3UOrOg';

// Client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Service d'authentification
export const authService = {
  // Connexion
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Récupérer le profil complet
    let profile;
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      profile = mappers.userMapper(profileData);
    }
    
    return {
      user: profile,
      session: data.session
    };
  },
  
  // Inscription bénévole
  signUpVolunteer: async (email: string, password: string, firstName: string, lastName: string, languages?: string[]) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'volunteer',
          languages: languages || []
        }
      }
    });
    
    if (error) throw error;
    
    return {
      user: data.user ? mappers.userMapper({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
        role: 'volunteer',
        languages: languages || []
      }) : null,
      session: data.session
    };
  },
  
  // Inscription association
  signUpAssociation: async (
    email: string, 
    password: string, 
    associationName: string,
    siret: string,
    description: string,
    address: string,
    city: string,
    postalCode: string,
    phone: string,
    category: string,
    contactName: string,
    contactRole: string,
    contactEmail?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          association_name: associationName,
          role: 'association',
          contact_name: contactName,
          contact_role: contactRole
        }
      }
    });
    
    if (error) throw error;
    
    // Créer le profil association
    if (data.user) {
      const { error: profileError } = await supabase
        .from('associations')
        .insert({
          id: data.user.id,
          name: associationName,
          siret: siret,
          description: description,
          address: address,
          city: city,
          postal_code: postalCode,
          phone: phone,
          category: category,
          contact_name: contactName,
          contact_role: contactRole,
          contact_email: contactEmail || email
        });
      
      if (profileError) throw profileError;
    }
    
    return {
      user: data.user ? mappers.associationMapper({
        id: data.user.id,
        name: associationName,
        siret: siret,
        description: description,
        address: address,
        city: city,
        postal_code: postalCode,
        phone: phone,
        category: category,
        contact_name: contactName,
        contact_role: contactRole,
        contact_email: contactEmail || email,
        role: 'association'
      }) : null,
      session: data.session
    };
  },
  
  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Récupérer la session courante
  getCurrentSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  // Récupérer l'utilisateur courant
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (!data.user) return null;
    
    // Déterminer le type d'utilisateur
    const role = data.user.user_metadata.role || 'volunteer';
    
    if (role === 'volunteer') {
      // Récupérer le profil bénévole
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return mappers.userMapper(profileData);
    } else {
      // Récupérer le profil association
      const { data: associationData } = await supabase
        .from('associations')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return mappers.associationMapper(associationData);
    }
  }
};

// Service de gestion des missions
export const missionService = {
  // Récupérer toutes les missions publiées
  getPublishedMissions: async () => {
    const { data, error } = await supabase
      .from('missions_view')
      .select('*')
      .eq('status', 'published')
      .order('date_start', { ascending: true });
    
    if (error) throw error;
    
    return data.map(mission => mappers.missionMapper(mission));
  },
  
  // Récupérer les missions d'un bénévole
  getVolunteerMissions: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .from('volunteer_missions_view')
      .select('*')
      .eq('volunteer_id', userData.user.id)
      .order('date_start', { ascending: true });
    
    if (error) throw error;
    
    return data.map(mission => mappers.missionMapper(mission));
  },
  
  // Récupérer une mission par son ID
  getMissionById: async (id: string) => {
    const { data, error } = await supabase
      .from('missions_view')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return mappers.missionMapper(data);
  },
  
  // S'inscrire à une mission
  registerForMission: async (missionId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .rpc('register_for_mission', {
        p_mission_id: missionId,
        p_volunteer_id: userData.user.id
      });
    
    if (error) throw error;
    
    return { success: true };
  },
  
  // Annuler une inscription à une mission
  cancelRegistration: async (missionId: string, reason?: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .rpc('cancel_mission_registration', {
        p_mission_id: missionId,
        p_volunteer_id: userData.user.id,
        p_reason: reason || null
      });
    
    if (error) throw error;
    
    return { success: true };
  }
};

// Service de gestion des langues
export const languageService = {
  // Ajouter une langue au profil
  addLanguage: async (languageCode: string, level: string = 'intermédiaire', isPrimary: boolean = false) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .rpc('add_language_to_profile', {
        p_language_code: languageCode,
        p_level: level,
        p_is_primary: isPrimary
      });
    
    if (error) throw error;
    
    return { success: true };
  },
  
  // Supprimer une langue du profil
  removeLanguage: async (languageCode: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .rpc('remove_language_from_profile', {
        p_language_code: languageCode
      });
    
    if (error) throw error;
    
    return { success: true };
  },
  
  // Récupérer les langues d'un utilisateur
  getUserLanguages: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .from('language_levels')
      .select('*')
      .eq('user_id', userData.user.id);
    
    if (error) throw error;
    
    return data;
  }
};

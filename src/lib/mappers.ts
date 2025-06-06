
// Types génériques pour les données Supabase
export type SupabaseData = Record<string, any> | null;

// Adaptateurs pour convertir les données Supabase en types frontend
export const mappers = {
  // Convertir les données de mission Supabase en type Mission frontend
  missionMapper: (data: SupabaseData): SupabaseData => {
    if (!data) return null;
    
    return {
      id: data.id || '',
      title: data.title || '',
      description: data.description || '',
      short_description: data.short_description || '',
      association_id: data.association_id || '',
      association_name: data.association_name || '',
      association_logo: data.association_logo,
      category: data.category || '',
      image_url: data.image_url,
      address: data.address || '',
      city: data.city || '',
      postal_code: data.postal_code || '',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      date_start: data.date_start || '',
      date_end: data.date_end || '',
      time_commitment: data.time_commitment || '',
      spots_available: data.spots_available || 0,
      spots_taken: data.spots_taken || 0,
      skills_required: data.skills_required || [],
      languages_needed: data.languages_needed || [],
      status: data.status || 'draft',
      is_recurring: data.is_recurring || false,
      recurrence_pattern: data.recurrence_pattern || null,
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      registration_status: data.registration_status || null
    };
  },
  
  // Convertir les données de profil Supabase en type User frontend
  userMapper: (data: SupabaseData): SupabaseData => {
    if (!data) return null;
    
    return {
      id: data.id || '',
      email: data.email || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      avatar: data.avatar_url,
      role: data.role || 'volunteer',
      languages: data.languages || [],
      bio: data.bio || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      postal_code: data.postal_code || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || ''
    };
  },
  
  // Convertir les données d'association Supabase en type Association frontend
  associationMapper: (data: SupabaseData): SupabaseData => {
    if (!data) return null;
    
    return {
      id: data.id || '',
      name: data.name || '',
      description: data.description || '',
      logo: data.logo_url,
      siret: data.siret || '',
      category: data.category || '',
      address: data.address || '',
      city: data.city || '',
      postal_code: data.postal_code || '',
      phone: data.phone || '',
      email: data.email || '',
      website: data.website || '',
      social_media: data.social_media || {},
      contact_name: data.contact_name || '',
      contact_role: data.contact_role || '',
      contact_email: data.contact_email || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      notification_preferences: data.notification_preferences || {}
    };
  }
};

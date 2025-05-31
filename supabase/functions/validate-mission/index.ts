
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface MissionValidationRequest {
  title: string;
  description: string;
  start_date: string;
  duration_minutes: number;
  location: string;
  available_spots: number;
  format: string;
  difficulty_level: string;
  engagement_level: string;
  organization_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: MissionValidationRequest = await req.json()

    // Validation robuste côté serveur
    const validationErrors: string[] = []

    // Titre
    if (!body.title || body.title.trim().length < 3) {
      validationErrors.push('Le titre doit contenir au moins 3 caractères')
    }
    if (body.title && body.title.length > 100) {
      validationErrors.push('Le titre ne peut pas dépasser 100 caractères')
    }

    // Description
    if (!body.description || body.description.trim().length < 10) {
      validationErrors.push('La description doit contenir au moins 10 caractères')
    }
    if (body.description && body.description.length > 2000) {
      validationErrors.push('La description ne peut pas dépasser 2000 caractères')
    }

    // Date de début
    const startDate = new Date(body.start_date)
    const now = new Date()
    if (isNaN(startDate.getTime())) {
      validationErrors.push('Date de début invalide')
    } else if (startDate < now) {
      validationErrors.push('La date de début ne peut pas être dans le passé')
    }

    // Durée
    if (!body.duration_minutes || body.duration_minutes < 15) {
      validationErrors.push('La durée minimum est de 15 minutes')
    }
    if (body.duration_minutes > 1440) { // 24 heures
      validationErrors.push('La durée maximum est de 24 heures')
    }

    // Lieu
    if (!body.location || body.location.trim().length < 2) {
      validationErrors.push('Le lieu est requis (minimum 2 caractères)')
    }

    // Places disponibles
    if (!body.available_spots || body.available_spots < 1) {
      validationErrors.push('Au moins une place doit être disponible')
    }
    if (body.available_spots > 1000) {
      validationErrors.push('Le nombre de places ne peut pas dépasser 1000')
    }

    // Format
    const validFormats = ['remote', 'hybrid', 'onsite']
    if (!validFormats.includes(body.format)) {
      validationErrors.push('Format invalide')
    }

    // Niveau de difficulté
    const validDifficulties = ['beginner', 'intermediate', 'advanced']
    if (!validDifficulties.includes(body.difficulty_level)) {
      validationErrors.push('Niveau de difficulté invalide')
    }

    // Niveau d'engagement
    const validEngagements = ['low', 'medium', 'high']
    if (!validEngagements.includes(body.engagement_level)) {
      validationErrors.push('Niveau d\'engagement invalide')
    }

    // Vérifier que l'organisation appartient à l'utilisateur
    const { data: orgProfile, error: orgError } = await supabase
      .from('organization_profiles')
      .select('id')
      .eq('id', body.organization_id)
      .eq('user_id', user.id)
      .single()

    if (orgError || !orgProfile) {
      validationErrors.push('Organisation non trouvée ou non autorisée')
    }

    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validationErrors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Validation passed' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

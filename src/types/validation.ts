
import { z } from "zod";

// Types stricts pour les missions
export const MissionFormatSchema = z.enum(['remote', 'hybrid', 'onsite']);
export const DifficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
export const EngagementLevelSchema = z.enum(['low', 'medium', 'high']);
export const MissionStatusSchema = z.enum(['active', 'inactive', 'completed', 'cancelled']);

// Schema complet pour les missions
export const MissionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères").max(100),
  description: z.string().min(10, "La description doit faire au moins 10 caractères").max(2000),
  location: z.string().min(2, "Le lieu doit faire au moins 2 caractères"),
  start_date: z.string().datetime(),
  duration_minutes: z.number().min(15, "Durée minimum 15 minutes").max(1440, "Durée maximum 24h"),
  available_spots: z.number().min(1, "Minimum 1 place").max(1000, "Maximum 1000 places"),
  format: MissionFormatSchema,
  difficulty_level: DifficultyLevelSchema,
  engagement_level: EngagementLevelSchema,
  status: MissionStatusSchema.optional().default('active'),
  organization_id: z.string().uuid(),
  mission_type_id: z.string().uuid().optional(),
  image_url: z.string().url().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  desired_impact: z.string().optional(),
  end_date: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Types pour les profils utilisateur
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1, "Le prénom est requis").optional(),
  last_name: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{8})$/, "Numéro de téléphone invalide").optional(),
  bio: z.string().max(500, "Bio trop longue").optional(),
  website: z.string().url("URL invalide").optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  address: z.string().optional(),
  profile_picture_url: z.string().url("URL d'image invalide").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  last_login: z.string().datetime().optional()
});

// Types pour les inscriptions
export const MissionRegistrationSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  mission_id: z.string().uuid(),
  status: z.enum(['inscrit', 'confirmé', 'annulé', 'terminé']).default('inscrit'),
  registration_date: z.string().datetime().optional(),
  confirmation_date: z.string().datetime().optional(),
  volunteer_rating: z.number().min(1).max(5).optional(),
  organization_rating: z.number().min(1).max(5).optional(),
  volunteer_feedback: z.string().max(1000).optional(),
  organization_feedback: z.string().max(1000).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Fonction utilitaire pour valider les données
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation error']
    };
  }
}

// Types dérivés pour TypeScript
export type Mission = z.infer<typeof MissionSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type MissionRegistration = z.infer<typeof MissionRegistrationSchema>;
export type MissionFormat = z.infer<typeof MissionFormatSchema>;
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;
export type EngagementLevel = z.infer<typeof EngagementLevelSchema>;
export type MissionStatus = z.infer<typeof MissionStatusSchema>;

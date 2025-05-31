
import { z } from "zod";

// Validation schemas
export const profileSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  address: z.string().optional(),
  profile_picture_url: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal(""))
});

export const missionSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  location: z.string().min(1, "Le lieu est requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  duration_minutes: z.number().min(15, "La durée minimum est 15 minutes"),
  available_spots: z.number().min(1, "Au moins une place est requise"),
  format: z.enum(["Présentiel", "À distance", "Hybride"]),
  difficulty_level: z.enum(["débutant", "intermédiaire", "expert"]),
  engagement_level: z.enum(["Ultra-rapide", "Petit coup de main", "Mission avec suivi", "Projet long"])
});

export const organizationSchema = z.object({
  organization_name: z.string().min(1, "Le nom de l'organisation est requis"),
  description: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  sector_id: z.string().uuid("Secteur invalide")
});

// Validation helpers
export function validateProfile(data: any) {
  return profileSchema.safeParse(data);
}

export function validateMission(data: any) {
  return missionSchema.safeParse(data);
}

export function validateOrganization(data: any) {
  return organizationSchema.safeParse(data);
}

// Individual validation functions for forms
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? undefined : "Format d'email invalide"
  };
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins 6 caractères"
    };
  }
  return { isValid: true };
}

export function validateWebsite(url: string): boolean {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateRequired(value: string): boolean {
  return value && value.trim().length > 0;
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value && value.length >= minLength;
}

// Type guards
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

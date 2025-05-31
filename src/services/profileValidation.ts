
import { supabase } from "@/integrations/supabase/client";
import { validateData, ProfileSchema } from "@/types/validation";

export interface ProfileCompletionStatus {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  recommendations: string[];
}

export class ProfileValidationService {
  private static instance: ProfileValidationService;

  static getInstance(): ProfileValidationService {
    if (!ProfileValidationService.instance) {
      ProfileValidationService.instance = new ProfileValidationService();
    }
    return ProfileValidationService.instance;
  }

  async validateProfile(profileData: any): Promise<ProfileCompletionStatus> {
    const status: ProfileCompletionStatus = {
      isComplete: false,
      completionPercentage: 0,
      missingFields: [],
      recommendations: []
    };

    // Validation Zod
    const zodValidation = validateData(ProfileSchema, profileData);
    if (!zodValidation.success) {
      console.warn("Erreurs de validation:", zodValidation.errors);
    }

    // Champs obligatoires
    const requiredFields = [
      { key: 'first_name', label: 'Prénom' },
      { key: 'last_name', label: 'Nom' },
      { key: 'email', label: 'Email' }
    ];

    // Champs optionnels mais recommandés
    const recommendedFields = [
      { key: 'bio', label: 'Description personnelle' },
      { key: 'city', label: 'Ville' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'profile_picture_url', label: 'Photo de profil' }
    ];

    // Vérification des champs obligatoires
    let completedFields = 0;
    const totalFields = requiredFields.length + recommendedFields.length;

    requiredFields.forEach(field => {
      if (!profileData[field.key] || profileData[field.key].trim() === '') {
        status.missingFields.push(field.label);
      } else {
        completedFields++;
      }
    });

    // Vérification des champs recommandés
    recommendedFields.forEach(field => {
      if (profileData[field.key] && profileData[field.key].trim() !== '') {
        completedFields++;
      }
    });

    // Calcul du pourcentage de complétion
    status.completionPercentage = Math.round((completedFields / totalFields) * 100);
    status.isComplete = status.missingFields.length === 0 && status.completionPercentage >= 70;

    // Recommandations basées sur le profil
    await this.generateRecommendations(profileData, status);

    return status;
  }

  private async generateRecommendations(profileData: any, status: ProfileCompletionStatus): Promise<void> {
    // Recommandation photo de profil
    if (!profileData.profile_picture_url) {
      status.recommendations.push("Ajoutez une photo de profil pour humaniser votre profil");
    }

    // Recommandation bio
    if (!profileData.bio || profileData.bio.length < 50) {
      status.recommendations.push("Rédigez une description personnelle de plus de 50 caractères");
    }

    // Recommandation localisation
    if (!profileData.city) {
      status.recommendations.push("Précisez votre ville pour voir les missions locales");
    }

    // Recommandation téléphone
    if (!profileData.phone) {
      status.recommendations.push("Ajoutez votre numéro de téléphone pour faciliter le contact");
    }

    // Vérifier les compétences
    try {
      const { data: skills } = await supabase
        .from("user_skills")
        .select("id")
        .eq("user_id", profileData.id);

      if (!skills || skills.length === 0) {
        status.recommendations.push("Ajoutez vos compétences pour recevoir des missions adaptées");
      } else if (skills.length < 3) {
        status.recommendations.push("Ajoutez plus de compétences pour élargir vos opportunités");
      }
    } catch (error) {
      console.warn("Erreur lors de la vérification des compétences:", error);
    }

    // Vérifier l'historique des missions
    try {
      const { data: missions } = await supabase
        .from("mission_registrations")
        .select("id")
        .eq("user_id", profileData.id);

      if (!missions || missions.length === 0) {
        status.recommendations.push("Inscrivez-vous à votre première mission pour commencer");
      }
    } catch (error) {
      console.warn("Erreur lors de la vérification des missions:", error);
    }
  }

  async checkProfileConsistency(profileData: any): Promise<string[]> {
    const warnings: string[] = [];

    // Vérifier la cohérence des données de localisation
    if (profileData.postal_code && profileData.city) {
      // Validation basique du code postal français
      const postalCodeRegex = /^[0-9]{5}$/;
      if (!postalCodeRegex.test(profileData.postal_code)) {
        warnings.push("Le code postal ne semble pas valide");
      }
    }

    // Vérifier la cohérence de l'âge (si disponible)
    if (profileData.birth_date) {
      const birthDate = new Date(profileData.birth_date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      if (age < 16) {
        warnings.push("Les mineurs de moins de 16 ans nécessitent une autorisation parentale");
      } else if (age > 100) {
        warnings.push("Veuillez vérifier votre date de naissance");
      }
    }

    // Vérifier la qualité de la bio
    if (profileData.bio) {
      if (profileData.bio.length > 500) {
        warnings.push("La description personnelle est très longue");
      }
      
      // Détecter les textes répétitifs ou non pertinents
      const repeatedCharPattern = /(.)\1{4,}/;
      if (repeatedCharPattern.test(profileData.bio)) {
        warnings.push("La description contient des caractères répétitifs");
      }
    }

    // Vérifier l'URL du site web
    if (profileData.website) {
      try {
        new URL(profileData.website);
      } catch {
        warnings.push("L'URL du site web n'est pas valide");
      }
    }

    return warnings;
  }

  async getProfileSuggestions(userId: string): Promise<string[]> {
    const suggestions: string[] = [];

    try {
      // Analyser les missions populaires dans la région
      const { data: profile } = await supabase
        .from("profiles")
        .select("city, postal_code")
        .eq("id", userId)
        .single();

      if (profile?.city) {
        const { data: popularMissions } = await supabase
          .from("missions")
          .select("mission_type_id, count(*)")
          .ilike("location", `%${profile.city}%`)
          .eq("status", "active")
          .limit(3);

        if (popularMissions && popularMissions.length > 0) {
          suggestions.push("Des missions sont disponibles dans votre ville");
        }
      }

      // Suggérer des compétences basées sur l'activité
      const { data: userSkills } = await supabase
        .from("user_skills")
        .select("skill_id")
        .eq("user_id", userId);

      if (!userSkills || userSkills.length < 5) {
        suggestions.push("Explorez d'autres compétences à ajouter à votre profil");
      }

      // Suggérer la validation des compétences
      const { data: unvalidatedSkills } = await supabase
        .from("user_skills")
        .select("id")
        .eq("user_id", userId)
        .is("validation_date", null);

      if (unvalidatedSkills && unvalidatedSkills.length > 0) {
        suggestions.push("Faites valider vos compétences par d'autres bénévoles");
      }

    } catch (error) {
      console.warn("Erreur lors de la génération des suggestions:", error);
    }

    return suggestions;
  }
}

export const profileValidationService = ProfileValidationService.getInstance();


import { supabase } from "@/integrations/supabase/client";
import { validateData, MissionSchema } from "@/types/validation";

export interface MissionValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class MissionValidationService {
  private static instance: MissionValidationService;

  static getInstance(): MissionValidationService {
    if (!MissionValidationService.instance) {
      MissionValidationService.instance = new MissionValidationService();
    }
    return MissionValidationService.instance;
  }

  async validateMissionData(missionData: any): Promise<MissionValidationResult> {
    const result: MissionValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validation des données avec Zod
    const zodValidation = validateData(MissionSchema, missionData);
    if (!zodValidation.success) {
      result.isValid = false;
      result.errors.push(...(zodValidation.errors || []));
    }

    // Validations métier spécifiques
    await this.validateBusinessRules(missionData, result);
    await this.validateOrganizationExists(missionData.organization_id, result);
    await this.validateDateConstraints(missionData, result);
    await this.validateLocationData(missionData, result);

    return result;
  }

  private async validateBusinessRules(missionData: any, result: MissionValidationResult): Promise<void> {
    // Vérifier que la date de début est dans le futur
    if (missionData.start_date) {
      const startDate = new Date(missionData.start_date);
      const now = new Date();
      
      if (startDate <= now) {
        result.errors.push("La date de début doit être dans le futur");
        result.isValid = false;
      }

      // Vérifier que la date de fin est après la date de début
      if (missionData.end_date) {
        const endDate = new Date(missionData.end_date);
        if (endDate <= startDate) {
          result.errors.push("La date de fin doit être après la date de début");
          result.isValid = false;
        }
      }
    }

    // Vérifier la cohérence durée/dates
    if (missionData.duration_minutes && missionData.start_date && missionData.end_date) {
      const startDate = new Date(missionData.start_date);
      const endDate = new Date(missionData.end_date);
      const actualDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
      
      if (Math.abs(actualDuration - missionData.duration_minutes) > 30) {
        result.warnings.push("La durée spécifiée ne correspond pas exactement aux dates");
      }
    }

    // Vérifier le nombre de places disponibles
    if (missionData.available_spots > 1000) {
      result.warnings.push("Nombre de places très élevé - vérifiez si c'est correct");
    }
  }

  private async validateOrganizationExists(organizationId: string, result: MissionValidationResult): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, status")
        .eq("id", organizationId)
        .single();

      if (error || !data) {
        result.errors.push("Organisation introuvable");
        result.isValid = false;
        return;
      }

      if (data.status !== "active") {
        result.errors.push("Cette organisation n'est pas active");
        result.isValid = false;
      }
    } catch (error) {
      result.errors.push("Erreur lors de la vérification de l'organisation");
      result.isValid = false;
    }
  }

  private async validateDateConstraints(missionData: any, result: MissionValidationResult): Promise<void> {
    // Vérifier les conflits de dates pour l'organisation
    if (missionData.start_date && missionData.organization_id) {
      try {
        const { data, error } = await supabase
          .from("missions")
          .select("id, title, start_date, end_date")
          .eq("organization_id", missionData.organization_id)
          .eq("status", "active")
          .gte("start_date", new Date().toISOString());

        if (!error && data) {
          const startDate = new Date(missionData.start_date);
          const endDate = missionData.end_date ? new Date(missionData.end_date) : 
                         new Date(startDate.getTime() + (missionData.duration_minutes || 60) * 60000);

          const conflicts = data.filter(mission => {
            const missionStart = new Date(mission.start_date);
            const missionEnd = mission.end_date ? new Date(mission.end_date) : missionStart;
            
            return (startDate < missionEnd && endDate > missionStart);
          });

          if (conflicts.length > 0) {
            result.warnings.push(`Conflit potentiel avec ${conflicts.length} autre(s) mission(s)`);
          }
        }
      } catch (error) {
        console.warn("Erreur lors de la vérification des conflits:", error);
      }
    }
  }

  private async validateLocationData(missionData: any, result: MissionValidationResult): Promise<void> {
    // Validation basique de la localisation
    if (missionData.format === "onsite" || missionData.format === "hybrid") {
      if (!missionData.location || missionData.location.trim().length < 5) {
        result.errors.push("L'adresse est requise pour les missions en présentiel");
        result.isValid = false;
      }

      // Vérifier la cohérence des coordonnées si présentes
      if (missionData.latitude !== null && missionData.longitude !== null) {
        if (missionData.latitude < -90 || missionData.latitude > 90) {
          result.errors.push("Latitude invalide");
          result.isValid = false;
        }
        if (missionData.longitude < -180 || missionData.longitude > 180) {
          result.errors.push("Longitude invalide");
          result.isValid = false;
        }
      }
    }
  }

  async validateMissionUpdate(missionId: string, updateData: any): Promise<MissionValidationResult> {
    const result: MissionValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      // Récupérer la mission existante
      const { data: existingMission, error } = await supabase
        .from("missions")
        .select("*, mission_registrations(count)")
        .eq("id", missionId)
        .single();

      if (error || !existingMission) {
        result.errors.push("Mission introuvable");
        result.isValid = false;
        return result;
      }

      // Vérifier s'il y a des participants
      const participantCount = existingMission.mission_registrations?.[0]?.count || 0;

      if (participantCount > 0) {
        // Restrictions sur les modifications quand il y a des participants
        if (updateData.start_date && updateData.start_date !== existingMission.start_date) {
          result.warnings.push("Modification de date avec des participants inscrits");
        }

        if (updateData.available_spots && updateData.available_spots < participantCount) {
          result.errors.push("Impossible de réduire les places en dessous du nombre d'inscrits");
          result.isValid = false;
        }

        if (updateData.location && updateData.location !== existingMission.location) {
          result.warnings.push("Modification du lieu avec des participants inscrits");
        }
      }

      // Validation des nouvelles données
      const fullData = { ...existingMission, ...updateData };
      const validation = await this.validateMissionData(fullData);
      
      result.errors.push(...validation.errors);
      result.warnings.push(...validation.warnings);
      if (!validation.isValid) {
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push("Erreur lors de la validation de mise à jour");
      result.isValid = false;
    }

    return result;
  }
}

export const missionValidationService = MissionValidationService.getInstance();

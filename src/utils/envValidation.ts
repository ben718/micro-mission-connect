
interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_DEMO_MODE?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class EnvironmentValidator {
  private static instance: EnvironmentValidator;

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  validateEnvironment(): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const env = import.meta.env;

    // Validation des variables obligatoires
    this.validateSupabaseUrl(env.VITE_SUPABASE_URL, result);
    this.validateSupabaseAnonKey(env.VITE_SUPABASE_ANON_KEY, result);
    
    // Validation des variables optionnelles
    this.validateDemoMode(env.VITE_DEMO_MODE, result);

    // Validation de la cohérence entre les variables
    this.validateConsistency(env, result);

    return result;
  }

  private validateSupabaseUrl(url: string, result: ValidationResult): void {
    if (!url) {
      result.errors.push('VITE_SUPABASE_URL est obligatoire');
      result.isValid = false;
      return;
    }

    try {
      const parsedUrl = new URL(url);
      
      if (!parsedUrl.hostname.includes('supabase.co')) {
        result.warnings.push('VITE_SUPABASE_URL ne semble pas être une URL Supabase valide');
      }

      if (parsedUrl.protocol !== 'https:') {
        result.errors.push('VITE_SUPABASE_URL doit utiliser HTTPS');
        result.isValid = false;
      }
    } catch (error) {
      result.errors.push('VITE_SUPABASE_URL n\'est pas une URL valide');
      result.isValid = false;
    }
  }

  private validateSupabaseAnonKey(key: string, result: ValidationResult): void {
    if (!key) {
      result.errors.push('VITE_SUPABASE_ANON_KEY est obligatoire');
      result.isValid = false;
      return;
    }

    // Vérifier le format JWT basique
    const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if (!jwtPattern.test(key)) {
      result.errors.push('VITE_SUPABASE_ANON_KEY doit être un JWT valide');
      result.isValid = false;
    }

    try {
      // Décoder le header JWT pour vérifier le format
      const header = JSON.parse(atob(key.split('.')[0]));
      if (header.typ !== 'JWT') {
        result.warnings.push('VITE_SUPABASE_ANON_KEY ne semble pas être un JWT standard');
      }
    } catch (error) {
      result.warnings.push('Impossible de décoder le header du JWT');
    }
  }

  private validateDemoMode(demoMode: string, result: ValidationResult): void {
    if (demoMode && !['true', 'false'].includes(demoMode.toLowerCase())) {
      result.warnings.push('VITE_DEMO_MODE doit être "true" ou "false"');
    }
  }

  private validateConsistency(env: Record<string, any>, result: ValidationResult): void {
    const hasSupabaseConfig = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY;
    const isDemoMode = env.VITE_DEMO_MODE === 'true';

    if (isDemoMode && hasSupabaseConfig) {
      result.warnings.push('Mode démo activé avec configuration Supabase présente');
    }

    if (!isDemoMode && !hasSupabaseConfig) {
      result.errors.push('Configuration Supabase manquante et mode démo désactivé');
      result.isValid = false;
    }
  }

  getConfig(): EnvConfig {
    const validation = this.validateEnvironment();
    
    if (!validation.isValid) {
      throw new Error(`Configuration d'environnement invalide: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Avertissements de configuration:', validation.warnings);
    }

    return {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE
    };
  }

  logValidationStatus(): void {
    const validation = this.validateEnvironment();
    
    console.log('🔧 Validation des variables d\'environnement:');
    
    if (validation.isValid) {
      console.log('✅ Configuration valide');
    } else {
      console.error('❌ Configuration invalide');
      validation.errors.forEach(error => console.error(`  - ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Avertissements:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  }
}

// Export singleton pour utilisation globale
export const envValidator = EnvironmentValidator.getInstance();

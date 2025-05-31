
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  async validate() {
    console.log('🚀 Validation de déploiement en cours...\n');

    await this.validateEnvironmentFiles();
    await this.validateBuildConfiguration();
    await this.validateSupabaseConfiguration();
    await this.validateSecurityConfiguration();
    await this.validateDatabaseMigrations();
    await this.validateTypeScriptConfiguration();
    await this.validateServices();
    await this.validateNotificationSystem();

    this.generateReport();
    return this.errors.length === 0;
  }

  async validateEnvironmentFiles() {
    console.log('📄 Vérification des fichiers d\'environnement...');

    // Vérifier .env.example
    if (fs.existsSync('.env.example')) {
      this.passed.push('Fichier .env.example présent');
    } else {
      this.warnings.push('Fichier .env.example manquant pour la documentation');
    }

    // Vérifier .env
    if (fs.existsSync('.env')) {
      this.passed.push('Fichier .env présent');
      
      // Vérifier le contenu
      const envContent = fs.readFileSync('.env', 'utf8');
      
      if (envContent.includes('VITE_SUPABASE_URL=')) {
        this.passed.push('Variable VITE_SUPABASE_URL configurée');
      } else {
        this.errors.push('Variable VITE_SUPABASE_URL manquante dans .env');
      }

      if (envContent.includes('VITE_SUPABASE_ANON_KEY=')) {
        this.passed.push('Variable VITE_SUPABASE_ANON_KEY configurée');
      } else {
        this.errors.push('Variable VITE_SUPABASE_ANON_KEY manquante dans .env');
      }
    } else {
      this.errors.push('Fichier .env manquant - requis pour la production');
    }
  }

  async validateBuildConfiguration() {
    console.log('🔨 Vérification de la configuration de build...');

    // Vérifier vite.config.ts
    if (fs.existsSync('vite.config.ts')) {
      this.passed.push('Configuration Vite présente');
    } else {
      this.errors.push('Configuration Vite manquante');
    }

    // Vérifier TypeScript
    if (fs.existsSync('tsconfig.json')) {
      this.passed.push('Configuration TypeScript présente');
    } else {
      this.errors.push('Configuration TypeScript manquante');
    }
  }

  async validateSupabaseConfiguration() {
    console.log('📊 Vérification de la configuration Supabase...');

    // Vérifier le client Supabase
    if (fs.existsSync('src/integrations/supabase/client.ts')) {
      this.passed.push('Client Supabase configuré');
      
      // Vérifier que la validation d'environnement est utilisée
      const clientContent = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');
      if (clientContent.includes('envValidator')) {
        this.passed.push('Validation d\'environnement intégrée');
      } else {
        this.warnings.push('Validation d\'environnement manquante dans le client');
      }
    } else {
      this.errors.push('Client Supabase manquant');
    }

    // Vérifier les types
    if (fs.existsSync('src/integrations/supabase/types.ts')) {
      this.passed.push('Types Supabase présents');
    } else {
      this.warnings.push('Types Supabase manquants - régénérer avec supabase gen types');
    }

    // Vérifier la configuration du projet
    if (fs.existsSync('supabase/config.toml')) {
      this.passed.push('Configuration Supabase locale présente');
    } else {
      this.warnings.push('Configuration Supabase locale manquante');
    }
  }

  async validateSecurityConfiguration() {
    console.log('🔒 Vérification de la configuration sécuritaire...');

    // Vérifier la validation d'environnement
    if (fs.existsSync('src/utils/envValidation.ts')) {
      this.passed.push('Service de validation d\'environnement présent');
    } else {
      this.errors.push('Service de validation d\'environnement manquant');
    }

    // Vérifier la configuration de production
    if (fs.existsSync('src/config/production.ts')) {
      this.passed.push('Configuration de production présente');
      
      const configContent = fs.readFileSync('src/config/production.ts', 'utf8');
      
      if (configContent.includes('enableCSP: true')) {
        this.passed.push('CSP activé en production');
      } else {
        this.warnings.push('CSP non activé - recommandé pour la sécurité');
      }
    } else {
      this.warnings.push('Configuration de production manquante');
    }
  }

  async validateDatabaseMigrations() {
    console.log('🗃️ Vérification des migrations de base de données...');

    // Vérifier les seeds SQL
    const sqlFiles = [
      'src/database/seed.sql', 
      'src/database/seed_alpha.sql',
      'src/database/productionSeeds.sql'
    ];
    
    sqlFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.passed.push(`Fichier SQL ${file} présent`);
      } else {
        this.warnings.push(`Fichier SQL ${file} manquant`);
      }
    });

    // Vérifier le système de migration
    if (fs.existsSync('src/utils/dataMigration.ts')) {
      this.passed.push('Système de migration de données configuré');
    } else {
      this.warnings.push('Système de migration manquant');
    }
  }

  async validateTypeScriptConfiguration() {
    console.log('📝 Vérification de la configuration TypeScript...');

    // Vérifier les types essentiels
    const typeFiles = [
      'src/types/index.ts',
      'src/types/mission.ts',
      'src/types/profile.ts',
      'src/types/validation.ts',
      'src/types/notifications.ts'
    ];

    typeFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.passed.push(`Types ${file} présents`);
      } else {
        this.warnings.push(`Types ${file} manquants`);
      }
    });

    // Vérifier les diagnostics d'imports
    if (fs.existsSync('src/utils/importDiagnostics.ts')) {
      this.passed.push('Système de diagnostic d\'imports présent');
    } else {
      this.warnings.push('Système de diagnostic d\'imports manquant');
    }
  }

  async validateServices() {
    console.log('🔧 Vérification des services...');

    const services = [
      'src/services/notificationService.ts',
      'src/services/missionValidation.ts',
      'src/services/profileValidation.ts',
      'src/services/monitoring.ts',
      'src/services/errorMonitoring.ts'
    ];

    services.forEach(service => {
      if (fs.existsSync(service)) {
        this.passed.push(`Service ${path.basename(service)} présent`);
      } else {
        this.warnings.push(`Service ${path.basename(service)} manquant`);
      }
    });
  }

  async validateNotificationSystem() {
    console.log('🔔 Vérification du système de notifications...');

    // Vérifier les hooks de notifications
    if (fs.existsSync('src/hooks/useNotifications.ts')) {
      this.passed.push('Hook useNotifications présent');
    } else {
      this.errors.push('Hook useNotifications manquant');
    }

    // Vérifier les composants de notifications
    const notificationComponents = [
      'src/components/notifications/NotificationCenter.tsx',
      'src/components/notifications/NotificationList.tsx',
      'src/components/notifications/NotificationBadge.tsx'
    ];

    notificationComponents.forEach(component => {
      if (fs.existsSync(component)) {
        this.passed.push(`Composant ${path.basename(component)} présent`);
      } else {
        this.warnings.push(`Composant ${path.basename(component)} manquant`);
      }
    });
  }

  generateReport() {
    console.log('\n' + '═'.repeat(60));
    console.log('📋 RAPPORT DE VALIDATION DE DÉPLOIEMENT');
    console.log('═'.repeat(60));

    // Score global
    const totalChecks = this.passed.length + this.warnings.length + this.errors.length;
    const score = Math.round((this.passed.length / totalChecks) * 100);
    const scoreColor = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
    
    console.log(`${scoreColor} Score de préparation: ${score}%`);
    console.log(`   ✅ Validations réussies: ${this.passed.length}`);
    console.log(`   ⚠️  Avertissements: ${this.warnings.length}`);
    console.log(`   ❌ Erreurs: ${this.errors.length}`);

    // Détails des erreurs
    if (this.errors.length > 0) {
      console.log('\n❌ ERREURS BLOQUANTES:');
      this.errors.forEach(error => console.log(`   • ${error}`));
    }

    // Avertissements
    if (this.warnings.length > 0) {
      console.log('\n⚠️  AVERTISSEMENTS:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    // Recommandations finales
    console.log('\n🛠️ ACTIONS RECOMMANDÉES:');
    console.log('   1. Exécuter les tests E2E: npm run test:e2e');
    console.log('   2. Vérifier la performance: node scripts/performance-audit.js');
    console.log('   3. Audit de sécurité: node scripts/security-audit.js');
    console.log('   4. Build de production: npm run build');

    // Verdict final
    console.log('\n' + '─'.repeat(60));
    if (this.errors.length === 0) {
      console.log('✅ PRÊT POUR LE DÉPLOIEMENT');
      console.log('🚀 Vous pouvez procéder au déploiement en production');
      console.log('📋 N\'oubliez pas de configurer les variables d\'environnement');
      console.log('🗄️ Exécutez les seeds de production après déploiement');
    } else {
      console.log('❌ NON PRÊT POUR LE DÉPLOIEMENT');
      console.log('🔧 Corrigez les erreurs avant de déployer');
    }
    console.log('─'.repeat(60));
  }
}

async function main() {
  const validator = new DeploymentValidator();
  const isValid = await validator.validate();
  process.exit(isValid ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DeploymentValidator };

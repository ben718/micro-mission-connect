
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PerformanceAuditor {
  constructor() {
    this.results = [];
    this.score = 100;
    this.issues = [];
  }

  async performAudit() {
    console.log('⚡ Audit de Performance en cours...');
    console.log('─'.repeat(50));

    await this.checkBundleSize();
    await this.checkImageOptimization();
    await this.checkCodeSplitting();
    await this.checkCaching();
    await this.checkLazyLoading();
    await this.checkWebVitals();

    this.generateReport();
  }

  async checkBundleSize() {
    console.log('📦 Vérification de la taille du bundle...');
    
    const distPath = './dist';
    if (!fs.existsSync(distPath)) {
      this.addResult('warning', 'Bundle non trouvé', 'Exécutez npm run build d\'abord');
      return;
    }

    try {
      const stats = this.analyzeBundleSize(distPath);
      
      if (stats.totalSize > 1024 * 1024) { // 1MB
        this.addResult('warning', 'Bundle trop volumineux', `${(stats.totalSize / 1024 / 1024).toFixed(2)}MB`);
      } else {
        this.addResult('pass', 'Taille du bundle', `${(stats.totalSize / 1024).toFixed(0)}KB`);
      }

      if (stats.largestFile.size > 500 * 1024) { // 500KB
        this.addResult('warning', 'Fichier volumineux détecté', `${stats.largestFile.name}: ${(stats.largestFile.size / 1024).toFixed(0)}KB`);
      }

    } catch (error) {
      this.addResult('warning', 'Analyse du bundle', 'Erreur lors de l\'analyse');
    }
  }

  analyzeBundleSize(dirPath) {
    let totalSize = 0;
    let largestFile = { name: '', size: 0 };
    
    const analyzeDir = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          analyzeDir(fullPath);
        } else {
          totalSize += stat.size;
          
          if (stat.size > largestFile.size) {
            largestFile = { name: item, size: stat.size };
          }
        }
      });
    };

    analyzeDir(dirPath);
    return { totalSize, largestFile };
  }

  async checkImageOptimization() {
    console.log('🖼️ Vérification de l\'optimisation des images...');
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = [];
    const publicPath = './public';
    
    if (fs.existsSync(publicPath)) {
      this.findImages(publicPath, imageExtensions, images);
    }

    let unoptimizedCount = 0;
    let totalSize = 0;

    images.forEach(image => {
      const stat = fs.statSync(image.path);
      totalSize += stat.size;
      
      // Vérifier si l'image est potentiellement non optimisée
      if (stat.size > 100 * 1024) { // > 100KB
        unoptimizedCount++;
      }
    });

    if (unoptimizedCount > 0) {
      this.addResult('warning', 'Images non optimisées', `${unoptimizedCount} image(s) > 100KB détectée(s)`);
    } else if (images.length > 0) {
      this.addResult('pass', 'Optimisation des images', `${images.length} image(s) bien optimisée(s)`);
    } else {
      this.addResult('info', 'Images', 'Aucune image trouvée');
    }
  }

  findImages(dirPath, extensions, results) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.')) {
        this.findImages(fullPath, extensions, results);
      } else if (extensions.some(ext => item.toLowerCase().endsWith(ext))) {
        results.push({ name: item, path: fullPath });
      }
    });
  }

  async checkCodeSplitting() {
    console.log('🔀 Vérification du code splitting...');
    
    const srcPath = './src';
    let hasLazyImports = false;
    let hasRouteBasedSplitting = false;
    
    if (fs.existsSync(srcPath)) {
      const files = this.getAllFiles(srcPath, ['.ts', '.tsx', '.js', '.jsx']);
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('React.lazy') || content.includes('import(')) {
          hasLazyImports = true;
        }
        
        if (content.includes('Suspense') && content.includes('lazy')) {
          hasRouteBasedSplitting = true;
        }
      });
    }

    if (hasLazyImports && hasRouteBasedSplitting) {
      this.addResult('pass', 'Code splitting', 'Lazy loading détecté');
    } else if (hasLazyImports) {
      this.addResult('info', 'Code splitting', 'Lazy imports présents mais pas de route splitting');
    } else {
      this.addResult('warning', 'Code splitting', 'Aucun code splitting détecté');
    }
  }

  getAllFiles(dirPath, extensions) {
    let files = [];
    
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(this.getAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  async checkCaching() {
    console.log('💾 Vérification de la stratégie de cache...');
    
    // Vérifier la configuration Vite pour le cache
    const viteConfigPath = './vite.config.ts';
    let hasCacheConfig = false;
    
    if (fs.existsSync(viteConfigPath)) {
      const content = fs.readFileSync(viteConfigPath, 'utf8');
      if (content.includes('rollupOptions') && content.includes('output')) {
        hasCacheConfig = true;
      }
    }

    // Vérifier les service workers
    const hasServiceWorker = fs.existsSync('./public/sw.js') || fs.existsSync('./src/sw.ts');

    if (hasCacheConfig && hasServiceWorker) {
      this.addResult('pass', 'Stratégie de cache', 'Configuration détectée');
    } else if (hasCacheConfig || hasServiceWorker) {
      this.addResult('info', 'Stratégie de cache', 'Configuration partielle');
    } else {
      this.addResult('warning', 'Stratégie de cache', 'Aucune stratégie détectée');
    }
  }

  async checkLazyLoading() {
    console.log('🔄 Vérification du lazy loading...');
    
    const srcPath = './src';
    let hasImageLazyLoading = false;
    let hasComponentLazyLoading = false;
    
    if (fs.existsSync(srcPath)) {
      const files = this.getAllFiles(srcPath, ['.ts', '.tsx', '.js', '.jsx']);
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('loading="lazy"') || content.includes('loading={') && content.includes('"lazy"')) {
          hasImageLazyLoading = true;
        }
        
        if (content.includes('Suspense') || content.includes('React.lazy')) {
          hasComponentLazyLoading = true;
        }
      });
    }

    if (hasImageLazyLoading && hasComponentLazyLoading) {
      this.addResult('pass', 'Lazy loading', 'Images et composants lazy loadés');
    } else if (hasComponentLazyLoading) {
      this.addResult('info', 'Lazy loading', 'Composants lazy loadés, pas d\'images');
    } else if (hasImageLazyLoading) {
      this.addResult('info', 'Lazy loading', 'Images lazy loadées, pas de composants');
    } else {
      this.addResult('warning', 'Lazy loading', 'Aucun lazy loading détecté');
    }
  }

  async checkWebVitals() {
    console.log('📊 Vérification des Web Vitals...');
    
    // Vérifier si le monitoring des Web Vitals est configuré
    const srcPath = './src';
    let hasWebVitalsMonitoring = false;
    
    if (fs.existsExists(srcPath)) {
      const files = this.getAllFiles(srcPath, ['.ts', '.tsx', '.js', '.jsx']);
      
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('web-vitals') || 
            content.includes('getCLS') || 
            content.includes('getFID') || 
            content.includes('getFCP') ||
            content.includes('LCP') ||
            content.includes('CLS')) {
          hasWebVitalsMonitoring = true;
        }
      });
    }

    if (hasWebVitalsMonitoring) {
      this.addResult('pass', 'Web Vitals', 'Monitoring configuré');
    } else {
      this.addResult('warning', 'Web Vitals', 'Aucun monitoring détecté');
    }

    // Recommandations générales pour les Web Vitals
    this.addResult('info', 'Web Vitals - Recommandations', 'LCP < 2.5s, FID < 100ms, CLS < 0.1');
  }

  addResult(type, category, message) {
    const result = { type, category, message };
    this.results.push(result);

    const icon = type === 'pass' ? '✅' : type === 'warning' ? '⚠️' : type === 'info' ? 'ℹ️' : '❌';
    console.log(`${icon} ${category}: ${message}`);

    if (type === 'critical') {
      this.score -= 20;
    } else if (type === 'warning') {
      this.score -= 10;
    }
  }

  generateReport() {
    console.log('\n' + '─'.repeat(50));
    console.log('📊 RAPPORT D\'AUDIT DE PERFORMANCE');
    console.log('─'.repeat(50));

    // Score global
    const scoreColor = this.score >= 90 ? '🟢' : this.score >= 70 ? '🟡' : '🔴';
    console.log(`${scoreColor} Score de performance: ${this.score}/100`);

    // Résumé
    const passed = this.results.filter(r => r.type === 'pass').length;
    const warnings = this.results.filter(r => r.type === 'warning').length;
    const criticals = this.results.filter(r => r.type === 'critical').length;

    console.log(`\n📈 Résumé:`);
    console.log(`   • Vérifications réussies: ${passed}`);
    console.log(`   • Avertissements: ${warnings}`);
    console.log(`   • Problèmes critiques: ${criticals}`);

    // Recommandations
    console.log(`\n💡 Recommandations pour améliorer les performances:`);
    console.log('   🔧 Optimisez la taille du bundle avec code splitting');
    console.log('   🖼️ Compressez et optimisez les images (WebP, lazy loading)');
    console.log('   💾 Implémentez une stratégie de cache efficace');
    console.log('   📊 Surveillez les Core Web Vitals en production');
    console.log('   🔄 Utilisez le lazy loading pour les composants et ressources');
    console.log('   ⚡ Minimisez le JavaScript non critique');

    // Web Vitals targets
    console.log(`\n🎯 Objectifs Web Vitals à atteindre:`);
    console.log('   • LCP (Largest Contentful Paint): < 2.5 secondes');
    console.log('   • FID (First Input Delay): < 100 millisecondes');
    console.log('   • CLS (Cumulative Layout Shift): < 0.1');

    console.log(`\n✅ Audit de performance terminé`);
  }
}

async function main() {
  const auditor = new PerformanceAuditor();
  await auditor.performAudit();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PerformanceAuditor };

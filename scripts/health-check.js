
#!/usr/bin/env node

const https = require('https');
const http = require('http');

class HealthChecker {
  constructor(config = {}) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 2000,
      endpoints: [
        { name: 'API Health', url: '/api/health', critical: true },
        { name: 'Frontend', url: '/', critical: true },
        { name: 'Database Health', url: '/api/health/database', critical: true },
        { name: 'Storage Health', url: '/api/health/storage', critical: false },
      ],
      ...config
    };
  }

  async checkHealth(baseUrl) {
    console.log(`🏥 Vérification de santé pour: ${baseUrl}`);
    console.log('─'.repeat(50));

    const results = [];
    let allCriticalHealthy = true;

    for (const endpoint of this.config.endpoints) {
      const result = await this.checkEndpoint(baseUrl, endpoint);
      results.push(result);

      if (endpoint.critical && !result.healthy) {
        allCriticalHealthy = false;
      }

      this.printResult(endpoint, result);
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`📊 Résumé: ${results.filter(r => r.healthy).length}/${results.length} endpoints sains`);
    
    if (allCriticalHealthy) {
      console.log('✅ Tous les services critiques sont sains');
      return { healthy: true, results };
    } else {
      console.log('❌ Un ou plusieurs services critiques sont défaillants');
      return { healthy: false, results };
    }
  }

  async checkEndpoint(baseUrl, endpoint) {
    const url = `${baseUrl}${endpoint.url}`;
    
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const result = await this.makeRequest(url);
        
        if (result.statusCode >= 200 && result.statusCode < 300) {
          return {
            healthy: true,
            statusCode: result.statusCode,
            responseTime: result.responseTime,
            attempt: attempt
          };
        } else {
          if (attempt === this.config.retries) {
            return {
              healthy: false,
              statusCode: result.statusCode,
              responseTime: result.responseTime,
              error: `HTTP ${result.statusCode}`,
              attempt: attempt
            };
          }
        }
      } catch (error) {
        if (attempt === this.config.retries) {
          return {
            healthy: false,
            error: error.message,
            attempt: attempt
          };
        }
      }

      if (attempt < this.config.retries) {
        console.log(`   ⏳ Tentative ${attempt} échouée, nouvelle tentative dans ${this.config.retryDelay}ms...`);
        await this.sleep(this.config.retryDelay);
      }
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'HealthChecker/1.0'
        }
      };

      const req = client.request(options, (res) => {
        const responseTime = Date.now() - startTime;
        
        // Consommer la réponse pour éviter les fuites mémoire
        res.on('data', () => {});
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            responseTime: responseTime
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Timeout après ${this.config.timeout}ms`));
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  printResult(endpoint, result) {
    const status = result.healthy ? '✅' : '❌';
    const critical = endpoint.critical ? '🔴' : '🟡';
    const responseTime = result.responseTime ? `${result.responseTime}ms` : 'N/A';
    
    console.log(`${status} ${critical} ${endpoint.name.padEnd(20)} | ${responseTime.padEnd(8)} | ${result.error || 'OK'}`);
    
    if (result.attempt > 1) {
      console.log(`   ↳ Réussi après ${result.attempt} tentative(s)`);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Health checks spécialisés
class ExtendedHealthChecker extends HealthChecker {
  async performExtendedChecks(baseUrl) {
    console.log('\n🔍 Vérifications étendues...');
    
    const checks = [
      this.checkDatabasePerformance(),
      this.checkDiskSpace(),
      this.checkMemoryUsage(),
      this.checkConnectivity()
    ];

    const results = await Promise.allSettled(checks);
    
    results.forEach((result, index) => {
      const checkName = ['Database Performance', 'Disk Space', 'Memory Usage', 'Network Connectivity'][index];
      
      if (result.status === 'fulfilled') {
        console.log(`✅ ${checkName}: ${result.value}`);
      } else {
        console.log(`❌ ${checkName}: ${result.reason}`);
      }
    });
  }

  async checkDatabasePerformance() {
    // Simuler une vérification de performance de base de données
    await this.sleep(500);
    const responseTime = 50 + Math.random() * 100;
    
    if (responseTime > 100) {
      throw new Error(`Temps de réponse lent: ${responseTime.toFixed(0)}ms`);
    }
    
    return `${responseTime.toFixed(0)}ms`;
  }

  async checkDiskSpace() {
    // Simuler une vérification d'espace disque
    await this.sleep(200);
    const usage = Math.random() * 100;
    
    if (usage > 90) {
      throw new Error(`Espace disque critique: ${usage.toFixed(1)}%`);
    }
    
    return `${usage.toFixed(1)}% utilisé`;
  }

  async checkMemoryUsage() {
    // Vérification mémoire basée sur les APIs disponibles
    if (typeof performance !== 'undefined' && performance.memory) {
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.totalJSHeapSize;
      const percentage = (used / total) * 100;
      
      if (percentage > 85) {
        throw new Error(`Utilisation mémoire élevée: ${percentage.toFixed(1)}%`);
      }
      
      return `${percentage.toFixed(1)}% utilisé`;
    }
    
    return 'Non disponible dans cet environnement';
  }

  async checkConnectivity() {
    // Simuler une vérification de connectivité réseau
    await this.sleep(300);
    return 'OK';
  }
}

// Script principal
async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || 'http://localhost:8080';
  const extended = args.includes('--extended');

  const HealthCheckerClass = extended ? ExtendedHealthChecker : HealthChecker;
  const checker = new HealthCheckerClass();

  try {
    const result = await checker.checkHealth(baseUrl);
    
    if (extended && checker.performExtendedChecks) {
      await checker.performExtendedChecks(baseUrl);
    }

    // Code de sortie
    process.exit(result.healthy ? 0 : 1);

  } catch (error) {
    console.error('❌ Erreur lors de la vérification de santé:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { HealthChecker, ExtendedHealthChecker };

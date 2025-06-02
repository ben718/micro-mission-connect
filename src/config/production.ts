
export interface ProductionConfig {
  environment: 'production' | 'staging';
  security: {
    enableCSP: boolean;
    enableHSTS: boolean;
    enableXSSProtection: boolean;
    enableFrameOptions: boolean;
  };
  monitoring: {
    enableErrorTracking: boolean;
    enablePerformanceTracking: boolean;
    enableUserTracking: boolean;
    alertThresholds: {
      errorRate: number;
      responseTime: number;
      memoryUsage: number;
    };
  };
  performance: {
    enableCompression: boolean;
    enableCaching: boolean;
    enableLazyLoading: boolean;
    cacheMaxAge: number;
    maxRequestsPerMinute: number;
  };
  database: {
    connectionPool: {
      min: number;
      max: number;
    };
    queryTimeout: number;
    enableReadReplicas: boolean;
  };
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableFileUploads: boolean;
  };
}

export const productionConfig: ProductionConfig = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'staging',
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableFrameOptions: true,
  },
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    enableUserTracking: false, // RGPD compliance
    alertThresholds: {
      errorRate: 0.05, // 5%
      responseTime: 2000, // 2 secondes
      memoryUsage: 0.85, // 85%
    },
  },
  performance: {
    enableCompression: true,
    enableCaching: true,
    enableLazyLoading: true,
    cacheMaxAge: 3600, // 1 heure
    maxRequestsPerMinute: 100, // Rate limiting
  },
  database: {
    connectionPool: {
      min: 2,
      max: 20,
    },
    queryTimeout: 30000, // 30 secondes
    enableReadReplicas: true,
  },
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableNotifications: true,
    enableFileUploads: true,
  },
};

export const getEnvironmentConfig = () => {
  const config = { ...productionConfig };
  
  if (config.environment === 'staging') {
    config.monitoring.alertThresholds.errorRate = 0.1; // Plus tolérant en staging
    config.database.connectionPool.max = 10;
    config.performance.maxRequestsPerMinute = 200; // Plus permissif en staging
  }
  
  return config;
};

// Configuration des headers de sécurité pour la production
export const getSecurityHeaders = () => {
  const config = getEnvironmentConfig();
  
  const headers: Record<string, string> = {};
  
  if (config.security.enableCSP) {
    headers['Content-Security-Policy'] = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'"
    ].join('; ');
  }
  
  if (config.security.enableHSTS) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }
  
  if (config.security.enableXSSProtection) {
    headers['X-Content-Type-Options'] = 'nosniff';
    headers['X-Frame-Options'] = 'DENY';
    headers['X-XSS-Protection'] = '1; mode=block';
  }
  
  return headers;
};

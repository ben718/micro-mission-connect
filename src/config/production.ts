
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
  };
  database: {
    connectionPool: {
      min: number;
      max: number;
    };
    queryTimeout: number;
    enableReadReplicas: boolean;
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
  },
  database: {
    connectionPool: {
      min: 2,
      max: 20,
    },
    queryTimeout: 30000, // 30 secondes
    enableReadReplicas: true,
  },
};

export const getEnvironmentConfig = () => {
  const config = { ...productionConfig };
  
  if (config.environment === 'staging') {
    config.monitoring.alertThresholds.errorRate = 0.1; // Plus tolérant en staging
    config.database.connectionPool.max = 10;
  }
  
  return config;
};

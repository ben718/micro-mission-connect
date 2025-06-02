
// Optimisations spécifiques pour la production

// Désactiver les logs en production
export const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Garder les erreurs même en production pour le monitoring
    console.error(...args);
  },
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  }
};

// Rate limiting côté client
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests = 100, timeWindowMs = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Nettoyer les anciennes requêtes
    const validRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  getRemainingRequests(key: string): number {
    const requests = this.requests.get(key) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

export const rateLimiter = new RateLimiter();

// Optimisation des requêtes Supabase
export const optimizeSupabaseQuery = (query: any) => {
  // Ajouter des index suggestions et optimisations
  return query
    .limit(50) // Limiter par défaut
    .order('created_at', { ascending: false }); // Index sur created_at recommandé
};

// Debounce pour les recherches
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle pour les événements fréquents
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Vérification de la santé de l'application
export const healthCheck = {
  checkSupabaseConnection: async () => {
    try {
      const { error } = await import('@/integrations/supabase/client').then(
        ({ supabase }) => supabase.from('profiles').select('id').limit(1)
      );
      return !error;
    } catch {
      return false;
    }
  },
  
  checkPerformance: () => {
    return {
      memory: (performance as any).memory?.usedJSHeapSize || 0,
      timing: performance.timing,
      navigation: performance.navigation
    };
  }
};

// Nettoyage automatique du cache en production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Nettoyer le localStorage périodiquement
  setInterval(() => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('temp_') || key.startsWith('cache_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.expires && Date.now() > data.expires) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      logger.error('Error cleaning localStorage:', error);
    }
  }, 5 * 60 * 1000); // Toutes les 5 minutes
}

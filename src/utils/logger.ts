// Utilitaire de logging qui respecte l'environnement
const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.error(message, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  }
};

// Pour les erreurs critiques qui doivent toujours être loggées
export const criticalLogger = {
  error: (message: string, ...args: any[]) => {
    console.error(`[CRITICAL] ${message}`, ...args);
  }
};


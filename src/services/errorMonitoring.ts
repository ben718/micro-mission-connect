
interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  component?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorMonitoringService {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  reportError(error: Error, context?: {
    component?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
    additionalData?: Record<string, any>;
  }) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: context?.userId,
      component: context?.component,
      severity: context?.severity || 'medium',
      context: context?.additionalData
    };

    this.errors.push(errorReport);
    
    // Garder seulement les dernières erreurs
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Monitor]', errorReport);
    }

    // En production, on pourrait envoyer à un service externe
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorReport);
    }

    // Stocker localement pour debug
    try {
      localStorage.setItem('error_reports', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Cannot store error reports in localStorage');
    }
  }

  private async sendToExternalService(errorReport: ErrorReport) {
    // En production, remplacer par votre service de monitoring préféré
    // Exemple : Sentry, LogRocket, etc.
    try {
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (e) {
      console.warn('Failed to send error to external service', e);
    }
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem('error_reports');
    } catch (e) {
      console.warn('Cannot clear error reports from localStorage');
    }
  }

  getCriticalErrors(): ErrorReport[] {
    return this.errors.filter(error => error.severity === 'critical');
  }
}

export const errorMonitoring = new ErrorMonitoringService();

// Hook global pour capturer les erreurs non gérées
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorMonitoring.reportError(event.error, {
      severity: 'high',
      component: 'Global Error Handler',
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorMonitoring.reportError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      {
        severity: 'high',
        component: 'Promise Rejection Handler'
      }
    );
  });
}

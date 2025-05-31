interface MetricData {
  timestamp: number;
  value: number;
  tags?: Record<string, string>;
}

interface Alert {
  id: string;
  metric: string;
  threshold: number;
  condition: 'above' | 'below';
  message: string;
  isActive: boolean;
  triggeredAt?: number;
}

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Map<string, MetricData[]> = new Map();
  private alerts: Alert[] = [];
  private subscribers: Set<(alert: Alert) => void> = new Set();

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Enregistrement des métriques
  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: MetricData = {
      timestamp: Date.now(),
      value,
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name)!;
    metricHistory.push(metric);

    // Garder seulement les 1000 dernières mesures
    if (metricHistory.length > 1000) {
      metricHistory.shift();
    }

    // Vérifier les alertes
    this.checkAlerts(name, value);
  }

  // Configuration des alertes
  addAlert(alert: Alert) {
    this.alerts.push(alert);
  }

  removeAlert(alertId: string) {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  // Vérification des alertes
  private checkAlerts(metricName: string, value: number) {
    const relevantAlerts = this.alerts.filter(alert => alert.metric === metricName);

    for (const alert of relevantAlerts) {
      const shouldTrigger = 
        (alert.condition === 'above' && value > alert.threshold) ||
        (alert.condition === 'below' && value < alert.threshold);

      if (shouldTrigger && !alert.isActive) {
        alert.isActive = true;
        alert.triggeredAt = Date.now();
        this.triggerAlert(alert);
      } else if (!shouldTrigger && alert.isActive) {
        alert.isActive = false;
        alert.triggeredAt = undefined;
        this.resolveAlert(alert);
      }
    }
  }

  private triggerAlert(alert: Alert) {
    console.warn(`🚨 ALERTE: ${alert.message}`);
    this.subscribers.forEach(callback => callback(alert));
    
    // Envoyer l'alerte (email, Slack, etc.)
    this.sendAlert(alert);
  }

  private resolveAlert(alert: Alert) {
    console.info(`✅ ALERTE RÉSOLUE: ${alert.message}`);
  }

  private async sendAlert(alert: Alert) {
    // Ici on enverrait l'alerte via email, Slack, etc.
    console.log('Envoi de l\'alerte:', alert);
  }

  // Abonnement aux alertes
  onAlert(callback: (alert: Alert) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Récupération des métriques
  getMetrics(name: string, timeRange?: { start: number; end: number }): MetricData[] {
    const metrics = this.metrics.get(name) || [];
    
    if (!timeRange) {
      return metrics;
    }

    return metrics.filter(
      metric => metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
    );
  }

  // Calcul de statistiques
  getMetricStats(name: string, timeRange?: { start: number; end: number }) {
    const metrics = this.getMetrics(name, timeRange);
    
    if (metrics.length === 0) {
      return null;
    }

    const values = metrics.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Percentiles
    const sorted = [...values].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      count: metrics.length,
      sum,
      avg,
      min,
      max,
      p50,
      p95,
      p99,
    };
  }

  // Métriques système
  startSystemMonitoring() {
    // Surveiller les performances de l'application
    setInterval(() => {
      // Taux d'erreur JavaScript
      const errorRate = this.getErrorRate();
      this.recordMetric('error_rate', errorRate);

      // Utilisation mémoire (avec vérification de type)
      const extendedPerformance = performance as ExtendedPerformance;
      if (extendedPerformance.memory) {
        const memoryUsage = extendedPerformance.memory.usedJSHeapSize / extendedPerformance.memory.totalJSHeapSize;
        this.recordMetric('memory_usage', memoryUsage);
      }

      // Temps de réponse des API
      this.recordMetric('api_response_time', this.getAverageApiResponseTime());

    }, 30000); // Toutes les 30 secondes
  }

  private getErrorRate(): number {
    // Calculer le taux d'erreur basé sur les erreurs captées
    const errorMetrics = this.getMetrics('javascript_errors', {
      start: Date.now() - 300000, // 5 dernières minutes
      end: Date.now(),
    });
    
    return errorMetrics.length / 5; // Erreurs par minute
  }

  private getAverageApiResponseTime(): number {
    const responseTimeMetrics = this.getMetrics('api_response_time', {
      start: Date.now() - 60000, // Dernière minute
      end: Date.now(),
    });

    if (responseTimeMetrics.length === 0) return 0;

    const avg = responseTimeMetrics.reduce((sum, metric) => sum + metric.value, 0) / responseTimeMetrics.length;
    return avg;
  }
}

// Configuration des alertes par défaut
export const setupDefaultAlerts = () => {
  const monitoring = MonitoringService.getInstance();

  monitoring.addAlert({
    id: 'high_error_rate',
    metric: 'error_rate',
    threshold: 5, // 5 erreurs par minute
    condition: 'above',
    message: 'Taux d\'erreur élevé détecté',
    isActive: false,
  });

  monitoring.addAlert({
    id: 'high_memory_usage',
    metric: 'memory_usage',
    threshold: 0.85, // 85%
    condition: 'above',
    message: 'Utilisation mémoire élevée',
    isActive: false,
  });

  monitoring.addAlert({
    id: 'slow_api_response',
    metric: 'api_response_time',
    threshold: 2000, // 2 secondes
    condition: 'above',
    message: 'Temps de réponse API lent',
    isActive: false,
  });
};

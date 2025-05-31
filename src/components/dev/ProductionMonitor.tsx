
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { errorMonitoring } from '@/services/errorMonitoring';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export function ProductionMonitor() {
  const [errors, setErrors] = useState(errorMonitoring.getErrors());
  const [performanceMetrics, setPerformanceMetrics] = useState({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    // Observer les erreurs
    const interval = setInterval(() => {
      setErrors(errorMonitoring.getErrors());
    }, 5000);

    // Mesurer les performances
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              setPerformanceMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime
              }));
            }
          }
          if (entry.entryType === 'largest-contentful-paint') {
            setPerformanceMetrics(prev => ({
              ...prev,
              largestContentfulPaint: entry.startTime
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // Page load time
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setPerformanceMetrics(prev => ({
          ...prev,
          pageLoadTime: loadTime
        }));
      });

      // Memory usage (si disponible)
      if ('memory' in performance) {
        setPerformanceMetrics(prev => ({
          ...prev,
          memoryUsage: (performance as any).memory.usedJSHeapSize / 1024 / 1024
        }));
      }
    }

    return () => clearInterval(interval);
  }, []);

  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const highErrors = errors.filter(e => e.severity === 'high');

  const getPerformanceStatus = () => {
    if (performanceMetrics.pageLoadTime > 3000) return 'critical';
    if (performanceMetrics.pageLoadTime > 2000) return 'warning';
    return 'good';
  };

  const clearAllErrors = () => {
    errorMonitoring.clearErrors();
    setErrors([]);
  };

  // Ne montrer qu'en développement ou pour les admins
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white/95 backdrop-blur shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Monitoring Système
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Erreurs */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {criticalErrors.length > 0 ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-xs font-medium">Erreurs</span>
            </div>
            <div className="flex gap-1">
              {criticalErrors.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalErrors.length} critiques
                </Badge>
              )}
              {highErrors.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {highErrors.length} importantes
                </Badge>
              )}
              {errors.length === 0 && (
                <Badge variant="default" className="text-xs">
                  Aucune erreur
                </Badge>
              )}
            </div>
          </div>

          {/* Performances */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getPerformanceStatus() === 'critical' ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : getPerformanceStatus() === 'warning' ? (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-xs font-medium">Performances</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Chargement: {Math.round(performanceMetrics.pageLoadTime)}ms</div>
              <div>FCP: {Math.round(performanceMetrics.firstContentfulPaint)}ms</div>
              {performanceMetrics.memoryUsage > 0 && (
                <div>Mémoire: {Math.round(performanceMetrics.memoryUsage)}MB</div>
              )}
            </div>
          </div>

          {errors.length > 0 && (
            <Button
              onClick={clearAllErrors}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Effacer les erreurs
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

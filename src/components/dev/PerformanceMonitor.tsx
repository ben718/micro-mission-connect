
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cache } from '@/utils/cache';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  cacheStats: {
    size: number;
    maxSize: number;
    keys: string[];
  };
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    cacheStats: { size: 0, maxSize: 0, keys: [] }
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => {
        const newRenderCount = prev.renderCount + 1;
        const newAverageRenderTime = 
          (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount;
        
        return {
          renderCount: newRenderCount,
          lastRenderTime: renderTime,
          averageRenderTime: newAverageRenderTime,
          cacheStats: cache.getStats()
        };
      });
    };
  });

  // Afficher seulement en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 opacity-90">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Performance Monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Renders:</span>
          <Badge variant="outline">{metrics.renderCount}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Last render:</span>
          <Badge variant="outline">{metrics.lastRenderTime.toFixed(2)}ms</Badge>
        </div>
        <div className="flex justify-between">
          <span>Avg render:</span>
          <Badge variant="outline">{metrics.averageRenderTime.toFixed(2)}ms</Badge>
        </div>
        <div className="flex justify-between">
          <span>Cache size:</span>
          <Badge variant="outline">
            {metrics.cacheStats.size}/{metrics.cacheStats.maxSize}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Active cache keys: {metrics.cacheStats.keys.length}
        </div>
      </CardContent>
    </Card>
  );
}

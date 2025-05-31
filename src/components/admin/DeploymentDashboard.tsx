
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Server, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface DeploymentStatus {
  id: string;
  version: string;
  environment: string;
  status: 'pending' | 'in-progress' | 'success' | 'failed' | 'rolling-back';
  stage: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  metrics: {
    errorRate: number;
    responseTime: number;
    throughput: number;
    cpuUsage: number;
    memoryUsage: number;
  };
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  services: {
    api: boolean;
    database: boolean;
    redis: boolean;
    storage: boolean;
  };
  lastCheck: string;
}

export const DeploymentDashboard: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Actualiser toutes les 30s
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simuler le chargement des données de déploiement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDeployments([
        {
          id: 'deploy-001',
          version: 'v2.1.0',
          environment: 'production',
          status: 'success',
          stage: 'completed',
          progress: 100,
          startedAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T11:15:00Z',
          metrics: {
            errorRate: 0.02,
            responseTime: 850,
            throughput: 1250,
            cpuUsage: 45,
            memoryUsage: 62
          }
        },
        {
          id: 'deploy-002',
          version: 'v2.1.1',
          environment: 'staging',
          status: 'in-progress',
          stage: 'canary',
          progress: 25,
          startedAt: '2024-01-15T14:00:00Z',
          metrics: {
            errorRate: 0.01,
            responseTime: 920,
            throughput: 1180,
            cpuUsage: 38,
            memoryUsage: 58
          }
        }
      ]);

      setSystemHealth({
        status: 'healthy',
        services: {
          api: true,
          database: true,
          redis: true,
          storage: true
        },
        lastCheck: new Date().toISOString()
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: DeploymentStatus['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'rolling-back': return 'text-orange-600';
      case 'in-progress': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: DeploymentStatus['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'rolling-back': return <RefreshCw className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const triggerRollback = async (deploymentId: string) => {
    console.log(`Déclenchement du rollback pour ${deploymentId}`);
    // Ici on déclencherait le rollback
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard de Déploiement</h1>
        <Button onClick={loadDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Santé du système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Santé du Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          {systemHealth && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}>
                  {systemHealth.status === 'healthy' ? 'Sain' : 'Problème'}
                </Badge>
                <span className="text-sm text-gray-500">
                  Dernière vérification: {new Date(systemHealth.lastCheck).toLocaleString('fr-FR')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(systemHealth.services).map(([service, isHealthy]) => (
                  <div key={service} className="flex items-center gap-2">
                    {isHealthy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deployments">Déploiements</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-4">
          {deployments.map((deployment) => (
            <Card key={deployment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{deployment.version}</CardTitle>
                    <Badge variant="outline">{deployment.environment}</Badge>
                    <div className={`flex items-center gap-1 ${getStatusColor(deployment.status)}`}>
                      {getStatusIcon(deployment.status)}
                      <span className="capitalize">{deployment.status}</span>
                    </div>
                  </div>
                  
                  {deployment.status === 'in-progress' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => triggerRollback(deployment.id)}
                    >
                      Rollback
                    </Button>
                  )}
                </div>
                
                <CardDescription>
                  Démarré le {new Date(deployment.startedAt).toLocaleString('fr-FR')}
                  {deployment.completedAt && (
                    ` • Terminé le ${new Date(deployment.completedAt).toLocaleString('fr-FR')}`
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {deployment.status === 'in-progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression ({deployment.stage})</span>
                      <span>{deployment.progress}%</span>
                    </div>
                    <Progress value={deployment.progress} />
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {(deployment.metrics.errorRate * 100).toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-500">Taux d'erreur</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {deployment.metrics.responseTime}ms
                    </div>
                    <div className="text-sm text-gray-500">Temps de réponse</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {deployment.metrics.throughput}
                    </div>
                    <div className="text-sm text-gray-500">Débit (req/min)</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {deployment.metrics.cpuUsage}%
                    </div>
                    <div className="text-sm text-gray-500">CPU</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {deployment.metrics.memoryUsage}%
                    </div>
                    <div className="text-sm text-gray-500">Mémoire</div>
                  </div>
                </div>

                {deployment.metrics.errorRate > 0.05 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Taux d'erreur élevé détecté. Surveiller de près ou envisager un rollback.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>
                Métriques en temps réel du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Uptime</p>
                        <p className="text-2xl font-bold">99.9%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Serveurs actifs</p>
                        <p className="text-2xl font-bold">12/12</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Connexions DB</p>
                        <p className="text-2xl font-bold">45/100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Requêtes/min</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Déploiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm bg-gray-50 p-4 rounded">
                <div className="text-green-600">[2024-01-15T14:05:23Z] INFO: Démarrage du déploiement v2.1.1</div>
                <div className="text-blue-600">[2024-01-15T14:05:24Z] INFO: Création du snapshot deploy_1705410324</div>
                <div className="text-blue-600">[2024-01-15T14:05:25Z] INFO: Stage canary (5%) - Déploiement en cours...</div>
                <div className="text-green-600">[2024-01-15T14:05:28Z] INFO: 5% du trafic redirigé vers la nouvelle version</div>
                <div className="text-blue-600">[2024-01-15T14:05:58Z] INFO: Health check OK - Erreurs: 0.01%, Réponse: 920ms</div>
                <div className="text-blue-600">[2024-01-15T14:06:28Z] INFO: Health check OK - Erreurs: 0.01%, Réponse: 890ms</div>
                <div className="text-blue-600">[2024-01-15T14:06:58Z] INFO: Health check OK - Erreurs: 0.02%, Réponse: 945ms</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStatsProps {
  organizationId?: string; // Optionnel pour filtrer par organisation
}

const DashboardStats = ({ organizationId }: DashboardStatsProps) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    missionsOverTime: [],
    skillsDistribution: [],
    impactMetrics: [],
    engagementLevels: [],
    sectorDistribution: [],
  });

  useEffect(() => {
    fetchStats();
  }, [organizationId]);

  const fetchStats = async () => {
    try {
      // Requête pour les missions dans le temps
      const { data: missionsOverTime } = await supabase
        .from("missions")
        .select("created_at, status")
        .order("created_at", { ascending: true })
        .eq(organizationId ? "organization_id" : "status", organizationId || "active");

      // Requête pour la distribution des compétences
      const { data: skillsDistribution } = await supabase
        .from("mission_skills")
        .select("skill_id, skills(name)")
        .eq(organizationId ? "mission:missions.organization_id" : "mission:missions.status", organizationId || "active");

      // Requête pour les métriques d'impact
      const { data: impactMetrics } = await supabase
        .from("missions")
        .select("desired_impact, engagement_level")
        .eq(organizationId ? "organization_id" : "status", organizationId || "active");

      // Requête pour les niveaux d'engagement
      const { data: engagementLevels } = await supabase
        .from("missions")
        .select("engagement_level")
        .eq(organizationId ? "organization_id" : "status", organizationId || "active");

      // Requête pour la distribution des secteurs
      const { data: sectorDistribution } = await supabase
        .from("missions")
        .select("organization:organization_profiles(sector:organization_sectors(name))")
        .eq(organizationId ? "organization_id" : "status", organizationId || "active");

      setStats({
        missionsOverTime: missionsOverTime || [],
        skillsDistribution: skillsDistribution || [],
        impactMetrics: impactMetrics || [],
        engagementLevels: engagementLevels || [],
        sectorDistribution: sectorDistribution || [],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  const prepareMissionsOverTimeData = () => {
    const monthlyData = stats.missionsOverTime.reduce((acc: any, mission: any) => {
      const month = new Date(mission.created_at).toLocaleString("fr-FR", { month: "long" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: "Missions créées",
          data: Object.values(monthlyData),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareSkillsDistributionData = () => {
    const skillCounts = stats.skillsDistribution.reduce((acc: any, item: any) => {
      const skillName = item.skills?.name || "Inconnu";
      acc[skillName] = (acc[skillName] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(skillCounts),
      datasets: [
        {
          label: "Compétences requises",
          data: Object.values(skillCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
        },
      ],
    };
  };

  const prepareEngagementLevelsData = () => {
    const levelCounts = stats.engagementLevels.reduce((acc: any, mission: any) => {
      acc[mission.engagement_level] = (acc[mission.engagement_level] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(levelCounts),
      datasets: [
        {
          label: "Niveaux d'engagement",
          data: Object.values(levelCounts),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
    };
  };

  const prepareSectorDistributionData = () => {
    const sectorCounts = stats.sectorDistribution.reduce((acc: any, mission: any) => {
      const sectorName = mission.organization?.sector?.name || "Non spécifié";
      acc[sectorName] = (acc[sectorName] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(sectorCounts),
      datasets: [
        {
          label: "Distribution par secteur",
          data: Object.values(sectorCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
          ],
        },
      ],
    };
  };

  const prepareImpactData = () => {
    return {
      labels: ['Impact Social', 'Impact Éducatif', 'Impact Environnemental', 'Impact Culturel'],
      datasets: [
        {
          label: 'Impact',
          data: [65, 45, 35, 25],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }
      ]
    };
  };

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des missions</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={prepareMissionsOverTimeData()} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des secteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <Doughnut data={prepareSectorDistributionData()} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Niveaux d'engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={prepareEngagementLevelsData()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des compétences</CardTitle>
            </CardHeader>
            <CardContent>
              <Doughnut data={prepareSkillsDistributionData()} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impact social</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={prepareImpactData()} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardStats; 
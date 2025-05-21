import { useAuth } from "@/hooks/useAuth";
import DashboardBenevole from "@/components/dashboard/DashboardBenevole";
import DashboardAssociation from "@/components/dashboard/DashboardAssociation";

const Dashboard = () => {
  const { profile } = useAuth();

  if (!profile) return <div>Chargement...</div>;

  return profile.is_association ? <DashboardAssociation /> : <DashboardBenevole />;
};

export default Dashboard;

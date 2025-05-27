import { useAuth } from "@/hooks/useAuth";
import DashboardBenevole from "@/components/dashboard/DashboardBenevole";
import DashboardAssociation from "@/components/dashboard/DashboardAssociation";

const Dashboard = () => {
  const { profile } = useAuth();

  if (!profile) return <div>Chargement...</div>;

  // Vérifier si c'est une organisation en utilisant la propriété is_organization du profil
  const isOrganization = profile.is_organization === true;

  return isOrganization ? <DashboardAssociation /> : <DashboardBenevole />;
};

export default Dashboard;

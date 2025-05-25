
import { useAuth } from "@/hooks/useAuth";
import DashboardBenevole from "@/components/dashboard/DashboardBenevole";
import DashboardAssociation from "@/components/dashboard/DashboardAssociation";

const Dashboard = () => {
  const { profile } = useAuth();

  if (!profile) return <div>Chargement...</div>;

  // For now, we'll check if it's an organization based on whether profile has organization-specific fields
  // This is a temporary solution until we have a proper way to distinguish user types
  const isOrganization = false; // Default to volunteer for now

  return isOrganization ? <DashboardAssociation /> : <DashboardBenevole />;
};

export default Dashboard;

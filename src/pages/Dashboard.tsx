
import { useAuth } from "@/hooks/useAuth";
import DashboardBenevole from "@/components/dashboard/DashboardBenevole";
import DashboardAssociation from "@/components/dashboard/DashboardAssociation";

const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const { profile, isLoading, user } = useAuth();
  
  console.log('Dashboard - user:', user);
  console.log('Dashboard - profile:', profile);
  console.log('Dashboard - isLoading:', isLoading);
  console.log('Dashboard - profile.is_organization:', profile?.is_organization);

  if (isLoading) {
    console.log('Dashboard - showing loading state');
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard - no user found, showing message');
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Utilisateur non connecté</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log('Dashboard - no profile found, showing message');
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Profil non trouvé</p>
          <p className="text-sm text-gray-500 mt-2">Essayez de vous reconnecter</p>
        </div>
      </div>
    );
  }

  // Vérifier si c'est une organisation en utilisant la propriété is_organization du profil
  const isOrganization = profile.is_organization === true;
  
  console.log('Dashboard - isOrganization:', isOrganization);
  console.log('Dashboard - rendering dashboard for:', isOrganization ? 'organization' : 'volunteer');

  return isOrganization ? <DashboardAssociation /> : <DashboardBenevole />;
};

export default Dashboard;

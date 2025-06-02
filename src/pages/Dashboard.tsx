
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DashboardBenevole from '@/components/dashboard/DashboardBenevole';
import DashboardAssociation from '@/components/dashboard/DashboardAssociation';

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Configuration du profil en cours...</p>
        </div>
      </div>
    );
  }

  return profile.is_organization ? <DashboardAssociation /> : <DashboardBenevole />;
};

export default Dashboard;

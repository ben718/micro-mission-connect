
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProfileRouter = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers la page de profil appropriée selon le type d'utilisateur
  if (profile.is_organization) {
    return <Navigate to="/profile/organization" replace />;
  }

  return <Navigate to="/profile/volunteer" replace />;
};

export default ProfileRouter;

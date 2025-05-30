
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import ProfileBenevole from '@/pages/ProfileBenevole';

const ProfileVolunteer = () => {
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

  if (profile.is_organization) {
    return <Navigate to="/profile/organization" replace />;
  }

  return <ProfileBenevole />;
};

export default ProfileVolunteer;

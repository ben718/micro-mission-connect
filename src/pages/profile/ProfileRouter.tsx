
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProfileRouter = () => {
  const { profile, isLoading, user } = useAuth();

  console.log('ProfileRouter - user:', user);
  console.log('ProfileRouter - profile:', profile);
  console.log('ProfileRouter - isLoading:', isLoading);
  console.log('ProfileRouter - profile.is_organization:', profile?.is_organization);

  if (isLoading) {
    console.log('ProfileRouter - showing loading state');
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProfileRouter - no user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    console.log('ProfileRouter - no profile found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProfileRouter - checking is_organization:', profile.is_organization);
  
  if (profile.is_organization === true) {
    console.log('ProfileRouter - redirecting to organization profile');
    return <Navigate to="/profile/organization" replace />;
  }

  console.log('ProfileRouter - redirecting to volunteer profile');
  return <Navigate to="/profile/volunteer" replace />;
};

export default ProfileRouter;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProfileRouter = () => {
  const { profile } = useAuth();

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (profile.is_organization) {
    return <Navigate to="/profile/organization" replace />;
  }

  return <Navigate to="/profile/volunteer" replace />;
};

export default ProfileRouter;

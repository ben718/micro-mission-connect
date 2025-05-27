import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import AssociationHome from "@/pages/AssociationHome";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DashboardAssociation from "@/components/dashboard/DashboardAssociation";
import DashboardVolunteer from "@/components/dashboard/DashboardVolunteer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loading from "@/components/ui/loading";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Confirmation from "./pages/auth/Confirmation";
import { MissionsPage } from "@/pages/missions/MissionsPage";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import Header from "./components/layout/Header";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import ProfileOrganization from "@/pages/profile/ProfileOrganization";
import ProfileVolunteer from "@/pages/profile/ProfileVolunteer";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  console.log("[PrivateRoute] State:", { user: !!user, loading });

  if (loading) {
    console.log("[PrivateRoute] Loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log("[PrivateRoute] No user, redirecting to login");
    return <Navigate to="/auth/login" />;
  }

  console.log("[PrivateRoute] User authenticated, showing content");
  return <>{children}</>;
};

const ProfileRoute = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect to the appropriate profile based on user type
  return profile?.first_name ? (
    <Navigate to="/profile/association" />
  ) : (
    <Navigate to="/profile/benevole" />
  );
};

const App = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <Loading size={32} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={!profile ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!profile ? <Register /> : <Navigate to="/" />} />

            {/* Routes protégées */}
            <Route
              path="/"
              element={
                profile ? (
                  <Layout>
                    {profile.type === "organization" ? <AssociationHome /> : <Home />}
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                profile ? (
                  <Layout>
                    {profile.type === "organization" ? (
                      <DashboardAssociation />
                    ) : (
                      <DashboardVolunteer />
                    )}
                  </Layout>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route path="/auth/confirmation" element={<Confirmation />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/missions/:id" element={<MissionDetail />} />
            <Route path="/missions/new" element={
              <PrivateRoute>
                <CreateMission />
              </PrivateRoute>
            } />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileRoute />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/benevole"
              element={
                <PrivateRoute>
                  <ProfileBenevole />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/association"
              element={
                <PrivateRoute>
                  <ProfileAssociation />
                </PrivateRoute>
              }
            />
            <Route path="/profile/organization" element={<ProfileOrganization />} />
            <Route path="/profile/volunteer" element={<ProfileVolunteer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

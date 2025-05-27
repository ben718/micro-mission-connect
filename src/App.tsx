import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
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
import { MissionsPage } from "@/pages/missions/MissionsPage";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <Loading size={32} />;
  }

  if (!profile) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <Loading size={32} />;
  }

  return (
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

        {/* Routes des missions */}
        <Route
          path="/missions"
          element={
            <PrivateRoute>
              <Layout>
                <MissionsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/missions/:id"
          element={
            <PrivateRoute>
              <Layout>
                <MissionDetail />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/missions/new"
          element={
            <PrivateRoute>
              <Layout>
                <CreateMission />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

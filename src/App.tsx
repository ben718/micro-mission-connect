
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProfileBenevole from "@/pages/ProfileBenevole";
import ProfileAssociation from "@/pages/ProfileAssociation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Confirmation from "./pages/auth/Confirmation";
import { MissionsPage } from "@/pages/missions/MissionsPage";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";
import { Loader2 } from "lucide-react";
import ProfileOrganization from "@/pages/profile/ProfileOrganization";
import ProfileVolunteer from "@/pages/profile/ProfileVolunteer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

const ProfileRoute = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return profile?.is_organization ? (
    <Navigate to="/profile/association" />
  ) : (
    <Navigate to="/profile/benevole" />
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

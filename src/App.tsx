
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
import MissionsPage from "./pages/missions/MissionsPage";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  console.log("[PrivateRoute] État:", { user: !!user, isLoading });

  if (isLoading) {
    console.log("[PrivateRoute] Chargement en cours...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log("[PrivateRoute] Pas d'utilisateur, redirection vers login");
    return <Navigate to="/auth/login" />;
  }

  console.log("[PrivateRoute] Utilisateur authentifié, affichage du contenu");
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

  // Rediriger vers le bon profil selon le type d'utilisateur
  return profile?.is_association ? (
    <Navigate to="/profile/association" />
  ) : (
    <Navigate to="/profile/benevole" />
  );
};

const App = () => {
  useEffect(() => {
    console.log("[App] Initialisation du composant App");
  }, []);

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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

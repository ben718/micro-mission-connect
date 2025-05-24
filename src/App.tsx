
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Confirmation from "./pages/auth/Confirmation";
import MissionsPage from "./pages/Missions";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
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
              <Route path="/missions" element={<MissionsPage />} />
              <Route path="/missions/:id" element={<MissionDetail />} />
              
              {/* Routes publiques (déconnecté uniquement) */}
              <Route path="/auth/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/auth/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/auth/confirmation" element={<Confirmation />} />

              {/* Routes privées (connecté uniquement) */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/missions/new" element={
                <PrivateRoute>
                  <CreateMission />
                </PrivateRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

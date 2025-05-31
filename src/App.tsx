import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Confirmation from "@/pages/auth/Confirmation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/Notifications";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { MissionsPage } from "@/pages/missions/MissionsPage";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Loader2 } from "lucide-react";
import ProfileOrganization from "@/pages/profile/ProfileOrganization";
import ProfileVolunteer from "@/pages/profile/ProfileVolunteer";
import AssociationsActivity from "@/pages/associations/AssociationsActivity";
import VolunteerProfile from "@/pages/profile/VolunteerProfile";
import OrganizationProfile from "@/pages/profile/OrganizationProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
    return <Navigate to="/auth/login" replace />;
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
    return <Navigate to="/auth/login" replace />;
  }

  return profile?.is_organization ? (
    <Navigate to="/profile/organization" replace />
  ) : (
    <Navigate to="/profile/volunteer" replace />
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
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/notifications" element={
                    <PrivateRoute>
                      <NotificationsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/associations" element={
                    <PrivateRoute>
                      <AssociationsActivity />
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
                    path="/profile/organization"
                    element={
                      <PrivateRoute>
                        <ProfileOrganization />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/volunteer"
                    element={
                      <PrivateRoute>
                        <ProfileVolunteer />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/volunteer/public"
                    element={
                      <PrivateRoute>
                        <VolunteerProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/organization/public"
                    element={
                      <PrivateRoute>
                        <OrganizationProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

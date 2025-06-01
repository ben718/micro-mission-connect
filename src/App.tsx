
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Confirmation from "./pages/auth/Confirmation";
import Missions from "./pages/Missions";
import MissionsPage from "./pages/missions/MissionsPage";
import MissionDetailPage from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import EditMission from "./pages/missions/EditMission";
import ProfileRouter from "./pages/profile/ProfileRouter";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import AssociationsPage from "./pages/associations/AssociationsPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ErrorBoundary } from "./components/error/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.message?.includes('404') || error?.message?.includes('not found')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/missions" element={<Missions />} />
                    <Route path="/missions/list" element={<MissionsPage />} />
                    <Route path="/missions/:id" element={<MissionDetailPage />} />
                    <Route path="/missions/create" element={<CreateMission />} />
                    <Route path="/missions/:id/edit" element={<EditMission />} />
                    <Route path="/profile/*" element={<ProfileRouter />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/associations" element={<AssociationsPage />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    {/* Redirect undefined footer links to coming soon */}
                    <Route path="/faq" element={<ComingSoon />} />
                    <Route path="/help" element={<ComingSoon />} />
                    <Route path="/terms" element={<ComingSoon />} />
                    <Route path="/privacy" element={<ComingSoon />} />
                    <Route path="/legal" element={<ComingSoon />} />
                    <Route path="/cookies" element={<ComingSoon />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;

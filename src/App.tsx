
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Confirmation from "./pages/auth/Confirmation";
import MissionsPage from "./pages/missions/MissionsPage";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import UserProfile from "./pages/profile/UserProfile";
import AssociationProfile from "./pages/profile/AssociationProfile";
import Dashboard from "./pages/Dashboard";
import Header from "./components/layout/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/confirmation" element={<Confirmation />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/missions/:id" element={<MissionDetail />} />
            <Route path="/missions/new" element={<CreateMission />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/association/:id" element={<AssociationProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

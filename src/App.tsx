
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Confirmation from "./pages/auth/Confirmation";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/missions/MissionDetail";
import CreateMission from "./pages/missions/CreateMission";
import EditMission from "./pages/missions/EditMission";
import AssociationsActivity from "./pages/associations/AssociationsActivity";
import AssociationsPage from "./pages/associations/AssociationsPage";
import ProfileRouter from "./pages/profile/ProfileRouter";
import ProfileVolunteer from "./pages/profile/ProfileVolunteer";
import ProfileOrganization from "./pages/profile/ProfileOrganization";
import PublicVolunteerProfile from "./pages/profile/PublicVolunteerProfile";
import PublicOrganizationProfile from "./pages/profile/PublicOrganizationProfile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/confirmation" element={<Confirmation />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/missions" element={<Missions />} />
                  <Route path="/missions/:id" element={<MissionDetail />} />
                  <Route path="/missions/create" element={<CreateMission />} />
                  <Route path="/missions/:id/edit" element={<EditMission />} />
                  <Route path="/associations" element={<AssociationsPage />} />
                  <Route path="/associations/activity" element={<AssociationsActivity />} />
                  <Route path="/profile" element={<ProfileRouter />} />
                  <Route path="/profile/volunteer" element={<ProfileVolunteer />} />
                  <Route path="/profile/organization" element={<ProfileOrganization />} />
                  <Route path="/volunteer/:userId" element={<PublicVolunteerProfile />} />
                  <Route path="/organization/:organizationId" element={<PublicOrganizationProfile />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

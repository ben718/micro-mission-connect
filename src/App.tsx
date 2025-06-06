
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages utilisateur
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ExplorePage from './pages/dashboard/ExplorePage';
import MissionDetailPage from './pages/dashboard/MissionDetailPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import MyMissionsPage from './pages/dashboard/MyMissionsPage';
import ImpactPage from './pages/dashboard/ImpactPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages association
import AssociationDashboard from './pages/association/AssociationDashboard';
import MissionListPage from './pages/association/MissionListPage';
import CreateMissionPage from './pages/association/CreateMissionPage';
import MissionVolunteersPage from './pages/association/MissionVolunteersPage';
import AssociationReportsPage from './pages/association/AssociationReportsPage';
import AssociationSettingsPage from './pages/association/AssociationSettingsPage';

// Contextes et stores
import { AuthProvider } from './contexts/AuthContext';
import { useAuthStore } from './stores/authStore';
import { useMissionStore } from './stores/missionStore';

// Création du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { fetchMissions } = useMissionStore();
  const { checkAuth } = useAuthStore();
  
  // Préchargement des données au démarrage de l'application
  React.useEffect(() => {
    checkAuth();
    fetchMissions();
  }, [fetchMissions, checkAuth]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              
              {/* Routes d'authentification */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>
              
              {/* Routes protégées - Bénévoles */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/explore" replace />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="missions/:id" element={<MissionDetailPage />} />
                <Route path="missions" element={<MyMissionsPage />} />
                <Route path="impact" element={<ImpactPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              
              {/* Routes protégées - Associations */}
              <Route path="/association" element={
                <ProtectedRoute role="association">
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/association/dashboard" replace />} />
                <Route path="dashboard" element={<AssociationDashboard />} />
                <Route path="missions" element={<MissionListPage />} />
                <Route path="missions/new" element={<CreateMissionPage />} />
                <Route path="missions/:id/edit" element={<CreateMissionPage />} />
                <Route path="missions/:id/volunteers" element={<MissionVolunteersPage />} />
                <Route path="reports" element={<AssociationReportsPage />} />
                <Route path="settings" element={<AssociationSettingsPage />} />
              </Route>
              
              {/* Route 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Composant pour protéger les routes qui nécessitent une authentification
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'user' | 'association' }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérification du rôle si spécifié
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'association' ? '/association' : '/app'} replace />;
  }
  
  return <>{children}</>;
}

export default App;

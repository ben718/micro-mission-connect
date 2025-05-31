
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est connecté et que le profil est chargé
    if (user && profile && !isLoading) {
      // Rediriger vers le dashboard approprié selon le type de profil
      if (profile.is_organization) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, profile, isLoading, navigate]);

  // Afficher un loader pendant que les données se chargent
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil normale
  if (!user) {
    return (
      <div className="min-h-screen">
        <HeroSection />
        <FeatureSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    );
  }

  // Si on arrive ici, c'est que l'utilisateur est connecté mais qu'on attend encore le profil
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Index;

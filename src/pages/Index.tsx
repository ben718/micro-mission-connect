
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";
import { SearchSection } from "@/components/home/SearchSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>MicroBénévole - Offrez votre temps, même 15 minutes comptent</title>
        <meta name="description" content="Rejoignez notre communauté et transformez des moments libres en actions concrètes pour les associations qui ont besoin de vous." />
      </Helmet>
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <SearchSection />
        <TestimonialsSection />
        {!user && <CtaSection />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;

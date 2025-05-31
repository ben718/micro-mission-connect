
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const CtaSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRegister = () => {
    navigate("/auth/register");
  };

  const handleLearnMore = () => {
    navigate("/missions");
  };

  if (user) {
    return null; // Don't show CTA if user is already logged in
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative bg-gradient-to-r from-bleu-700 to-bleu overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 lg:mb-6">
            Prêt à transformer quelques minutes en impact concret ?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-50 mb-6 lg:mb-8 leading-relaxed max-w-3xl mx-auto">
            Rejoignez notre communauté et découvrez comment de petites actions
            peuvent faire une grande différence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 lg:gap-4">
            <Button
              onClick={handleRegister}
              className="bg-white text-bleu hover:bg-blue-50 rounded-full py-3 px-6 lg:px-8 text-sm lg:text-base font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              S'inscrire gratuitement
            </Button>
            <Button
              onClick={handleLearnMore}
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full py-3 px-6 lg:px-8 text-sm lg:text-base font-medium w-full sm:w-auto"
            >
              Voir les missions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

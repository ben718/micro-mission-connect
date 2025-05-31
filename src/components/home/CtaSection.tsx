
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 relative bg-gradient-to-r from-bleu-700 to-bleu overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-bleu-600 clip-circle-right opacity-50 hidden lg:block"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-3/4 bg-jaune/20 clip-blob-left blur-3xl hidden lg:block"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 px-2">
            Prêt à transformer quelques minutes en impact concret ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-50 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4 leading-relaxed max-w-3xl mx-auto">
            Rejoignez notre communauté et découvrez comment de petites actions
            peuvent faire une grande différence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2 sm:px-4">
            <Button
              className="bg-white text-bleu hover:bg-blue-50 rounded-full py-3 px-5 sm:py-4 sm:px-6 md:py-5 md:px-8 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              S'inscrire gratuitement
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full py-3 px-5 sm:py-4 sm:px-6 md:py-5 md:px-8 text-sm sm:text-base md:text-lg w-full sm:w-auto"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

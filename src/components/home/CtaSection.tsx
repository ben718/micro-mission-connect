
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative bg-gradient-to-r from-bleu-700 to-bleu overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8">
            Prêt à transformer quelques minutes en impact concret ?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-50 mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto">
            Rejoignez notre communauté et découvrez comment de petites actions
            peuvent faire une grande différence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
            <Button
              className="bg-white text-bleu hover:bg-blue-50 rounded-full py-3 px-8 text-base lg:text-lg font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              S'inscrire gratuitement
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full py-3 px-8 text-base lg:text-lg font-medium w-full sm:w-auto"
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

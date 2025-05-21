
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="section relative bg-gradient-to-r from-bleu-700 to-bleu py-20">
      <div className="absolute inset-0 bg-grid-white/10 bg-fixed opacity-20"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-bleu-600 clip-circle-right opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-3/4 bg-jaune/20 clip-blob-left blur-3xl"></div>
      
      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à transformer quelques minutes en impact concret ?
          </h2>
          <p className="text-lg md:text-xl text-blue-50 mb-8">
            Rejoignez notre communauté et découvrez comment de petites actions
            peuvent faire une grande différence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="bg-white text-bleu hover:bg-blue-50 rounded-full py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              S'inscrire gratuitement
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full py-6 px-8 text-lg"
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

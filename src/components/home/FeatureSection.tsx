import { usePlatformFeatures } from "@/hooks/usePlatformFeatures";
import * as LucideIcons from "lucide-react";

const FeatureSection = () => {
  const { data: features, isLoading, error } = usePlatformFeatures();

  if (isLoading) {
    return (
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pourquoi choisir Voisin Solidaire ?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Une plateforme pensée pour simplifier l'engagement bénévole
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="bg-gray-200 h-16 w-16 rounded-full mx-auto mb-6"></div>
                <div className="bg-gray-200 h-6 w-32 mx-auto mb-4 rounded"></div>
                <div className="bg-gray-200 h-20 w-full rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !features || features.length === 0) {
    return (
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pourquoi choisir Voisin Solidaire ?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Une plateforme pensée pour simplifier l'engagement bénévole
            </p>
          </div>
          <div className="text-center text-gray-500">
            <p>Fonctionnalités en cours de chargement...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pourquoi choisir Voisin Solidaire ?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Une plateforme pensée pour simplifier l'engagement bénévole
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = (LucideIcons as any)[feature.icon_name];
            
            return (
              <div key={feature.id} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mb-6 ${feature.color_class}`}>
                  {IconComponent && <IconComponent className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;


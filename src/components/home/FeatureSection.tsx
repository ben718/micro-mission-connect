
import { Award, Clock, Search } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-bleu" />,
      title: "Trouver rapidement",
      description:
        "Trouvez des missions qui correspondent à vos disponibilités en quelques clics grâce à notre moteur de recherche avancé."
    },
    {
      icon: <Clock className="h-8 w-8 text-jaune" />,
      title: "Missions flexibles",
      description:
        "Des missions de courte durée, faciles à intégrer dans votre emploi du temps, même le plus chargé."
    },
    {
      icon: <Award className="h-8 w-8 text-bleu" />,
      title: "Valider ses compétences",
      description:
        "Gagnez des badges numériques qui valorisent votre engagement et les compétences acquises lors de vos missions."
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Une nouvelle façon de s'engager
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            MicroBénévole rend le bénévolat accessible à tous, quelle que soit 
            votre disponibilité et vos compétences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-gray-50 rounded-2xl mb-6 group-hover:bg-blue-50 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

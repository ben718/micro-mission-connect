
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
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Une nouvelle façon de s'engager
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-4 leading-relaxed">
            MicroBénévole rend le bénévolat accessible à tous, quelle que soit 
            votre disponibilité et vos compétences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gray-50 rounded-full mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

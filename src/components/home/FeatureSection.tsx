
import { Award, Clock, Search } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-bleu" />,
      title: "Trouver rapidement",
      description:
        "Trouvez des missions qui correspondent à vos disponibilités en quelques clics grâce à notre moteur de recherche avancé."
    },
    {
      icon: <Clock className="h-10 w-10 text-jaune" />,
      title: "Missions flexibles",
      description:
        "Des missions de courte durée, faciles à intégrer dans votre emploi du temps, même le plus chargé."
    },
    {
      icon: <Award className="h-10 w-10 text-bleu" />,
      title: "Valider ses compétences",
      description:
        "Gagnez des badges numériques qui valorisent votre engagement et les compétences acquises lors de vos missions."
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Une nouvelle façon de s'engager
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            MicroBénévole rend le bénévolat accessible à tous, quelle que soit 
            votre disponibilité et vos compétences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-gray-50 rounded-full mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { profile } = useAuth();

  let title = (
    <>
      <span className="block">Offrez votre temps,</span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
        même 15 minutes comptent
      </span>
    </>
  );
  let description =
    "Rejoignez notre communauté et transformez des moments libres en actions concrètes pour les associations qui ont besoin de vous.";
  let primaryBtn = <Button asChild className="text-white bg-bleu hover:bg-bleu-700 rounded-full py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all"><Link to="/missions">Trouver une mission</Link></Button>;
  let secondaryBtn = <Button asChild variant="outline" className="border-bleu text-bleu hover:bg-bleu-50 rounded-full py-6 px-8 text-lg"><Link to="/missions/new">Proposer une mission</Link></Button>;

  if (profile?.role === 'association') {
    title = (
      <>
        <span className="block">Mobilisez des bénévoles,</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
          publiez vos missions simplement
        </span>
      </>
    );
    description = "Publiez vos missions, suivez vos bénévoles et valorisez l'engagement associatif sur MicroBénévole.";
    primaryBtn = <Button asChild className="text-white bg-bleu hover:bg-bleu-700 rounded-full py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all"><Link to="/missions/new">Créer une mission</Link></Button>;
    secondaryBtn = <Button asChild variant="outline" className="border-bleu text-bleu hover:bg-bleu-50 rounded-full py-6 px-8 text-lg"><Link to="/profile/association">Mon espace asso</Link></Button>;
  } else if (profile?.role === 'benevole') {
    title = (
      <>
        <span className="block">Trouvez votre prochaine mission,</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
          engagez-vous à votre rythme
        </span>
      </>
    );
    description = "Découvrez des missions adaptées à vos envies et disponibilités, et suivez votre impact solidaire.";
    primaryBtn = <Button asChild className="text-white bg-bleu hover:bg-bleu-700 rounded-full py-6 px-8 text-lg shadow-lg hover:shadow-xl transition-all"><Link to="/missions">Trouver une mission</Link></Button>;
    secondaryBtn = <Button asChild variant="outline" className="border-bleu text-bleu hover:bg-bleu-50 rounded-full py-6 px-8 text-lg"><Link to="/profile/benevole">Mon espace bénévole</Link></Button>;
  }

  return (
    <section className="py-12 lg:py-20 overflow-hidden relative bg-gradient-to-b from-white to-blue-50">
      <div className="absolute inset-0 bg-grid-bleu-100/40 bg-fixed"></div>
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              {description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {primaryBtn}
              {secondaryBtn}
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-jaune/20 rounded-full filter blur-xl animate-pulse-light"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-bleu/20 rounded-full filter blur-xl animate-pulse-light" style={{ animationDelay: "1s" }}></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1540317700647-ec69694d70d0?auto=format&fit=crop&q=80&w=2000" 
                  alt="Bénévoles engagés dans diverses micro-missions"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute -bottom-1 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-jaune flex items-center justify-center flex-shrink-0">
                        <span className="text-bleu text-xl font-bold">15</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-bleu">Distribution de repas</h3>
                        <p className="text-sm text-gray-600">Aujourd'hui • 15 minutes • 1,5 km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

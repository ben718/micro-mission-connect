
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user, profile } = useAuth();

  let title = (
    <>
      <span className="block text-bleu">Offrez votre temps,</span>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
        même 15 minutes comptent
      </span>
    </>
  );
  let description =
    "Rejoignez notre communauté et transformez des moments libres en actions concrètes pour les associations qui ont besoin de vous.";
  let primaryBtn = (
    <Button asChild className="bg-bleu text-white hover:bg-bleu-700 rounded-full px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
      <Link to="/missions">Trouver une mission</Link>
    </Button>
  );
  let secondaryBtn = (
    <Button asChild variant="outline" className="border-bleu text-bleu hover:bg-bleu-50 rounded-full px-6 py-3 text-base font-medium w-full sm:w-auto">
      <Link to="/auth/register">Créer un compte</Link>
    </Button>
  );

  if (profile?.is_organization) {
    title = (
      <>
        <span className="block">Mobilisez des bénévoles,</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
          publiez vos missions simplement
        </span>
      </>
    );
    description = "Publiez vos missions, suivez vos bénévoles et valorisez l'engagement associatif sur MicroBénévole.";
    primaryBtn = (
      <Button asChild className="text-white bg-bleu hover:bg-bleu-700 rounded-full px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
        <Link to="/missions/new">Créer une mission</Link>
      </Button>
    );
    secondaryBtn = (
      <Button asChild variant="outline" className="border-bleu text-bleu hover:bg-bleu-50 rounded-full px-6 py-3 text-base font-medium w-full sm:w-auto">
        <Link to="/profile/association">Mon espace asso</Link>
      </Button>
    );
  } else if (profile && !profile.is_organization) {
    title = (
      <>
        <span className="block">Trouvez votre prochaine mission,</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-bleu to-bleu-400">
          engagez-vous à votre rythme
        </span>
      </>
    );
    description = "Découvrez des missions adaptées à vos envies et disponibilités, et suivez votre impact solidaire.";
    primaryBtn = (
      <Button asChild className="text-white bg-bleu hover:bg-bleu-700 rounded-full px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
        <Link to="/missions">Trouver une mission</Link>
      </Button>
    );
    secondaryBtn = (
      <Button asChild variant="outline" className="border-bleu text-bleu hover:bg-bleu-50 rounded-full px-6 py-3 text-base font-medium w-full sm:w-auto">
        <Link to="/profile/benevole">Mon espace bénévole</Link>
      </Button>
    );
  }

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="absolute inset-0 bg-grid-bleu-100/20"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px]">
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              {primaryBtn}
              {secondaryBtn}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1540317700647-ec69694d70d0?auto=format&fit=crop&q=80&w=400" 
                  alt="Bénévoles engagés dans diverses micro-missions"
                  className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm font-bold">15</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-blue-600 text-sm mb-1">Distribution de repas</h3>
                        <p className="text-xs text-gray-600">Aujourd'hui • 15 minutes • 1,5 km</p>
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

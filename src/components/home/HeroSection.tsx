
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Ensemble, créons du sens
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Trouvez la mission de bénévolat qui vous correspond et faites la différence
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link to="/auth/register">Commencer maintenant</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/missions">Découvrir les missions</Link>
              </Button>
            </>
          ) : (
            <>
              {user.is_organization ? (
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/missions/create">Créer une mission</Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/missions">Trouver une mission</Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/dashboard">Mon tableau de bord</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

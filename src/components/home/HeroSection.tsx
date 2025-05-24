
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (location) params.set("city", location);
    navigate(`/missions?${params.toString()}`);
  };

  const isOrganization = profile?.is_association;

  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-blue-50 to-white flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Offrez votre temps,{" "}
                <span className="text-blue-600">même 15 minutes comptent</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Rejoignez notre communauté et transformez des moments libres en actions concrètes 
                pour les associations qui ont besoin de vous.
              </p>
            </div>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/missions">Trouver une mission</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth/register">Créer un compte</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/missions">Trouver une mission</Link>
                </Button>
                {isOrganization && (
                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboard">Mon tableau de bord</Link>
                  </Button>
                )}
              </div>
            )}

            {/* Search bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Rechercher des missions près de chez vous
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Rechercher une mission..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Ville..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Mission card example */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">15</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Distribution de repas</h4>
                  <p className="text-sm text-gray-500">Aujourd'hui • 15 minutes • 1.5 km</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl h-32 mb-4 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/cd08c8ca-f0ba-4aca-9724-5a1929fb6572.png" 
                  alt="Illustration mission" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Participer à cette mission
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCategories } from "@/hooks/useMissions";

const SearchSection = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSearch = () => {
    // Construire une URL avec les paramètres de recherche
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append("query", searchQuery);
    }
    
    if (selectedLocation && selectedLocation !== "all") {
      params.append("city", selectedLocation);
    }
    
    if (selectedDuration && selectedDuration !== "all") {
      params.append("duration", selectedDuration);
    }
    
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(catId => {
        params.append("category", catId);
      });
    }
    
    // Rediriger vers la page des missions avec les filtres
    navigate(`/missions?${params.toString()}`);
  };

  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Recherche rapide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trouvez immédiatement des micro-missions qui correspondent à votre profil et vos disponibilités.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Input 
                placeholder="Rechercher une mission..."
                className="pl-10 pr-4 py-6 rounded-lg border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="md:col-span-3">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full py-6 rounded-lg border-gray-200">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Localisation" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les localisations</SelectItem>
                  <SelectItem value="Paris">Paris</SelectItem>
                  <SelectItem value="Lyon">Lyon</SelectItem>
                  <SelectItem value="Marseille">Marseille</SelectItem>
                  <SelectItem value="remote">À distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3">
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-full py-6 rounded-lg border-gray-200">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Durée" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les durées</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="120">Plus d'une heure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-1 flex items-center justify-center">
              <Button
                size="icon"
                variant="outline"
                className="h-full w-full rounded-lg border-gray-200"
                aria-label="Plus de filtres"
                onClick={() => navigate('/missions')}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.slice(0, 5).map((category) => (
              <Badge 
                key={category.id} 
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className={`py-2 px-3 rounded-full cursor-pointer ${
                  selectedCategories.includes(category.id) 
                    ? "bg-bleu hover:bg-bleu-700" 
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              className="bg-bleu hover:bg-bleu-700 text-white py-6 px-8 rounded-xl shadow text-lg"
              onClick={handleSearch}
            >
              Rechercher des missions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;

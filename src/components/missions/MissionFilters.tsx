
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useCategories, useCities } from "@/hooks/useMissions";
import { MissionFilters as MissionFiltersType, DateRangeSelection } from "@/types/mission";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, X, MapPin, Navigation } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface MissionFiltersProps {
  onFilterChange: (filters: MissionFiltersType) => void;
}

const MissionFilters = ({ onFilterChange }: MissionFiltersProps) => {
  const { data: categories = [] } = useCategories();
  const { data: cities = [] } = useCities();
  const location = useLocation();

  const [filters, setFilters] = useState<MissionFiltersType>({});
  const [dateRange, setDateRange] = useState<DateRangeSelection>({
    from: undefined,
    to: undefined
  });
  const [searchCity, setSearchCity] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const handleFilterChange = <T extends keyof MissionFiltersType>(
    key: T,
    value: MissionFiltersType[T]
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Si la valeur est vide ou 'all', supprimer la propriété
      if (value === "" || value === undefined || value === "all" || (Array.isArray(value) && value.length === 0)) {
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  const handleDateRangeChange = (range: DateRangeSelection | undefined) => {
    // Make sure range is defined before using it
    if (!range) {
      setDateRange({ from: undefined, to: undefined });
      handleFilterChange("dateRange", undefined);
      return;
    }
    
    // Si la date sélectionnée est la même que celle déjà sélectionnée, la désélectionner
    if (range.from && dateRange.from && 
        range.from.getTime() === dateRange.from.getTime() && 
        !range.to && !dateRange.to) {
      setDateRange({ from: undefined, to: undefined });
      handleFilterChange("dateRange", undefined);
      return;
    }
    
    setDateRange({
      from: range.from,
      to: range.to
    });
    
    // Only set the dateRange filter if we actually have dates
    if (range.from || range.to) {
      handleFilterChange("dateRange", {
        start: range.from,
        end: range.to
      });
    } else {
      // If both dates are undefined, remove the filter
      handleFilterChange("dateRange", undefined);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categoryIds || [];
    let newCategories: string[];

    if (currentCategories.includes(categoryId)) {
      newCategories = currentCategories.filter((id) => id !== categoryId);
    } else {
      newCategories = [...currentCategories, categoryId];
    }

    handleFilterChange("categoryIds", newCategories);
  };

  const handleReset = () => {
    setFilters({});
    setDateRange({
      from: undefined,
      to: undefined
    });
    onFilterChange({});
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast.info("Recherche de votre position en cours...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // On a la position, maintenant cherchons la ville la plus proche
          // Dans une vraie application, vous feriez une requête API vers un service de géocodage inverse
          handleFilterChange("coordinates", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast.success("Position trouvée ! Recherche des missions à proximité");
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
          toast.error("Impossible de récupérer votre position. Vérifiez vos paramètres de confidentialité.");
        }
      );
    } else {
      toast.error("La géolocalisation n'est pas prise en charge par votre navigateur");
    }
  };

  useEffect(() => {
    // Filtrer les villes en fonction de la recherche
    if (searchCity.trim()) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(searchCity.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      // Ensure we're not passing undefined to any components expecting arrays
      setFilteredCities(cities || []);
    }
  }, [searchCity, cities]);

  useEffect(() => {
    // Lire les paramètres de l'URL au chargement initial
    const params = new URLSearchParams(location.search);
    const initialFilters: MissionFiltersType = {};

    const query = params.get('query');
    if (query) initialFilters.query = query;

    const city = params.get('city');
    if (city) initialFilters.city = city;

    const remote = params.get('remote');
    if (remote === 'true') initialFilters.remote = true;

    const categoryIds = params.getAll('category');
    if (categoryIds.length > 0) initialFilters.categoryIds = categoryIds;

    // Les dates sont plus complexes à gérer ici, on les laisse pour l'instant.
    // Si nécessaire, il faudrait parser les dates depuis les paramètres.

    setFilters(initialFilters);
    // onFilterChange(initialFilters); // Ne pas appeler ici pour éviter double appel avec l'autre useEffect

  }, [location.search]); // Dépendance à location.search pour réagir aux changements d'URL

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Rechercher une mission..."
            value={filters.query || ""}
            onChange={(e) => handleFilterChange("query", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {filters.city || "Toutes les villes"}
                <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Rechercher une ville..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-60 overflow-y-auto">
                  <div 
                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      handleFilterChange("city", "all");
                      setSearchCity("");
                    }}
                  >
                    Toutes les villes
                  </div>
                  <div 
                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      handleFilterChange("city", "remote");
                      setSearchCity("");
                    }}
                  >
                    À distance
                  </div>
                  {(filteredCities || []).map((city) => (
                    <div
                      key={city}
                      className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        handleFilterChange("city", city);
                        setSearchCity("");
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "P", { locale: fr })} -{" "}
                      {format(dateRange.to, "P", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "P", { locale: fr })
                  )
                ) : (
                  <span>Sélectionner des dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 block">Catégories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={filters.categoryIds?.includes(category.id) ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.categoryIds?.includes(category.id)
                  ? "bg-bleu hover:bg-bleu-700"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange("remote", !filters.remote)}
          className={`flex items-center ${filters.remote ? "bg-bleu text-white hover:bg-bleu-700" : ""}`}
        >
          <MapPin className="mr-1 h-4 w-4" />
          À distance
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleGetLocation}
          className="flex items-center"
        >
          <Navigation className="mr-1 h-4 w-4" />
          Missions à proximité
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex items-center"
        >
          <X className="mr-1 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default MissionFilters;

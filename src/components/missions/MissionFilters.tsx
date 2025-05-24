
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
import { Calendar as CalendarIcon, X, MapPin, Navigation, Clock, Users, Briefcase, Target, Award } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MissionFiltersProps {
  onFilterChange: (filters: MissionFiltersType) => void;
}

// Types de missions (ce qu'on fait)
const missionTypes = [
  { id: "aide-alimentaire", name: "Aide alimentaire" },
  { id: "accompagnement", name: "Accompagnement" },
  { id: "soutien-scolaire", name: "Soutien scolaire / alphabétisation" },
  { id: "aide-administrative", name: "Aide administrative / juridique" },
  { id: "logistique", name: "Logistique / manutention" },
  { id: "sensibilisation", name: "Sensibilisation / prévention" },
  { id: "traduction", name: "Traduction / interprétariat" },
  { id: "communication", name: "Communication / design / réseaux sociaux" },
  { id: "dev-web", name: "Développement web / IT" },
  { id: "animation", name: "Animation d'événements" },
  { id: "soins", name: "Soins / bien-être" },
];

// Types d'associations (secteur ou cause)
const associationTypes = [
  { id: "enfance", name: "Enfance & jeunesse" },
  { id: "personnes-agees", name: "Personnes âgées & isolement" },
  { id: "precarite", name: "Précarité & exclusion" },
  { id: "handicap", name: "Handicap & accessibilité" },
  { id: "migrants", name: "Migrants & réfugiés" },
  { id: "femmes", name: "Femmes & égalité" },
  { id: "sante", name: "Santé & maladies" },
  { id: "environnement", name: "Environnement & écologie" },
  { id: "animaux", name: "Animaux" },
  { id: "education", name: "Éducation & alphabétisation" },
  { id: "urgences", name: "Urgences humanitaires" },
];

// Durées
const durations = [
  { id: "15min", name: "15 minutes" },
  { id: "30min", name: "30 minutes" },
  { id: "1h", name: "1 heure" },
  { id: "half-day", name: "Une demi-journée" },
  { id: "custom", name: "À définir librement" },
  { id: "regular", name: "Régulier (hebdomadaire, mensuel)" },
  { id: "oneoff", name: "Ponctuel (une seule fois)" },
];

// Compétences requises
const skills = [
  { id: "none", name: "Pas de compétence particulière" },
  { id: "languages", name: "Langues étrangères" },
  { id: "digital", name: "Compétences numériques" },
  { id: "teaching", name: "Compétences pédagogiques" },
  { id: "creative", name: "Créativité / design" },
  { id: "organization", name: "Organisation / logistique" },
  { id: "legal", name: "Connaissances juridiques ou sociales" },
];

// Impact recherché
const impacts = [
  { id: "social", name: "Créer du lien humain" },
  { id: "urgent", name: "Agir pour une cause urgente" },
  { id: "equality", name: "Faire progresser l'égalité" },
  { id: "protect", name: "Sauver des vies / protéger" },
  { id: "inclusion", name: "Lutter contre l'exclusion" },
];

// Niveaux d'engagement
const engagementLevels = [
  { id: "ultra-quick", name: "Ultra-rapide" },
  { id: "small", name: "Petit coup de main" },
  { id: "follow-up", name: "Mission avec un suivi" },
  { id: "long", name: "Projet plus long" },
];

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
  const [activeFilterTab, setActiveFilterTab] = useState("basic");

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

  const handleArrayToggle = (key: keyof MissionFiltersType, itemId: string) => {
    const currentItems = filters[key] as string[] || [];
    let newItems: string[];

    if (currentItems.includes(itemId)) {
      newItems = currentItems.filter((id) => id !== itemId);
    } else {
      newItems = [...currentItems, itemId];
    }

    handleFilterChange(key, newItems);
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

  const handleReset = () => {
    setFilters({});
    setDateRange({
      from: undefined,
      to: undefined
    });
    onFilterChange({});
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

    // Nouveaux filtre ajoutés
    const missionTypes = params.getAll('missionType');
    if (missionTypes.length > 0) initialFilters.missionTypes = missionTypes;

    const associationTypes = params.getAll('associationType');
    if (associationTypes.length > 0) initialFilters.associationTypes = associationTypes;

    const durations = params.getAll('duration');
    if (durations.length > 0) initialFilters.durations = durations;

    const requiredSkills = params.getAll('requiredSkill');
    if (requiredSkills.length > 0) initialFilters.requiredSkills = requiredSkills;

    const impacts = params.getAll('impact');
    if (impacts.length > 0) initialFilters.impacts = impacts;

    const engagementLevels = params.getAll('engagementLevel');
    if (engagementLevels.length > 0) initialFilters.engagementLevels = engagementLevels;

    setFilters(initialFilters);

  }, [location.search]); 

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Compte le nombre total de filtres actifs
  const countActiveFilters = () => {
    let count = 0;

    // Filtres classiques
    if (filters.query) count++;
    if (filters.city) count++;
    if (filters.remote) count++;
    if (filters.dateRange) count++;
    if (filters.categoryIds?.length) count += filters.categoryIds.length;
    if (filters.coordinates) count++;

    // Nouveaux filtres
    if (filters.missionTypes?.length) count += filters.missionTypes.length;
    if (filters.associationTypes?.length) count += filters.associationTypes.length;
    if (filters.durations?.length) count += filters.durations.length;
    if (filters.requiredSkills?.length) count += filters.requiredSkills.length;
    if (filters.impacts?.length) count += filters.impacts.length;
    if (filters.engagementLevels?.length) count += filters.engagementLevels.length;

    return count;
  };

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
                <ScrollArea className="h-60">
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
                </ScrollArea>
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

      <Tabs value={activeFilterTab} onValueChange={setActiveFilterTab} className="mt-4">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="basic" className="flex-1">Filtres de base</TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">
            Filtres avancés
            {countActiveFilters() > 0 && (
              <Badge variant="secondary" className="ml-2 bg-bleu text-white">{countActiveFilters()}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <div className="mt-4">
            <Label className="mb-2 block">Catégories</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={filters.categoryIds?.includes(category.id) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filters.categoryIds?.includes(category.id)
                      ? "bg-bleu hover:bg-bleu-700"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => handleArrayToggle("categoryIds", category.id)}
                >
                  {category.name}
                </Badge>
              ))}
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
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="mission-type">
                <AccordionTrigger className="font-medium">
                  <Briefcase className="mr-2 h-4 w-4" /> Type de mission
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {missionTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant={filters.missionTypes?.includes(type.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.missionTypes?.includes(type.id)
                            ? "bg-bleu hover:bg-bleu-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleArrayToggle("missionTypes", type.id)}
                      >
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="association-type">
                <AccordionTrigger className="font-medium">
                  <Users className="mr-2 h-4 w-4" /> Type d'association
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {associationTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant={filters.associationTypes?.includes(type.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.associationTypes?.includes(type.id)
                            ? "bg-bleu hover:bg-bleu-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleArrayToggle("associationTypes", type.id)}
                      >
                        {type.name}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="duration">
                <AccordionTrigger className="font-medium">
                  <Clock className="mr-2 h-4 w-4" /> Durée / Disponibilité
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {durations.map((duration) => (
                      <Badge
                        key={duration.id}
                        variant={filters.durations?.includes(duration.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.durations?.includes(duration.id)
                            ? "bg-bleu hover:bg-bleu-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleArrayToggle("durations", duration.id)}
                      >
                        {duration.name}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="skills">
                <AccordionTrigger className="font-medium">
                  <Award className="mr-2 h-4 w-4" /> Compétences requises
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant={filters.requiredSkills?.includes(skill.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.requiredSkills?.includes(skill.id)
                            ? "bg-bleu hover:bg-bleu-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleArrayToggle("requiredSkills", skill.id)}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="impact">
                <AccordionTrigger className="font-medium">
                  <Target className="mr-2 h-4 w-4" /> Impact recherché
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {impacts.map((impact) => (
                      <Badge
                        key={impact.id}
                        variant={filters.impacts?.includes(impact.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.impacts?.includes(impact.id)
                            ? "bg-bleu hover:bg-bleu-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleArrayToggle("impacts", impact.id)}
                      >
                        {impact.name}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="engagement">
                <AccordionTrigger className="font-medium">
                  <Clock className="mr-2 h-4 w-4" /> Niveau d'engagement
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {engagementLevels.map((level) => (
                      <Badge
                        key={level.id}
                        variant={filters.engagementLevels?.includes(level.id) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.engagementLevels?.includes(level.id)
                            ? "bg-bleu hover:bg-bleu-700"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                        }`}
                        onClick={() => handleArrayToggle("engagementLevels", level.id)}
                      >
                        {level.name}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full mt-4 flex items-center justify-center"
            >
              <X className="mr-2 h-4 w-4" />
              Réinitialiser tous les filtres
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Affichage des filtres actifs */}
      {countActiveFilters() > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <span className="text-sm text-gray-600 mr-2">Filtres actifs :</span>
          {filters.query && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.query}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("query", "")} 
              />
            </Badge>
          )}
          
          {filters.city && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3 mr-1" />
              {filters.city === "remote" ? "À distance" : filters.city}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("city", "")}
              />
            </Badge>
          )}
          
          {filters.remote && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3 mr-1" />
              À distance
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => handleFilterChange("remote", false)}
              />
            </Badge>
          )}
          
          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {format(new Date(filters.dateRange.start || new Date()), "dd/MM", { locale: fr })}
              {filters.dateRange.end && ` - ${format(new Date(filters.dateRange.end), "dd/MM", { locale: fr })}`}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange("dateRange", undefined);
                  setDateRange({ from: undefined, to: undefined });
                }}
              />
            </Badge>
          )}
          
          {/* Filtres pour les catégories */}
          {filters.categoryIds?.map(id => {
            const category = categories.find(c => c.id === id);
            return category ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {category.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("categoryIds", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {/* Nouveaux filtres */}
          {filters.missionTypes?.map(id => {
            const type = missionTypes.find(t => t.id === id);
            return type ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3 mr-1" />
                {type.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("missionTypes", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {filters.associationTypes?.map(id => {
            const type = associationTypes.find(t => t.id === id);
            return type ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3 mr-1" />
                {type.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("associationTypes", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {filters.durations?.map(id => {
            const duration = durations.find(d => d.id === id);
            return duration ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3 mr-1" />
                {duration.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("durations", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {filters.requiredSkills?.map(id => {
            const skill = skills.find(s => s.id === id);
            return skill ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                <Award className="h-3 w-3 mr-1" />
                {skill.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("requiredSkills", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {filters.impacts?.map(id => {
            const impact = impacts.find(i => i.id === id);
            return impact ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                <Target className="h-3 w-3 mr-1" />
                {impact.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("impacts", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {filters.engagementLevels?.map(id => {
            const level = engagementLevels.find(l => l.id === id);
            return level ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3 mr-1" />
                {level.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={() => handleArrayToggle("engagementLevels", id)}
                />
              </Badge>
            ) : null;
          })}
          
          {countActiveFilters() > 0 && (
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-gray-50 text-gray-700"
              onClick={handleReset}
            >
              <X className="h-3 w-3 mr-1" /> Tout effacer
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default MissionFilters;

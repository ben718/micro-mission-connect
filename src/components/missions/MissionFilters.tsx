
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useOrganizationSectors, useMissionTypes } from "@/hooks/useData";
import type { MissionFilters } from "@/types";

interface MissionFiltersProps {
  onFilterChange: (filters: MissionFilters) => void;
  initialFilters?: MissionFilters;
}

const MissionFilters = ({ onFilterChange, initialFilters = {} }: MissionFiltersProps) => {
  const [filters, setFilters] = useState<MissionFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: sectors } = useOrganizationSectors();
  const { data: missionTypes } = useMissionTypes();

  // Mettre à jour les filtres quand ils changent
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof MissionFilters, value: string | boolean | undefined) => {
    if (value === "" || value === undefined) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({});
    setShowAdvanced(false);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof MissionFilters];
    return value !== undefined && value !== "" && value !== false;
  });

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Recherche principale */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une mission..."
                value={filters.query || ""}
                onChange={(e) => updateFilter("query", e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="shrink-0">
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}
          </div>

          {/* Filtres avancés */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Secteur</label>
                <Select
                  value={filters.sector_id || ""}
                  onValueChange={(value) => updateFilter("sector_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les secteurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les secteurs</SelectItem>
                    {sectors?.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de mission</label>
                <Select
                  value={filters.mission_type_id || ""}
                  onValueChange={(value) => updateFilter("mission_type_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    {missionTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select
                  value={filters.format || ""}
                  onValueChange={(value) => updateFilter("format", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les formats</SelectItem>
                    <SelectItem value="Présentiel">Présentiel</SelectItem>
                    <SelectItem value="À distance">À distance</SelectItem>
                    <SelectItem value="Hybride">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <Select
                  value={filters.difficulty_level || ""}
                  onValueChange={(value) => updateFilter("difficulty_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les niveaux</SelectItem>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Engagement</label>
                <Select
                  value={filters.engagement_level || ""}
                  onValueChange={(value) => updateFilter("engagement_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les engagements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les engagements</SelectItem>
                    <SelectItem value="Ultra-rapide">Ultra-rapide</SelectItem>
                    <SelectItem value="Petit coup de main">Petit coup de main</SelectItem>
                    <SelectItem value="Mission avec suivi">Mission avec suivi</SelectItem>
                    <SelectItem value="Projet long">Projet long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <Input
                  placeholder="Ville..."
                  value={filters.city || ""}
                  onChange={(e) => updateFilter("city", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Affichage des filtres actifs */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "" || value === false) return null;
                
                let label = String(value);
                
                // Personnaliser les labels selon le type de filtre
                if (key === "sector_id") {
                  const sector = sectors?.find(s => s.id === value);
                  label = sector ? `Secteur: ${sector.name}` : `Secteur: ${value}`;
                } else if (key === "mission_type_id") {
                  const type = missionTypes?.find(t => t.id === value);
                  label = type ? `Type: ${type.name}` : `Type: ${value}`;
                } else if (key === "format") {
                  label = `Format: ${value}`;
                } else if (key === "difficulty_level") {
                  label = `Niveau: ${value}`;
                } else if (key === "engagement_level") {
                  label = `Engagement: ${value}`;
                } else if (key === "city") {
                  label = `Ville: ${value}`;
                } else if (key === "query") {
                  label = `Recherche: ${value}`;
                }

                return (
                  <Badge 
                    key={key} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => updateFilter(key as keyof MissionFilters, undefined)}
                  >
                    {label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionFilters;

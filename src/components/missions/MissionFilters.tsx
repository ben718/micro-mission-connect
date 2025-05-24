
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Filter, MapPin, Calendar, Clock, Users, Target } from "lucide-react";
import { useOrganizationSectors, useMissionTypes } from "@/hooks/useMissions";
import type { MissionFilters } from "@/types";

interface MissionFiltersProps {
  filters: MissionFilters;
  onFilterChange: (filters: MissionFilters) => void;
}

const MissionFiltersComponent = ({ filters, onFilterChange }: MissionFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sectors = [] } = useOrganizationSectors();
  const { data: missionTypes = [] } = useMissionTypes();

  const updateFilter = (key: keyof MissionFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.sector_id) count++;
    if (filters.mission_type_id) count++;
    if (filters.format) count++;
    if (filters.difficulty_level) count++;
    if (filters.engagement_level) count++;
    if (filters.city) count++;
    if (filters.available_only) count++;
    return count;
  };

  const formatOptions = [
    "Présentiel",
    "À distance",
    "Hybride"
  ];

  const difficultyOptions = [
    "Débutant",
    "Intermédiaire", 
    "Avancé",
    "Expert"
  ];

  const engagementOptions = [
    "Ponctuel",
    "Régulier",
    "Long terme"
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Effacer
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "Masquer" : "Afficher"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Recherche textuelle */}
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <Input
                id="search"
                placeholder="Mots-clés..."
                value={filters.query || ""}
                onChange={(e) => updateFilter("query", e.target.value)}
              />
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Ville
              </Label>
              <Input
                id="city"
                placeholder="Paris, Lyon..."
                value={filters.city || ""}
                onChange={(e) => updateFilter("city", e.target.value)}
              />
            </div>

            {/* Secteur */}
            <div className="space-y-2">
              <Label>Secteur</Label>
              <Select
                value={filters.sector_id || ""}
                onValueChange={(value) => updateFilter("sector_id", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les secteurs</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type de mission */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Type de mission
              </Label>
              <Select
                value={filters.mission_type_id || ""}
                onValueChange={(value) => updateFilter("mission_type_id", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  {missionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={filters.format || ""}
                onValueChange={(value) => updateFilter("format", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les formats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les formats</SelectItem>
                  {formatOptions.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau de difficulté */}
            <div className="space-y-2">
              <Label>Difficulté</Label>
              <Select
                value={filters.difficulty_level || ""}
                onValueChange={(value) => updateFilter("difficulty_level", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  {difficultyOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau d'engagement */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Engagement
              </Label>
              <Select
                value={filters.engagement_level || ""}
                onValueChange={(value) => updateFilter("engagement_level", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les engagements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les engagements</SelectItem>
                  {engagementOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Places disponibles uniquement */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Disponibilité
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available_only"
                  checked={filters.available_only === true}
                  onCheckedChange={(checked) => 
                    updateFilter("available_only", checked === true ? true : undefined)
                  }
                />
                <Label htmlFor="available_only" className="text-sm">
                  Places disponibles uniquement
                </Label>
              </div>
            </div>
          </div>

          {/* Filtres actifs */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{filters.query}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("query", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filters.city && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {filters.city}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("city", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.sector_id && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {sectors.find(s => s.id === filters.sector_id)?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("sector_id", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.format && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.format}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("format", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.difficulty_level && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.difficulty_level}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("difficulty_level", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.engagement_level && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {filters.engagement_level}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("engagement_level", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.available_only && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Places disponibles
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => updateFilter("available_only", undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default MissionFiltersComponent;

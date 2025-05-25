import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, X } from "lucide-react";
import { toast } from "sonner";

interface MissionFiltersProps {
  onFiltersChange: (filters: any) => void;
  userLocation?: { lat: number; lng: number };
}

interface FilterState {
  searchQuery: string;
  format: string[];
  difficulty: string[];
  engagement: string[];
  distance: number;
  skills: string[];
  sectors: string[];
  types: string[];
}

const MissionFilters = ({ onFiltersChange, userLocation }: MissionFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    format: [],
    difficulty: [],
    engagement: [],
    distance: 10,
    skills: [],
    sectors: [],
    types: [],
  });

  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const { data: skills } = await supabase
        .from("skills")
        .select("name")
        .order("name");

      const { data: sectors } = await supabase
        .from("organization_sectors")
        .select("name")
        .order("name");

      const { data: types } = await supabase
        .from("mission_types")
        .select("name")
        .order("name");

      setAvailableSkills(skills?.map((s) => s.name) || []);
      setAvailableSectors(sectors?.map((s) => s.name) || []);
      setAvailableTypes(types?.map((t) => t.name) || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des options de filtrage:", error);
      toast.error("Erreur lors du chargement des filtres");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchQuery: "",
      format: [],
      difficulty: [],
      engagement: [],
      distance: 10,
      skills: [],
      sectors: [],
      types: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtres</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Barre de recherche */}
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher une mission..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              className="flex-1"
            />
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <h3 className="font-medium">Format</h3>
            <div className="flex flex-wrap gap-2">
              {["Présentiel", "À distance", "Hybride"].map((format) => (
                <Badge
                  key={format}
                  variant={filters.format.includes(format) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newFormats = filters.format.includes(format)
                      ? filters.format.filter((f) => f !== format)
                      : [...filters.format, format];
                    handleFilterChange("format", newFormats);
                  }}
                >
                  {format}
                </Badge>
              ))}
            </div>
          </div>

          {/* Difficulté */}
          <div className="space-y-2">
            <h3 className="font-medium">Niveau de difficulté</h3>
            <div className="flex flex-wrap gap-2">
              {["débutant", "intermédiaire", "expert"].map((level) => (
                <Badge
                  key={level}
                  variant={filters.difficulty.includes(level) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newLevels = filters.difficulty.includes(level)
                      ? filters.difficulty.filter((l) => l !== level)
                      : [...filters.difficulty, level];
                    handleFilterChange("difficulty", newLevels);
                  }}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          {/* Engagement */}
          <div className="space-y-2">
            <h3 className="font-medium">Niveau d'engagement</h3>
            <div className="flex flex-wrap gap-2">
              {["Ultra-rapide", "Petit coup de main", "Mission avec suivi", "Projet long"].map((level) => (
                <Badge
                  key={level}
                  variant={filters.engagement.includes(level) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newLevels = filters.engagement.includes(level)
                      ? filters.engagement.filter((l) => l !== level)
                      : [...filters.engagement, level];
                    handleFilterChange("engagement", newLevels);
                  }}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          {/* Distance */}
          {userLocation && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Distance maximale</h3>
                <span className="text-sm text-muted-foreground">{filters.distance} km</span>
              </div>
              <Slider
                value={[filters.distance]}
                onValueChange={(value) => handleFilterChange("distance", value[0])}
                min={1}
                max={50}
                step={1}
              />
            </div>
          )}

          {/* Compétences */}
          <div className="space-y-2">
            <h3 className="font-medium">Compétences requises</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "skills",
                        checked
                          ? [...filters.skills, skill]
                          : filters.skills.filter((s) => s !== skill)
                      )
                    }
                  />
                  <label
                    htmlFor={skill}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Secteurs */}
          <div className="space-y-2">
            <h3 className="font-medium">Secteurs d'action</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableSectors.map((sector) => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox
                    id={sector}
                    checked={filters.sectors.includes(sector)}
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "sectors",
                        checked
                          ? [...filters.sectors, sector]
                          : filters.sectors.filter((s) => s !== sector)
                      )
                    }
                  />
                  <label
                    htmlFor={sector}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {sector}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Types de mission */}
          <div className="space-y-2">
            <h3 className="font-medium">Types de mission</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.types.includes(type)}
                    onCheckedChange={(checked) =>
                      handleFilterChange(
                        "types",
                        checked
                          ? [...filters.types, type]
                          : filters.types.filter((t) => t !== type)
                      )
                    }
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionFilters;

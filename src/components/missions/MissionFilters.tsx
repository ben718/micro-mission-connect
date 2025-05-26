
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, X, ChevronDown } from "lucide-react";
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
  
  // Collapsible states for mobile
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isEngagementOpen, setIsEngagementOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isSectorsOpen, setIsSectorsOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

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
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'format' | 'difficulty' | 'engagement' | 'skills' | 'sectors' | 'types', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      format: [],
      difficulty: [],
      engagement: [],
      distance: 10,
      skills: [],
      sectors: [],
      types: [],
    });
  };

  const getActiveFiltersCount = () => {
    return filters.format.length + filters.difficulty.length + filters.engagement.length + 
           filters.skills.length + filters.sectors.length + filters.types.length +
           (filters.searchQuery ? 1 : 0);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <CardTitle className="text-lg">Filtres</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de recherche */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher une mission..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Format - Responsive */}
        <div className="space-y-2">
          <Collapsible open={isFormatOpen} onOpenChange={setIsFormatOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-sm">
                <span>Format {filters.format.length > 0 && `(${filters.format.length})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFormatOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Présentiel", "À distance", "Hybride"].map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={filters.format.includes(format)}
                      onCheckedChange={() => toggleArrayFilter('format', format)}
                    />
                    <label htmlFor={`format-${format}`} className="text-sm font-medium leading-none cursor-pointer">
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Difficulté */}
        <div className="space-y-2">
          <Collapsible open={isDifficultyOpen} onOpenChange={setIsDifficultyOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-sm">
                <span>Niveau de difficulté {filters.difficulty.length > 0 && `(${filters.difficulty.length})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDifficultyOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["débutant", "intermédiaire", "expert"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`difficulty-${level}`}
                      checked={filters.difficulty.includes(level)}
                      onCheckedChange={() => toggleArrayFilter('difficulty', level)}
                    />
                    <label htmlFor={`difficulty-${level}`} className="text-sm font-medium leading-none cursor-pointer capitalize">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Engagement */}
        <div className="space-y-2">
          <Collapsible open={isEngagementOpen} onOpenChange={setIsEngagementOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-sm">
                <span>Niveau d'engagement {filters.engagement.length > 0 && `(${filters.engagement.length})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isEngagementOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {["Ultra-rapide", "Petit coup de main", "Mission avec suivi", "Projet long"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`engagement-${level}`}
                      checked={filters.engagement.includes(level)}
                      onCheckedChange={() => toggleArrayFilter('engagement', level)}
                    />
                    <label htmlFor={`engagement-${level}`} className="text-sm font-medium leading-none cursor-pointer">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Compétences */}
        <div className="space-y-2">
          <Collapsible open={isSkillsOpen} onOpenChange={setIsSkillsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-sm">
                <span>Compétences requises {filters.skills.length > 0 && `(${filters.skills.length})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSkillsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={filters.skills.includes(skill)}
                      onCheckedChange={() => toggleArrayFilter('skills', skill)}
                    />
                    <label htmlFor={`skill-${skill}`} className="text-sm font-medium leading-none cursor-pointer">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Secteurs */}
        <div className="space-y-2">
          <Collapsible open={isSectorsOpen} onOpenChange={setIsSectorsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-sm">
                <span>Secteurs d'action {filters.sectors.length > 0 && `(${filters.sectors.length})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSectorsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableSectors.map((sector) => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sector-${sector}`}
                      checked={filters.sectors.includes(sector)}
                      onCheckedChange={() => toggleArrayFilter('sectors', sector)}
                    />
                    <label htmlFor={`sector-${sector}`} className="text-sm font-medium leading-none cursor-pointer">
                      {sector}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Types de mission */}
        <div className="space-y-2">
          <Collapsible open={isTypesOpen} onOpenChange={setIsTypesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium text-sm">
                <span>Types de mission {filters.types.length > 0 && `(${filters.types.length})`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isTypesOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => toggleArrayFilter('types', type)}
                    />
                    <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionFilters;

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter, MapPin, Calendar, Clock, Users, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  date: string;
  timeSlot: string;
  duration: string;
  skills: string[];
  participants: string;
}

const categories = [
  { value: "all", label: "Toutes les catégories" },
  { value: "education", label: "Éducation" },
  { value: "social", label: "Social" },
  { value: "environment", label: "Environnement" },
  { value: "health", label: "Santé" },
  { value: "culture", label: "Culture" },
  { value: "sport", label: "Sport" },
  { value: "other", label: "Autre" }
];

const timeSlots = [
  { value: "all", label: "Tous les créneaux" },
  { value: "morning", label: "Matin (8h-12h)" },
  { value: "afternoon", label: "Après-midi (12h-18h)" },
  { value: "evening", label: "Soirée (18h-22h)" },
  { value: "weekend", label: "Week-end" }
];

const durations = [
  { value: "all", label: "Toutes les durées" },
  { value: "1-2", label: "1-2 heures" },
  { value: "2-4", label: "2-4 heures" },
  { value: "4-8", label: "4-8 heures" },
  { value: "8+", label: "Plus de 8 heures" }
];

const participants = [
  { value: "all", label: "Tous les effectifs" },
  { value: "1-5", label: "1-5 personnes" },
  { value: "5-10", label: "5-10 personnes" },
  { value: "10-20", label: "10-20 personnes" },
  { value: "20+", label: "Plus de 20 personnes" }
];

const commonSkills = [
  "Communication",
  "Organisation",
  "Travail d'équipe",
  "Leadership",
  "Informatique",
  "Langues",
  "Animation",
  "Premiers secours",
  "Médiation",
  "Enseignement"
];

export function SearchFilters({ onSearch, initialFilters }: SearchFiltersProps) {
  const [filters, setFilters] = React.useState<SearchFilters>(initialFilters || {
    query: "",
    category: "all",
    location: "",
    date: "",
    timeSlot: "all",
    duration: "all",
    skills: [],
    participants: "all"
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    handleFilterChange("skills", newSkills);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      category: "all",
      location: "",
      date: "",
      timeSlot: "all",
      duration: "all",
      skills: [],
      participants: "all"
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Barre de recherche principale */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une mission..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Localisation"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? "Masquer les filtres" : "Filtres avancés"}
            </Button>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="date"
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Créneau horaire</label>
                  <Select
                    value={filters.timeSlot}
                    onValueChange={(value) => handleFilterChange("timeSlot", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Créneau horaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée</label>
                  <Select
                    value={filters.duration}
                    onValueChange={(value) => handleFilterChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Durée" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Effectif</label>
                  <Select
                    value={filters.participants}
                    onValueChange={(value) => handleFilterChange("participants", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre de participants" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.map((participant) => (
                        <SelectItem key={participant.value} value={participant.value}>
                          {participant.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Compétences */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Compétences requises
                </label>
                <ScrollArea className="h-24 w-full rounded-md border p-2">
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={filters.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                        {filters.skills.includes(skill) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Filtres actifs */}
              {(filters.skills.length > 0 || filters.category !== "all" || filters.timeSlot !== "all" || 
                filters.duration !== "all" || filters.participants !== "all") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtres actifs</label>
                  <div className="flex flex-wrap gap-2">
                    {filters.category !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {categories.find(c => c.value === filters.category)?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleFilterChange("category", "all")}
                        />
                      </Badge>
                    )}
                    {filters.timeSlot !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {timeSlots.find(t => t.value === filters.timeSlot)?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleFilterChange("timeSlot", "all")}
                        />
                      </Badge>
                    )}
                    {filters.duration !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {durations.find(d => d.value === filters.duration)?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleFilterChange("duration", "all")}
                        />
                      </Badge>
                    )}
                    {filters.participants !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {participants.find(p => p.value === filters.participants)?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleFilterChange("participants", "all")}
                        />
                      </Badge>
                    )}
                    {filters.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleSkillToggle(skill)}
                        />
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-6 px-2"
                    >
                      Tout effacer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
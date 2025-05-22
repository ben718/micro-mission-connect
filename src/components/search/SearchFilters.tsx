import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Search, MapPin, Calendar, Tag, RefreshCw, Globe, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  totalResults?: number;
}

export interface SearchFilters {
  query: string;
  category: string[];
  location: string;
  date: string;
  remote: boolean;
  skills: string[];
}

export function SearchFilters({ onSearch, initialFilters, totalResults }: SearchFiltersProps) {
  const [filters, setFilters] = React.useState<SearchFilters>(initialFilters || {
    query: "",
    category: [],
    location: "",
    date: "",
    remote: false,
    skills: [],
  });

  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [suggestedCities, setSuggestedCities] = React.useState<string[]>([]);

  // Catégories dynamiques
  const [categories, setCategories] = React.useState<{ value: string; label: string; icon?: string }[]>([]);
  // Villes dynamiques
  const [villes, setVilles] = React.useState<string[]>([]);
  // Compétences dynamiques
  const [skills, setSkills] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Charger les catégories dynamiquement
    supabase
      .from('categories')
      .select('id, name')
      .order('name')
      .then(({ data }) => {
        if (data) {
          setCategories(data.map((cat: any) => ({ value: cat.name, label: cat.name })));
        }
      });

    // Charger les villes dynamiquement
    supabase
      .from('missions')
      .select('city')
      .neq('city', '')
      .then(({ data }) => {
        if (data) {
          const unique = Array.from(new Set(data.map((m: any) => m.city)));
          setVilles(unique.filter(Boolean).sort());
        }
      });

    // Charger les compétences dynamiquement (badges comme skills)
    supabase
      .from('badges')
      .select('name')
      .order('name')
      .then(({ data }) => {
        if (data) {
          setSkills(data.map((b: any) => b.name));
        }
      });
  }, []);

  // Gestion de l'autocomplétion des villes
  React.useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = villes.filter(ville =>
        ville.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestedCities(filtered);
    } else {
      setSuggestedCities([]);
    }
  }, [searchQuery, villes]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleCategoryToggle = (cat: string) => {
    const newCategories = filters.category.includes(cat)
      ? filters.category.filter(c => c !== cat)
      : [...filters.category, cat];
    handleFilterChange("category", newCategories);
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    handleFilterChange("skills", newSkills);
  };

  const clearFilters = () => {
    const cleared = { query: "", category: [], location: "", date: "", remote: false, skills: [] };
    setFilters(cleared);
    onSearch(cleared);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("date", e.target.value);
  };

  // Composant pour les filtres avancés (utilisé dans le popover et le sheet)
  const AdvancedFilters = () => (
    <div className="space-y-4 transition-all duration-300 ease-in-out animate-fade-in">
      {/* Catégories */}
      <div>
        <div className="mb-2 font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" /> Catégories
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Button
              key={cat.value}
              type="button"
              variant={filters.category.includes(cat.value) ? "default" : "outline"}
              className={filters.category.includes(cat.value) ? "bg-bleu text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]" : "transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]"}
              onClick={() => handleCategoryToggle(cat.value)}
              aria-pressed={filters.category.includes(cat.value)}
              aria-label={`Filtrer par catégorie ${cat.label}`}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Compétences */}
      <div>
        <div className="mb-2 font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" /> Compétences
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <Button
              key={skill}
              type="button"
              variant={filters.skills.includes(skill) ? "default" : "outline"}
              className={filters.skills.includes(skill) ? "bg-bleu text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]" : "transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]"}
              onClick={() => handleSkillToggle(skill)}
              aria-pressed={filters.skills.includes(skill)}
              aria-label={`Filtrer par compétence ${skill}`}
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      {/* À distance */}
      <div>
        <Button
          type="button"
          variant={filters.remote ? "default" : "outline"}
          className={`w-full ${filters.remote ? "bg-bleu text-white" : ""} transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]`}
          onClick={() => handleFilterChange("remote", !filters.remote)}
          aria-pressed={filters.remote}
          aria-label="Filtrer par missions à distance"
        >
          <Globe className="h-4 w-4 mr-2" /> À distance
        </Button>
      </div>

      {/* Réinitialiser */}
      <Button 
        type="button" 
        variant="ghost" 
        onClick={() => {
          clearFilters();
          setIsFiltersOpen(false);
        }} 
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <form className="flex flex-col gap-4">
          {/* Ligne principale : Recherche, Ville, Date */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Rechercher une mission..."
                value={filters.query}
                onChange={e => handleFilterChange("query", e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filtres secondaires sur desktop */}
            <div className="hidden sm:flex gap-4">
              {/* Autocomplétion ville */}
              <div className="relative w-64 transition-all duration-300 ease-in-out">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-haspopup="listbox"
                      aria-expanded={!!filters.location}
                      aria-label="Choisir une ville"
                      className="w-full justify-between h-12 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {filters.location || "Choisir une ville"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0 animate-fade-in transition-all duration-300">
                    <Command>
                      <CommandInput 
                        placeholder="Rechercher une ville..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandEmpty>Aucune ville trouvée</CommandEmpty>
                      <CommandGroup>
                        {suggestedCities.map((ville) => (
                          <CommandItem
                            key={ville}
                            value={ville}
                            onSelect={() => {
                              handleFilterChange("location", ville);
                              setSearchQuery("");
                            }}
                          >
                            {ville}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date */}
              <div className="relative w-64">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="date"
                  value={filters.date}
                  onChange={handleDateChange}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Filtres avancés (desktop) */}
              <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]" aria-expanded={isFiltersOpen} aria-controls="advanced-filters-popover" aria-label="Ouvrir les filtres avancés">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres avancés
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 animate-fade-in transition-all duration-300" id="advanced-filters-popover">
                  <AdvancedFilters />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtres secondaires sur mobile */}
            <div className="flex sm:hidden gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1 h-12 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]" aria-expanded={isFiltersOpen} aria-controls="mobile-filters-sheet" aria-label="Ouvrir les filtres sur mobile">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] animate-fade-in transition-all duration-300" id="mobile-filters-sheet">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {/* Ville */}
                    <div>
                      <div className="mb-2 font-medium">Ville</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-haspopup="listbox"
                            aria-expanded={!!filters.location}
                            aria-label="Choisir une ville"
                            className="w-full justify-between h-12 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bleu min-h-[44px]"
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            {filters.location || "Choisir une ville"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Rechercher une ville..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandEmpty>Aucune ville trouvée</CommandEmpty>
                            <CommandGroup>
                              {suggestedCities.map((ville) => (
                                <CommandItem
                                  key={ville}
                                  value={ville}
                                  onSelect={() => {
                                    handleFilterChange("location", ville);
                                    setSearchQuery("");
                                  }}
                                >
                                  {ville}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Date */}
                    <div>
                      <div className="mb-2 font-medium">Date</div>
                      <Input
                        type="date"
                        value={filters.date}
                        onChange={handleDateChange}
                        className="w-full"
                      />
                    </div>

                    <Separator />

                    {/* Filtres avancés */}
                    <AdvancedFilters />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Compteur de résultats et filtres actifs */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 transition-all duration-300">
            {totalResults !== undefined && (
              <div className="text-sm text-muted-foreground animate-fade-in transition-all duration-300">
                {totalResults} {totalResults > 1 ? 'missions trouvées' : 'mission trouvée'}
              </div>
            )}
            
            {/* Filtres actifs */}
            {(filters.query || filters.location || filters.date || filters.category.length > 0 || filters.remote || filters.skills.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center animate-fade-in transition-all duration-300">
                {filters.query && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" /> {filters.query}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("query", "")} />
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {filters.location}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("location", "")} />
                  </Badge>
                )}
                {filters.date && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {filters.date}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("date", "")} />
                  </Badge>
                )}
                {filters.category.map(cat => (
                  <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                    {categories.find(c => c.value === cat)?.label || cat}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryToggle(cat)} />
                  </Badge>
                ))}
                {filters.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSkillToggle(skill)} />
                  </Badge>
                ))}
                {filters.remote && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" /> À distance
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("remote", false)} />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
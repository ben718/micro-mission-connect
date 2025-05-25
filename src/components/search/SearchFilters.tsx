
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface SearchFilters {
  query: string;
  category: string[];
  location: string;
  date: string;
  remote: boolean;
  skills: string[];
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

// Mock data for cities (replace with actual API call)
const cities = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", 
  "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims"
];

// Mock data for categories
const categories = [
  "Éducation", "Environnement", "Social", "Culture", "Sport", 
  "Santé", "Solidarité", "Humanitaire", "Animaux", "Seniors"
];

// Mock data for skills
const skills = [
  "Communication", "Organisation", "Informatique", "Cuisine", "Animation",
  "Traduction", "Photographie", "Jardinage", "Bricolage", "Accueil"
];

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: [],
    location: '',
    date: '',
    remote: false,
    skills: []
  });

  const [openLocationPopover, setOpenLocationPopover] = useState(false);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [openSkillsPopover, setOpenSkillsPopover] = useState(false);
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleLocationSelect = (location: string) => {
    setFilters(prev => ({ ...prev, location }));
    setOpenLocationPopover(false);
  };

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFilters(prev => ({
      ...prev,
      date: date ? format(date, 'yyyy-MM-dd') : ''
    }));
    setOpenDatePopover(false);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: [],
      location: '',
      date: '',
      remote: false,
      skills: []
    });
    setSelectedDate(undefined);
  };

  const hasActiveFilters = filters.query || filters.category.length > 0 || 
    filters.location || filters.date || filters.remote || filters.skills.length > 0;

  return (
    <div className="w-full space-y-4 p-6 bg-white rounded-lg shadow-lg">
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une mission..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="bg-bleu hover:bg-bleu-700">
          Rechercher
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        {/* Location filter */}
        <Popover open={openLocationPopover} onOpenChange={setOpenLocationPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              {filters.location || "Lieu"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Rechercher une ville..." />
              <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={() => handleLocationSelect(city)}
                  >
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Category filter */}
        <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Catégorie {filters.category.length > 0 && `(${filters.category.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Catégories</h4>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.category.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label htmlFor={category} className="text-sm">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date filter */}
        <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: fr }) : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        {/* Skills filter */}
        <Popover open={openSkillsPopover} onOpenChange={setOpenSkillsPopover}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Compétences {filters.skills.length > 0 && `(${filters.skills.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Compétences</h4>
              {skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <label htmlFor={skill} className="text-sm">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Remote option */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={filters.remote}
            onCheckedChange={(checked) => 
              setFilters(prev => ({ ...prev, remote: checked as boolean }))
            }
          />
          <label htmlFor="remote" className="text-sm">
            À distance
          </label>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-gray-500"
          >
            <X className="h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.location && (
            <Badge variant="secondary" className="gap-1">
              📍 {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
              />
            </Badge>
          )}
          {filters.category.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategoryToggle(category)}
              />
            </Badge>
          ))}
          {filters.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleSkillToggle(skill)}
              />
            </Badge>
          ))}
          {filters.remote && (
            <Badge variant="secondary" className="gap-1">
              À distance
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, remote: false }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

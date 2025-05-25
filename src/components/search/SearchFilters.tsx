
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, SearchIcon, TagIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useMissionTypes, useSkills, useLocations } from "@/hooks/useMissions";

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

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isRemote, setIsRemote] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Fetch data with proper error handling and defaults
  const { data: categories = [], isLoading: categoriesLoading } = useMissionTypes();
  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();

  const handleSearch = () => {
    const filters: SearchFilters = {
      query,
      category: selectedCategories,
      location,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      remote: isRemote,
      skills: selectedSkills,
    };
    onSearch(filters);
  };

  const addCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Search Query */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rechercher</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Mots-clés..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Localisation</label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start pl-10">
                  {location || "Choisir une ville..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Rechercher une ville..." />
                  <CommandList>
                    <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                    <CommandGroup>
                      {!locationsLoading && Array.isArray(locations) && locations.map((loc) => (
                        <CommandItem
                          key={loc}
                          onSelect={() => setLocation(loc)}
                        >
                          {loc}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "Choisir une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Categories */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Catégories</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <TagIcon className="mr-2 h-4 w-4" />
                Ajouter une catégorie
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher une catégorie..." />
                <CommandList>
                  <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                  <CommandGroup>
                    {!categoriesLoading && Array.isArray(categories) && categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => addCategory(category.name)}
                      >
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
                <XIcon
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => removeCategory(category)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Compétences</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <TagIcon className="mr-2 h-4 w-4" />
                Ajouter une compétence
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher une compétence..." />
                <CommandList>
                  <CommandEmpty>Aucune compétence trouvée.</CommandEmpty>
                  <CommandGroup>
                    {!skillsLoading && Array.isArray(skills) && skills.map((skill) => (
                      <CommandItem
                        key={skill.id}
                        onSelect={() => addSkill(skill.name)}
                      >
                        {skill.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
                <XIcon
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSearch} className="px-8">
          <SearchIcon className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>
    </div>
  );
}

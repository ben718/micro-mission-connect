
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMissions } from '@/hooks/useMissions';
import { useCategories, useCities } from '@/hooks/useDynamicLists';
import { MissionCard } from '@/components/missions/MissionCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { MissionFilters, DateRangeSelection, MissionWithDetails } from "@/types/mission";
import { DateRange } from "react-day-picker";

const MissionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll('category')
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get('startDate') ? new Date(searchParams.get('startDate') as string) : undefined,
    to: searchParams.get('endDate') ? new Date(searchParams.get('endDate') as string) : undefined,
  });
  const [remote, setRemote] = useState(searchParams.get('remote') === 'true');
  const [page, setPage] = useState(0);

  // Fetch data using hooks
  const { data: missionsData, isLoading, error } = useMissions({
    query,
    location,
    categoryIds: selectedCategories,
    dateRange: dateRange ? {
      start: dateRange.from,
      end: dateRange.to
    } : undefined,
    remote,
    page,
    pageSize: 12,
  });
  const { categories } = useCategories();
  const { cities } = useCities();

  // Update URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (location) params.set('location', location);
    selectedCategories.forEach(category => params.append('category', category));
    if (dateRange?.from) params.set('startDate', dateRange.from.toISOString());
    if (dateRange?.to) params.set('endDate', dateRange.to.toISOString());
    if (remote) params.set('remote', 'true');
    setSearchParams(params);
    setPage(0);
  }, [query, location, selectedCategories, dateRange, remote, setSearchParams]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const missions = missionsData?.data || [];
  const totalCount = missionsData?.count || 0;
  const totalPages = Math.ceil(totalCount / 12);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Transform missions data to match expected type with proper typing
  const transformedMissions: MissionWithDetails[] = missions.map(mission => {
    // Ensure mission_type has all required properties with defaults
    const missionType = mission.mission_type ? {
      id: mission.mission_type.id,
      name: mission.mission_type.name,
      description: mission.mission_type.description || '',
      created_at: mission.mission_type.created_at || new Date().toISOString(),
      updated_at: mission.mission_type.updated_at || new Date().toISOString(),
    } : undefined;

    // Ensure organization has all required properties
    const organization = mission.organization || {
      id: '',
      organization_name: 'Organisation inconnue',
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: null,
      website_url: null,
      logo_url: null,
      siret_number: null,
      address: null,
      creation_date: null,
      sector_id: null,
      location: null,
      longitude: null,
      latitude: null,
    };

    return {
      ...mission,
      required_skills: mission.required_skills || [],
      organization,
      participants_count: mission.participants_count || 0,
      mission_type: missionType,
      // Ensure these required properties for MissionWithDetails
      is_registered: false,
      registration_status: undefined,
      mission_registrations: undefined,
    } as MissionWithDetails;
  });

  if (isLoading) return <div className="flex justify-center p-8">Chargement...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Erreur: {error.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Missions de bénévolat</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Rechercher une mission"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={location !== ""}
              className="w-[200px] justify-between"
            >
              {location
                ? cities?.find(c => c.name === location)?.name
                : "Sélectionner une ville"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Rechercher une ville..." />
                <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                <CommandGroup>
                  {cities?.map((cityItem) => (
                    <CommandItem
                      key={cityItem.id}
                      value={cityItem.name}
                      onSelect={() => setLocation(cityItem.name)}
                    >
                      {cityItem.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          location === cityItem.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={selectedCategories.length > 0}
              className="w-[200px] justify-between"
            >
              {selectedCategories.length > 0
                ? `${selectedCategories.length} Catégories`
                : "Sélectionner des catégories"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Rechercher une catégorie..." />
                <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                <CommandGroup>
                  {categories?.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => handleCategorySelect(category.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange?.from || !dateRange?.to ? "text-muted-foreground" : undefined
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange?.from && dateRange?.to ? (
                `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              disabled={{ before: new Date() }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          onClick={() => setRemote(!remote)}
        >
          {remote ? 'Missions en présentiel' : 'Missions à distance'}
        </Button>
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformedMissions.map(mission => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      {transformedMissions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucune mission ne correspond à vos critères de recherche.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="mr-2"
          >
            Précédent
          </Button>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default MissionsPage;

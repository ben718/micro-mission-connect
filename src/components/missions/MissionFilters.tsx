
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { MissionFilters as MissionFiltersType } from '@/types/mission';
import { useMissionTypes } from '@/hooks/useMissionTypes';
import { useMissionFormats } from '@/hooks/useMissionFormats';
import { useEngagementLevels } from '@/hooks/useEngagementLevels';
import { useDifficultyLevels } from '@/hooks/useDifficultyLevels';

interface MissionFiltersProps {
  onFiltersChange: (filters: MissionFiltersType) => void;
}

const MissionFilters: React.FC<MissionFiltersProps> = ({ onFiltersChange }) => {
  const { data: missionTypes } = useMissionTypes();
  const { data: missionFormats } = useMissionFormats();
  const { data: engagementLevels } = useEngagementLevels();
  const { data: difficultyLevels } = useDifficultyLevels();

  const [query, setQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [format, setFormat] = React.useState<string | undefined>(undefined);
  const [difficultyLevel, setDifficultyLevel] = React.useState<string | undefined>(undefined);
  const [engagementLevel, setEngagementLevel] = React.useState<string | undefined>(undefined);
  const [selectedTypeIds, setSelectedTypeIds] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const updateFilters = React.useCallback(() => {
    const filters: MissionFiltersType = {
      query: query || undefined,
      location: location || undefined,
      format: format as any,
      difficulty_level: difficultyLevel as any,
      engagement_level: engagementLevel as any,
      missionTypeIds: selectedTypeIds.length > 0 ? selectedTypeIds : undefined,
      dateRange: dateRange?.from && dateRange?.to ? {
        from: dateRange.from,
        to: dateRange.to
      } : undefined,
      page: 0,
      pageSize: 12
    };
    
    onFiltersChange(filters);
  }, [query, location, format, difficultyLevel, engagementLevel, selectedTypeIds, dateRange, onFiltersChange]);

  React.useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypeIds(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setLocation('');
    setFormat(undefined);
    setDifficultyLevel(undefined);
    setEngagementLevel(undefined);
    setSelectedTypeIds([]);
    setDateRange(undefined);
  };

  const hasActiveFilters = query || location || format || difficultyLevel || engagementLevel || selectedTypeIds.length > 0 || dateRange;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche textuelle */}
        <div className="flex-1">
          <Input
            placeholder="Rechercher une mission..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Localisation */}
        <div className="w-full lg:w-64">
          <Input
            placeholder="Ville ou région..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Format */}
        <div className="w-full lg:w-48">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les formats</SelectItem>
              {missionFormats?.map((fmt) => (
                <SelectItem key={fmt.id} value={fmt.name}>
                  {fmt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Niveau d'engagement */}
        <div className="w-full lg:w-48">
          <Select value={engagementLevel} onValueChange={setEngagementLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Engagement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les niveaux</SelectItem>
              {engagementLevels?.map((level) => (
                <SelectItem key={level.id} value={level.name}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulté */}
        <div className="w-full lg:w-48">
          <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes difficultés</SelectItem>
              {difficultyLevels?.map((level) => (
                <SelectItem key={level.id} value={level.name}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="w-full lg:w-64">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMM", { locale: fr })} -{" "}
                      {format(dateRange.to, "dd MMM", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMM", { locale: fr })
                  )
                ) : (
                  "Choisir des dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bouton clear */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="whitespace-nowrap"
          >
            <X className="mr-2 h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Types de missions */}
      {missionTypes && missionTypes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Types de missions :</p>
          <div className="flex flex-wrap gap-2">
            {missionTypes.map((type) => (
              <Badge
                key={type.id}
                variant={selectedTypeIds.includes(type.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTypeToggle(type.id)}
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionFilters;

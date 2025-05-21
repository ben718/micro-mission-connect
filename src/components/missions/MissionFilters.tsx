
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCategories, useCities } from "@/hooks/useMissions";
import { MissionFilters as MissionFiltersType } from "@/types/mission";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";

interface MissionFiltersProps {
  onFilterChange: (filters: MissionFiltersType) => void;
}

const MissionFilters = ({ onFilterChange }: MissionFiltersProps) => {
  const { data: categories = [] } = useCategories();
  const { data: cities = [] } = useCities();

  const [filters, setFilters] = useState<MissionFiltersType>({});
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  const handleFilterChange = <T extends keyof MissionFiltersType>(
    key: T,
    value: MissionFiltersType[T]
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      
      // Si la valeur est vide, supprimer la propriété
      if (value === "" || value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete newFilters[key];
      }
      
      return newFilters;
    });
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    handleFilterChange("dateRange", {
      start: range.from,
      end: range.to
    });
  };

  const handleReset = () => {
    setFilters({});
    setDateRange({});
    onFilterChange({});
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Rechercher une mission..."
            value={filters.query || ""}
            onChange={(e) => handleFilterChange("query", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Select
            value={filters.city || ""}
            onValueChange={(value) => handleFilterChange("city", value)}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "P", { locale: fr })} -{" "}
                      {format(dateRange.to, "P", { locale: fr })}
                    </>
                  ) : (
                    format(dateRange.from, "P", { locale: fr })
                  )
                ) : (
                  <span>Sélectionner des dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex items-center"
        >
          <X className="mr-1 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default MissionFilters;

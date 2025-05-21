
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useCategories, useCities } from "@/hooks/useMissions";
import { MissionFilters as MissionFiltersType, DateRangeSelection } from "@/types/mission";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, X, MapPin } from "lucide-react";

interface MissionFiltersProps {
  onFilterChange: (filters: MissionFiltersType) => void;
}

const MissionFilters = ({ onFilterChange }: MissionFiltersProps) => {
  const { data: categories = [] } = useCategories();
  const { data: cities = [] } = useCities();

  const [filters, setFilters] = useState<MissionFiltersType>({});
  const [dateRange, setDateRange] = useState<DateRangeSelection>({
    from: undefined,
    to: undefined
  });

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

  const handleDateRangeChange = (range: DateRangeSelection) => {
    setDateRange(range);
    handleFilterChange("dateRange", {
      start: range.from,
      end: range.to
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categoryIds || [];
    let newCategories: string[];

    if (currentCategories.includes(categoryId)) {
      newCategories = currentCategories.filter((id) => id !== categoryId);
    } else {
      newCategories = [...currentCategories, categoryId];
    }

    handleFilterChange("categoryIds", newCategories);
  };

  const handleReset = () => {
    setFilters({});
    setDateRange({
      from: undefined,
      to: undefined
    });
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
              <SelectItem value="remote">À distance</SelectItem>
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

      <div className="mt-4">
        <Label className="mb-2 block">Catégories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={filters.categoryIds?.includes(category.id) ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.categoryIds?.includes(category.id)
                  ? "bg-bleu hover:bg-bleu-700"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFilterChange("remote", !filters.remote)}
          className={`flex items-center mr-4 ${filters.remote ? "bg-bleu text-white hover:bg-bleu-700" : ""}`}
        >
          <MapPin className="mr-1 h-4 w-4" />
          À distance
        </Button>

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

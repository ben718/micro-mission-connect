
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MissionList } from "@/components/missions/MissionList";
import MissionFilters from "@/components/missions/MissionFilters";
import { MissionFilters as MissionFiltersType } from "@/types/mission";

export function MissionsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<MissionFiltersType>({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    format: undefined,
    difficulty_level: undefined,
    engagement_level: undefined,
    missionTypeIds: searchParams.get('category')?.split(',') || [],
    dateRange: undefined
  });

  // Mettre à jour les filtres quand l'URL change
  useEffect(() => {
    const newFilters: MissionFiltersType = {
      query: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      format: undefined,
      difficulty_level: undefined,
      engagement_level: undefined,
      missionTypeIds: searchParams.get('category')?.split(',') || [],
      dateRange: searchParams.get('date') ? {
        start: new Date(searchParams.get('date') as string),
        end: new Date(searchParams.get('date') as string)
      } : undefined
    };
    setFilters(newFilters);
  }, [searchParams]);

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Missions disponibles</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez les missions qui correspondent à vos compétences et à vos disponibilités.
          </p>
        </div>
        
        <div className="flex gap-6">
          <div className="w-80 flex-shrink-0">
            <MissionFilters onFiltersChange={setFilters} />
          </div>
          <div className="flex-1">
            <MissionList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}

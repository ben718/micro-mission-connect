import { useMissions } from "@/hooks/useMissions";
import { MissionCard } from "./MissionCard";
import MissionFilters from "./MissionFilters";
import { useState } from "react";
import { MissionWithDetails } from "@/types/mission";

export function MissionList() {
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    format: "",
    difficulty_level: "",
    engagement_level: "",
    mission_type_id: "",
    organization_sector_id: "",
    date_range: { from: null, to: null }
  });

  const { data: missions, isLoading, error } = useMissions(filters);

  if (isLoading) {
    return <div>Chargement des missions...</div>;
  }

  if (error) {
    return <div>Une erreur est survenue lors du chargement des missions.</div>;
  }

  return (
    <div className="space-y-6">
      <MissionFilters onFiltersChange={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions?.map((mission: MissionWithDetails) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
      {missions?.length === 0 && (
        <div className="text-center text-muted-foreground">
          Aucune mission ne correspond à vos critères de recherche.
        </div>
      )}
    </div>
  );
}

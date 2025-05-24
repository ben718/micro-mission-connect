
import { useState } from "react";
import { useMissions } from "@/hooks/useMissions";
import MissionCard from "@/components/missions/MissionCard";
import MissionFilters from "@/components/missions/MissionFilters";
import { Loader2 } from "lucide-react";
import type { MissionFilters } from "@/types";

const MissionsPage = () => {
  const [filters, setFilters] = useState<MissionFilters>({});
  const { data: missions, isLoading, error } = useMissions(filters);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          <p>Erreur lors du chargement des missions: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Missions de bénévolat</h1>
        <p className="text-gray-600">
          Découvrez des missions qui correspondent à vos valeurs et disponibilités
        </p>
      </div>

      <MissionFilters onFilterChange={setFilters} />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des missions...</span>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {missions?.length || 0} mission(s) trouvée(s)
            </p>
          </div>

          {missions && missions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucune mission trouvée avec ces critères
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Essayez de modifier vos filtres ou revenez plus tard
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MissionsPage;

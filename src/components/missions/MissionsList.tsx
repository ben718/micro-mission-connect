
import { MissionWithAssociation, MissionFilters } from "@/types/mission";
import MissionCard from "@/components/missions/MissionCard";
import { useMissions } from "@/hooks/useMissions";
import { Skeleton } from "@/components/ui/skeleton";

interface MissionsListProps {
  filters?: MissionFilters;
}

const MissionsList = ({ filters }: MissionsListProps) => {
  const { data: missions, isLoading, error } = useMissions(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-20 w-full mb-3" />
            <Skeleton className="h-4 w-1/4 mb-1" />
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-1" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Une erreur est survenue lors du chargement des missions.</p>
        <p className="text-gray-500">Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  if (!missions || missions.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Aucune mission trouvée</h3>
        <p className="text-gray-500">Essayez d'autres critères de recherche ou revenez plus tard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
};

export default MissionsList;


import { MissionWithDetails, MissionFilters } from "@/types";
import MissionCard from "@/components/missions/MissionCard";
import { useMissions } from "@/hooks/useMissions";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MissionsListProps {
  filters?: MissionFilters;
}

const MissionsList = ({ filters }: MissionsListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Reset page to 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  const { data: missionsData, isLoading, error } = useMissions({
    ...filters,
    page: currentPage,
    pageSize: pageSize,
  });

  const missions = missionsData?.data || [];
  const totalCount = missionsData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const showPagination = totalPages > 1;

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>

      {showPagination && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Précédent
          </Button>
          <span>Page {currentPage + 1} sur {totalPages}</span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
          >
            Suivant
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default MissionsList;

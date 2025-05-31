
import { useMissions } from "@/hooks/useMissions";
import { MissionCard } from "./MissionCard";
import { MissionFilters as MissionFiltersType } from "@/types/mission";
import { MissionListSkeleton } from "@/components/ui/mission-skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { DEMO_MISSIONS, isDemoMode } from "@/utils/demo-data";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface MissionListProps {
  filters: MissionFiltersType;
}

export function MissionList({ filters }: MissionListProps) {
  const { data: missionsResponse, isLoading, error } = useMissions(filters);

  // En mode démo, utiliser les données fictives
  const missions = isDemoMode() ? DEMO_MISSIONS : (missionsResponse?.data || []);
  const isInDemoMode = isDemoMode();

  if (isLoading) {
    return <MissionListSkeleton count={6} />;
  }

  if (error && !isInDemoMode) {
    return (
      <ErrorMessage 
        message="Impossible de charger les missions. Veuillez réessayer plus tard." 
        className="my-8"
      />
    );
  }

  return (
    <div className="space-y-6">
      {isInDemoMode && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Mode démonstration activé - Ces missions sont des exemples pour découvrir la plateforme.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions?.map((mission: any) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
      
      {missions?.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg font-medium mb-2">Aucune mission trouvée</p>
          <p>Essayez de modifier vos critères de recherche ou revenez plus tard pour découvrir de nouvelles missions.</p>
        </div>
      )}
    </div>
  );
}

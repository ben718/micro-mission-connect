
import { useParams } from "react-router-dom";
import { LazyMissionDetail } from "@/components/lazy/LazyMissionDetail";

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Mission non trouvée</h2>
        <p className="text-gray-600">Cette mission n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  // Passer l'id comme prop missionId au composant LazyMissionDetail
  return <LazyMissionDetail missionId={id} />;
}

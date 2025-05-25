import { MissionList } from "@/components/missions/MissionList";

export function MissionsPage() {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Missions disponibles</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez les missions qui correspondent à vos compétences et à vos disponibilités.
          </p>
        </div>
        <MissionList />
      </div>
    </div>
  );
}

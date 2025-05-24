
import { useState } from "react";
import MissionFilters from "@/components/missions/MissionFilters";
import MissionsList from "@/components/missions/MissionsList";
import type { MissionFilters } from "@/types";

const MissionsPage = () => {
  const [filters, setFilters] = useState<MissionFilters>({});

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Missions de bénévolat</h1>
        <p className="text-gray-600">
          Découvrez des missions qui correspondent à vos valeurs et disponibilités
        </p>
      </div>

      <MissionFilters onFilterChange={setFilters} />

      <MissionsList filters={filters} />
    </div>
  );
};

export default MissionsPage;

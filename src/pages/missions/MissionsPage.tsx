
import { useState } from "react";
import { Helmet } from "react-helmet";
import MissionsList from "@/components/missions/MissionsList";
import MissionFilters from "@/components/missions/MissionFilters";
import MissionNavigation from "@/components/missions/MissionNavigation";
import { MissionFilters as MissionFiltersType } from "@/types/mission";

const MissionsPage = () => {
  const [filters, setFilters] = useState<MissionFiltersType>({});

  const handleFilterChange = (newFilters: MissionFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Helmet>
        <title>Trouver une mission | MicroBénévole</title>
      </Helmet>
      <div className="container-custom py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trouver une mission</h1>
          <p className="text-gray-600">
            Découvrez des missions de bénévolat qui correspondent à vos disponibilités et à vos centres d'intérêt.
          </p>
        </div>

        <MissionNavigation />
        <MissionFilters onFilterChange={handleFilterChange} />
        <MissionsList filters={filters} />
      </div>
    </>
  );
};

export default MissionsPage;

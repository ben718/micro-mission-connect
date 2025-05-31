
import { useState } from 'react';
import { MissionFilters } from '@/types/mission';

export const useMissionFilters = () => {
  const [filters, setFilters] = useState<MissionFilters>({
    query: '',
    location: '',
    format: undefined,
    difficulty_level: undefined,
    engagement_level: undefined,
    missionTypeIds: [],
    dateRange: undefined,
    page: 0,
    pageSize: 12
  });

  const updateFilters = (newFilters: Partial<MissionFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0 // Reset page when filters change
    }));
  };

  return {
    filters,
    updateFilters
  };
};

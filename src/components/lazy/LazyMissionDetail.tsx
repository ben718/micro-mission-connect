
import { lazy, Suspense } from 'react';
import { MissionListSkeleton } from '@/components/ui/mission-skeleton';

const MissionDetail = lazy(() => import('@/components/missions/MissionDetail'));

interface LazyMissionDetailProps {
  missionId: string;
}

export function LazyMissionDetail({ missionId }: LazyMissionDetailProps) {
  return (
    <Suspense fallback={<MissionListSkeleton count={1} />}>
      <MissionDetail missionId={missionId} />
    </Suspense>
  );
}

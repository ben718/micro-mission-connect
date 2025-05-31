
import { lazy, Suspense } from 'react';
import { MissionListSkeleton } from '@/components/ui/mission-skeleton';

const MissionDetail = lazy(() => import('@/components/missions/MissionDetail'));

export function LazyMissionDetail(props: any) {
  return (
    <Suspense fallback={<MissionListSkeleton count={1} />}>
      <MissionDetail {...props} />
    </Suspense>
  );
}

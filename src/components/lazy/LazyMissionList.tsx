
import { lazy, Suspense } from 'react';
import { MissionListSkeleton } from '@/components/ui/mission-skeleton';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { RetryBoundary } from '@/components/ui/retry-boundary';

const MissionList = lazy(() => import('@/components/missions/MissionList').then(module => ({ default: module.MissionList })));

export function LazyMissionList(props: any) {
  return (
    <ErrorBoundary>
      <RetryBoundary>
        <Suspense fallback={<MissionListSkeleton count={6} />}>
          <MissionList {...props} />
        </Suspense>
      </RetryBoundary>
    </ErrorBoundary>
  );
}

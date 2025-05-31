
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { RetryBoundary } from '@/components/ui/retry-boundary';

const DashboardStats = lazy(() => import('@/components/dashboard/DashboardStats'));

export function LazyDashboardStats(props: any) {
  return (
    <ErrorBoundary>
      <RetryBoundary>
        <Suspense fallback={
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
        }>
          <DashboardStats {...props} />
        </Suspense>
      </RetryBoundary>
    </ErrorBoundary>
  );
}

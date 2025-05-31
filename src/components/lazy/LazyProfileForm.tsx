
import { lazy, Suspense } from 'react';
import { ProfileFormSkeleton } from '@/components/ui/profile-skeleton';

const ProfileForm = lazy(() => import('@/components/profile/ProfileForm'));

export function LazyProfileForm(props: any) {
  return (
    <Suspense fallback={<ProfileFormSkeleton />}>
      <ProfileForm {...props} />
    </Suspense>
  );
}

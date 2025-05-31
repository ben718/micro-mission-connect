
import { lazy, Suspense } from 'react';
import { ProfileFormSkeleton } from '@/components/ui/profile-skeleton';

const ProfileForm = lazy(() => import('@/components/profile/ProfileForm').then(module => ({ default: module.default })));

export function LazyProfileForm(props: any) {
  return (
    <Suspense fallback={<ProfileFormSkeleton />}>
      <ProfileForm {...props} />
    </Suspense>
  );
}

'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser as useFirebaseUser } from '@/firebase/provider';
import { usePathname } from 'next/navigation'

export function useUser() {
  const { user, isUserLoading, userError } = useFirebaseUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading is finished, and we have a user, and we are on an auth page, redirect to home
    if (!isUserLoading && user && (pathname === '/login' || pathname === '/signup')) {
      router.push('/');
    }
  }, [user, isUserLoading, router, pathname]);

  return { user, isUserLoading, userError };
}

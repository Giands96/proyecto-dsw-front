'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';

const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);


  useEffect(() => {
    if (!hasHydrated) return;

    const isPublic =
      PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/validate');

    if (!isPublic && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);
  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  return <>{children}</>;
}

'use client';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';

const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/validate');
    
    if (!isPublic && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, pathname, router]);

  if (loading && !PUBLIC_ROUTES.includes(pathname)) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return <>{children}</>;
}
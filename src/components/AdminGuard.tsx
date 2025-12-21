"use client";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { rol, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated) {
        if (!isAuthenticated || rol !== 'Admin') {
            router.push("/"); 
        }
    }
  }, [_hasHydrated, isAuthenticated, rol, router]);
  if (!_hasHydrated || !isAuthenticated || rol !== 'Admin') {
      return <div className="p-10 text-center">Cargando sesión...</div>; 
  }

  return <>{children}</>;
}
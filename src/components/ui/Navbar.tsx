'use client';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const { isAuthenticated, nombre, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <nav className="border-b p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-50">
      <Link href={ROUTES.HOME} className="text-xl font-bold text-blue-600">
         BusTickets Perú
      </Link>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <span className="text-sm">Hola, <b>{nombre}</b></span>
            <Link href={ROUTES.DASHBOARD}><Button variant="outline">Mis Pasajes</Button></Link>
            <Button variant="destructive" onClick={handleLogout}>Salir</Button>
          </>
        ) : (
          <>
            <Link href={ROUTES.AUTH.LOGIN}><Button variant="ghost">Ingresar</Button></Link>
            <Link href={ROUTES.AUTH.REGISTER}><Button>Registrarse</Button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-8 text-blue-400">Admin Panel</h2>
          <nav className="flex flex-col gap-4">
            <Link href="/admin/dashboard" className="hover:text-blue-300 transition">
              👥 Usuarios
            </Link>
            <Link href="/admin/viajes" className="hover:text-blue-300 transition">
              🚌 Gestionar Viajes
            </Link>
            <div className="border-t border-gray-700 my-4"></div>
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              ← Volver al inicio
            </Link>
          </nav>
        </aside>

        {/* Contenido */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
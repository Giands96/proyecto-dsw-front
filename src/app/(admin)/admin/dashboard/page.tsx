"use client";
import { useEffect, useState } from "react";
import { AdminService, PaginatedResponse } from "@/services/api";
import { Usuario } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [data, setData] = useState<PaginatedResponse<Usuario> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    AdminService.getUsuarios(page, 9) // 9 items por página para ver grid 3x3
      .then(setData)
      .catch(console.error);
  }, [page]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios ({data?.totalCount || 0})</h1>
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
            >
                Anterior
            </Button>
            <span className="flex items-center px-2">Pág {page}</span>
            <Button 
                variant="outline" 
                onClick={() => setPage(p => p + 1)}
                disabled={!data || data.items.length < 9}
            >
                Siguiente
            </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((u) => (
          <Card key={u.id} className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{u.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{u.email}</p>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                u.rol === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {u.rol}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
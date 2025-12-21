"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminService, PasajeAdmin } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function GestionPasajesPage() {
  const { id } = useParams(); // ID del viaje
  const router = useRouter();
  const [pasajes, setPasajes] = useState<PasajeAdmin[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if(id) loadPasajes();
  }, [id]);

  const loadPasajes = () => {
    AdminService.getPasajesByViaje(id as string).then(setPasajes);
  };

  const startEdit = (p: PasajeAdmin) => {
    setEditingId(p.id);
    setNewName(p.nombrePasajero);
  };

  const saveEdit = async () => {
    if(!editingId) return;
    await AdminService.updatePasaje(editingId, newName);
    setEditingId(null);
    loadPasajes();
  };

  const deletePasaje = async (pasajeId: string) => {
    if(!confirm("¿Eliminar este pasaje? Esta acción no se puede deshacer.")) return;
    await AdminService.deletePasaje(pasajeId);
    loadPasajes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold">Lista de Pasajeros</h1>
      </div>

      <div className="bg-white rounded-md shadow border">
        {pasajes.length === 0 ? (
          <p className="p-8 text-center text-gray-500">
            No hay pasajes vendidos para este viaje.
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Pasajero</th>
                <th className="p-4 text-left">Comprador (Email)</th>
                <th className="p-4 text-left">Fecha Compra</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pasajes.map(
                (p) => (
                  console.log("Datos del pasajes:", p),
                  (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {editingId === p.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                            />
                            <Button size="sm" onClick={saveEdit}>
                              Guardar
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium">
                            {p.nombrePasajero}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{p.compradorEmail}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {p.fechaCompra
                          ? new Date(p.fechaCompra).toLocaleString("es-PE")
                          : "Fecha no disponible"}
                      </td>
                      <td className="p-4 text-right gap-2 flex justify-end">
                        {editingId !== p.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(p)}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePasaje(p.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
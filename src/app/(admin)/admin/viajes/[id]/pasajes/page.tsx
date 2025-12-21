"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminService, PasajeAdmin } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GestionPasajesPage() {
  const { id } = useParams(); // Este 'id' captura el GUID de la URL
  const router = useRouter();
  const [pasajes, setPasajes] = useState<PasajeAdmin[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if(id) {
        AdminService.getPasajesByViaje(id as string)
            .then(setPasajes)
            .catch(err => {
                console.error("Error silencioso:", err);
                setPasajes([]);
            });
    }
  }, [id]);

  const startEdit = (p: PasajeAdmin) => {
    setEditingId(p.id);
    setNewName(p.nombrePasajero);
  };

  const saveEdit = async () => {
    if(!editingId) return;
    await AdminService.updatePasaje(editingId, newName);
    setEditingId(null);
    // Recargar lista
    if(id) AdminService.getPasajesByViaje(id as string).then(setPasajes);
  };

  const deletePasaje = async (pasajeId: string) => {
    if(!confirm("¿Eliminar este pasaje?")) return;
    await AdminService.deletePasaje(pasajeId);
    if(id) AdminService.getPasajesByViaje(id as string).then(setPasajes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>← Volver</Button>
        <h1 className="text-2xl font-bold">Lista de Pasajeros</h1>
      </div>

      <div className="bg-white rounded-md shadow border overflow-hidden">
        {pasajes.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No hay pasajes vendidos para este viaje.</p>
        ) : (
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 border-b font-medium text-gray-700">
                    <tr>
                        <th className="p-4">Pasajero</th>
                        <th className="p-4">Comprador</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pasajes.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">
                                {editingId === p.id ? (
                                    <div className="flex gap-2">
                                        <Input value={newName} onChange={e => setNewName(e.target.value)} />
                                        <Button size="sm" onClick={saveEdit}>OK</Button>
                                    </div>
                                ) : p.nombrePasajero}
                            </td>
                            <td className="p-4 text-gray-600">{p.compradorEmail}</td>
                            <td className="p-4 text-gray-500">
                                {new Date(p.fechaCompra).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                                {editingId !== p.id && (
                                    <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                                        ✏️
                                    </Button>
                                )}
                                <Button variant="destructive" size="sm" onClick={() => deletePasaje(p.id)}>
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { AdminService, ViajesService } from "@/services/api"; // Importamos ambos
import { Viaje } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminViajesPage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [form, setForm] = useState({
    destino: "",
    fechaHora: "",
    costoBase: "",
    capacidadMax: "50"
  });

  const loadViajes = () => {
    ViajesService.getAll(1, 100).then(setViajes);
  };

  useEffect(() => { loadViajes(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AdminService.createViaje({
        destino: form.destino,
        fechaHora: new Date(form.fechaHora).toISOString(), // Formato ISO para el backend
        costoBase: Number(form.costoBase),
        capacidadMax: Number(form.capacidadMax)
      });
      alert("¡Viaje creado exitosamente!");
      setForm({ destino: "", fechaHora: "", costoBase: "", capacidadMax: "50" }); // Limpiar
      loadViajes(); // Recargar lista
    } catch (error) {
      alert("Error al crear el viaje. Revisa los datos.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este viaje?")) return;
    try {
      await AdminService.deleteViaje(id);
      setViajes(viajes.filter(v => v.id !== id));
    } catch (error) {
      alert("No se pudo eliminar. Es posible que ya tenga pasajes vendidos.");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Viajes</h1>

      {/* Formulario de Creación */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Viaje</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Destino</Label>
              <Input
                value={form.destino}
                onChange={(e) => setForm({ ...form, destino: e.target.value })}
                placeholder="Ej. Lima - Cusco"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <Input
                type="datetime-local"
                value={form.fechaHora}
                onChange={(e) =>
                  setForm({ ...form, fechaHora: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Costo ($)</Label>
              <Input
                type="number"
                value={form.costoBase}
                onChange={(e) =>
                  setForm({ ...form, costoBase: e.target.value })
                }
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Capacidad</Label>
              <Input
                type="number"
                value={form.capacidadMax}
                onChange={(e) =>
                  setForm({ ...form, capacidadMax: e.target.value })
                }
                required
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Guardar Viaje
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Viajes Existentes */}
      <div className="grid gap-4">
        {viajes.map((viaje) => (
          <div
            key={viaje.id}
            className="flex items-center justify-between bg-white p-4 rounded shadow border-l-4 border-blue-500"
          >
            <div>
              <h3 className="font-bold text-lg">{viaje.destino}</h3>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/viajes/${viaje.id}/pasajes`}>
                <Button variant="outline" size="sm">
                  👥 Ver Pasajeros
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(viaje.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
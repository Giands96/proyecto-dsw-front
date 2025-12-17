"use client";

import { useEffect, useState } from "react";
import { ViajesService } from "@/services/api";
import { Viaje } from "@/types";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";

export default function HomePage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ViajesService.getAll()
      .then((data) => {
        const listaViajes = Array.isArray(data) ? data : (data as any).items || [];
        console.log("Viajes procesados:", listaViajes);
        setViajes(listaViajes);
      })
      .catch(err => console.error("Error cargando viajes:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center p-10">Cargando viajes disponibles...</div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800">
        Viaja por todo el Perú
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viajes.map((viaje) => (
          <Card
            key={viaje.id}
            className="hover:shadow-2xl transition-shadow border-t-4 border-t-blue-500"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-xl">
                <span>{viaje.destino}</span>
                <span className="text-green-600">S/ {viaje.costoBase}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {format(new Date(viaje.fechaHora), "dd/MM/yyyy HH:mm")}
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                Capacidad: {viaje.asientosDisponibles ?? "No disponible"} asientos
              </div>
            </CardContent>
            <CardFooter>
              <Link href={ROUTES.CHECKOUT(viaje.id)} className="w-full">
                <Button className="w-full bg-blue-600 text-white">
                  Comprar Pasaje
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

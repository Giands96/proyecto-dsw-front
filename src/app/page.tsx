"use client";

import { useEffect, useState } from "react";
import { ViajesService } from "@/services/api";
import { Viaje } from "@/types";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { format, isPast } from "date-fns"; // Importamos isPast para facilitar la lógica
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";

export default function HomePage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ViajesService.getAll()
      .then((data) => {
        const listaViajes = Array.isArray(data) ? data : (data as any).items || [];
        const viajesOrdenados = listaViajes.sort((a: Viaje, b: Viaje) => 
            new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
        );
        setViajes(viajesOrdenados);
      })
      .catch(err => console.error("Error cargando viajes:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 animate-pulse text-blue-600">
        Cargando viajes disponibles...
      </div>
    );

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div id="hero" className="text-center flex justify-center items-center px-16 py-20 bg-slate-900 text-white rounded-b-3xl shadow-lg">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre y Reserva tus Viajes
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-300">
            Explora destinos y asegura tu asiento en segundos.
          </p>
          <Link href="#viajes-disponibles">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Ver Viajes Disponibles
            </Button>
          </Link>
        </div>
      </div>

      {/* LISTA DE VIAJES */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-blue-600 pl-4" id="viajes-disponibles">
          Próximas Salidas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viajes.length > 0 ? (
            viajes.map((viaje) => {
              const fechaViaje = new Date(viaje.fechaHora);
              const yaPaso = isPast(fechaViaje); 

              return (
                <Card
                  key={viaje.id}
                  className={`transition-all duration-300 ${
                    yaPaso 
                      ? "opacity-60 grayscale border-gray-200 bg-gray-50" 
                      : "hover:shadow-xl hover:-translate-y-1 border-t-4 border-t-blue-500 bg-white"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start text-xl">
                      <span className="font-bold text-gray-800">{viaje.destino}</span>
                      <span className={`font-bold ${yaPaso ? "text-gray-500" : "text-green-600"}`}>
                        S/ {viaje.costoBase}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-gray-600 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-blue-500" />
                      <span className={yaPaso ? "line-through decoration-red-500" : ""}>
                        {format(fechaViaje, "dd/MM/yyyy HH:mm")}
                      </span>
                      {yaPaso && <span className="text-xs text-red-500 font-bold ml-2">(Finalizado)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-blue-500" />
                      <span>
                        Capacidad: {viaje.asientosDisponibles ?? "No disp."} / {viaje.capacidadMax}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    {yaPaso ? (
                        // Botón deshabilitado si ya pasó
                        <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                            Viaje Realizado
                        </Button>
                    ) : (
                        // Botón habilitado para compra
                        <Link href={ROUTES.CHECKOUT(viaje.id)} className="w-full">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                Comprar Pasaje
                            </Button>
                        </Link>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No hay viajes programados en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
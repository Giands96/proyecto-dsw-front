'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PasajesService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ValidatePage() {
  const { id } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [pasajeData, setPasajeData] = useState<any>(null);
  const fechaViaje = pasajeData?.fechaHora ? new Date(pasajeData.fechaHora) : null;
  const fechaEsValida = fechaViaje && !isNaN(fechaViaje.getTime());

  useEffect(() => {
  if (!id) return;

  PasajesService.validar(id as string)
    .then((res) => {
      if (res?.isValid) {
        setPasajeData(res);
        setStatus('success');
      } else {
        setStatus('error');
      }
    })
    .catch(() => setStatus('error'));
}, [id]);


  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Validación de Pasaje</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              <p className="text-gray-500">Verificando en el sistema...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center text-center gap-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700">¡Pasaje Verídico!</h2>
              <div className="bg-gray-50 p-4 rounded-lg w-full text-left space-y-2 border">
                <p><strong>Pasajero:</strong> {pasajeData?.nombrePasajero}</p>
                <p><strong>Ruta:</strong> {pasajeData?.origen} → {pasajeData?.destino}</p>
                <p>
                  <strong>Fecha:</strong> {fechaEsValida ? format(fechaViaje, "dd/MM/yyyy HH:mm") : 'Fecha no disponible'}
                </p>
                <p className="text-xs text-gray-400">ID: {id}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center gap-4">
              <XCircle className="h-20 w-20 text-red-500" />
              <h2 className="text-2xl font-bold text-red-700">Pasaje Inválido</h2>
              <p className="text-gray-600">
                Este código no corresponde a un pasaje activo o registrado en nuestro sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { PasajesService } from '@/services/api';
import { Pasaje } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DashboardPage() {
  const [pasajes, setPasajes] = useState<Pasaje[]>([]);

  useEffect(() => {
    PasajesService.misPasajes().then(setPasajes);
  }, []);

  const handleDownloadQR = (base64: string, name: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64}`;
    link.download = `Ticket_${name.replace(/\s/g, '_')}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis Pasajes Comprados</h1>
      {pasajes.length === 0 ? (
        <p className="text-gray-500">Aún no has comprado ningún pasaje.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pasajes.map((p) => (
            <Card key={p.id} className="flex flex-col items-center p-4">
              <CardHeader className="w-full text-center">
                <CardTitle>{p.nombrePasajero}</CardTitle>
                <p className="text-sm text-gray-500">ID: {p.id.substring(0,8)}</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <img src={`data:image/png;base64,${p.qrData}`} alt="QR Code" className="w-48 h-48 border p-2" />
                <Button onClick={() => handleDownloadQR(p.qrData, p.nombrePasajero)} variant="outline" className="flex gap-2 w-full">
                  <Download size={18} /> Descargar QR
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
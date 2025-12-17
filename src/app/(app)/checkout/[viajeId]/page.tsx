'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { PasajesService } from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, UserPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const { viajeId } = useParams();
  const router = useRouter();
  const { register, control, handleSubmit } = useForm({
    defaultValues: { pasajeros: [{ nombre: '' }] }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pasajeros"
  });

  const onSubmit = async (data: any) => {
    try {
      await PasajesService.comprar(viajeId as string, data.pasajeros);
      alert('¡Pago procesado y pasajes generados con éxito!');
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      alert('Error al procesar la compra');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Datos de los Pasajeros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-end border-b pb-4">
                <div className="flex-1 space-y-2">
                  <Label>Nombre del Pasajero {index + 1}</Label>
                  <Input {...register(`pasajeros.${index}.nombre` as const, { required: true })} placeholder="Nombre completo" />
                </div>
                {index > 0 && (
                  <Button type="button" variant="destructive" onClick={() => remove(index)} size="icon">
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
            ))}
            
            <div className="flex flex-col gap-4">
              <Button type="button" variant="outline" onClick={() => append({ nombre: '' })} className="flex gap-2">
                <UserPlus size={18}/> Agregar Pasajero
              </Button>
              <Button type="submit" className="w-full bg-green-600 text-white font-bold h-12">
                Proceder al Pago (Ficticio)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
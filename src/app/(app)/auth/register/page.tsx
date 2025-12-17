'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/api';
import { ROUTES } from '@/constants/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await AuthService.register(data.nombre, data.email, data.password);
      alert('Registro exitoso. Ya puedes iniciar sesión.');
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      alert('Error al registrar el usuario');
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Crear Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input id="nombre" {...register("nombre", { required: true })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email", { required: true })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register("password", { required: true })} />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Registrarse
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
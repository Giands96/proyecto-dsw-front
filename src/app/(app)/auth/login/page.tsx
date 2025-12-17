'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: any) => {
    try {
      const res = await AuthService.login(data.email, data.password);
      setAuth(res);
      router.push(ROUTES.HOME);
    } catch (error) {
      alert('Credenciales inválidas o error de conexión');
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="usuario@peru.com" {...register("email", { required: true })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register("password", { required: true })} />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
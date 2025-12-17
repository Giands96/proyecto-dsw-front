import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { Viaje, Pasaje, Usuario } from "@/types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
})

api.interceptors.request.use((config) => {
  const token = (useAuthStore.getState() as { token?: string | null }).token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (nombre: string, email: string, password: string) => 
    (await api.post('/auth/register', { nombre, email, password })).data,
}

export const ViajesService = {
    getAll: async (page: number = 1, pageSize: number = 20): Promise<Viaje[]> => {
        const response = await api.get("/viajes", {
            params: {
                page,
                pageSize
            }
        });
        return response.data.items || response.data;
    },
    getById: async (id: string): Promise<Viaje> => (await api.get(`/viajes/${id}`)).data,
}

export const PasajesService = {
    comprar: async (viajeId: string, pasajeros: { nombre: string }[]) => 
    (await api.post('/pasajes', { viajeId, pasajeros })).data,
  
    misPasajes: async (page: number = 1, pageSize: number = 10): Promise<Pasaje[]> => {
    const response = await api.get('/pasajes/mis', {
      params: { page, pageSize }
    });
    return response.data.items || response.data;
  },
  
    validar: async (qrContent: string) => 
    (await api.post('/pasajes/validar', { qrContent })).data,
}


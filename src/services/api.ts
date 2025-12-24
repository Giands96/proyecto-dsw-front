import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { Viaje, Pasaje, Usuario } from "@/types";

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface PasajeAdmin {
    id: string;
    nombrePasajero: string;
    costo: number;
    compradorEmail: string;
    fechaCompra: string;
}

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
    comprar: async (viajeId: string, pasajeros: { nombre: string }[]) => {
        console.log ("Comprar pasaje:", viajeId, pasajeros);
        console.log("Comprador: ", useAuthStore.getState().email);
        return (await api.post('/pasajes', { viajeId, pasajeros })).data;
    },
  
    misPasajes: async (page: number = 1, pageSize: number = 10): Promise<Pasaje[]> => {
    const response = await api.get('/pasajes/mis', {
      params: { page, pageSize }
    });
    return response.data.items || response.data;
  },
  
    validar: async (id: string) => {
    try {
      const res = await api.get(`/pasajes/validar/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error validando pasaje:", error);
      return null; 
    }
  }
}

export const AdminService = {
  getUsuarios: async (page = 1, pageSize = 10): Promise<PaginatedResponse<Usuario>> => {
        const res = await api.get('/admin/usuarios', { params: { page, pageSize } });
        const data = res.data;

        if (Array.isArray(data)) {
        return {
            items: data,
            totalCount: data.length,
            page: 1,
            pageSize: data.length
        };
    }

        return {
        items: data.items || data.Items || [],
        totalCount: data.totalCount || data.TotalCount || 0,
        page: data.page || data.Page || page,
        pageSize: data.pageSize || data.PageSize || pageSize
    };
    },

  createViaje: async (viajeData: {
    destino: string,
    fechaHora: string,
    costoBase: number,
    capacidadMax: number
  }) => {
    const response = await api.post('/admin/viajes', viajeData);
    return response.data;
  },

  deleteViaje: async (viajeId: string) => {
    const response = await api.delete(`/admin/viajes/${viajeId}`);
    return response.data;
  },

  getPasajesByViaje: async (viajeId: string): Promise<PasajeAdmin[]> => {
        const res = await api.get(`/admin/viajes/${viajeId}/pasajes`);
        if(res.data.length === 0) return [];
        console.log(res.data);
        return res.data.map((p: any) => ({
            id: p.id,
            nombrePasajero: p.nombrePasajero,
            costo: p.costo,
            compradorEmail: p.compradorEmail || p.usuarioComprador?.email || "Email no disponible",
            fechaCompra: p.fechaCompra
        }));
    },

    updatePasaje: async (id: string, nombrePasajero: string) => {
        await api.put(`/admin/pasajes/${id}`, { id, nombrePasajero });
    },

    deletePasaje: async (id: string) => {
        await api.delete(`/admin/pasajes/${id}`);
    }

}


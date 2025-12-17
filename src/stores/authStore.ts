import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Usuario } from "@/types/index";

interface AuthState extends Partial<Usuario> {
    isAuthenticated: boolean;
    token?: string;
}   

interface AuthActions {
    setAuth: (userData: Usuario) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: undefined,
      email: undefined,
      nombre: undefined,
      rol: undefined,
      isAuthenticated: false,

      setAuth: (userData) =>
        set({ ...userData, isAuthenticated: true }),

      logout: () =>
        set({
          token: undefined,
          email: undefined,
          nombre: undefined,
          rol: undefined,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
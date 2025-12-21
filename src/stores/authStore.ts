import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Usuario } from "@/types/index";

interface AuthState extends Partial<Usuario> {
    isAuthenticated: boolean;
    token?: string;
    _hasHydrated: boolean;
}   

interface AuthActions {
    setAuth: (userData: Usuario) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void; 
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: undefined,
      email: undefined,
      nombre: undefined,
      rol: undefined,
      isAuthenticated: false,
      isAdmin: false,
      _hasHydrated: false, 

      setAuth: (userData) =>
        set({ ...userData, isAuthenticated: true}),

      logout: () =>
        set({
          token: undefined,
          email: undefined,
          nombre: undefined,
          rol: undefined,
          isAuthenticated: false,
        }),
        
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
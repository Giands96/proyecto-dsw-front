export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  DASHBOARD: '/dashboard',
  CHECKOUT: (viajeId: string) => `/checkout/${viajeId}`,
  VALIDATE: (id: string) => `/validate/${id}`,
};
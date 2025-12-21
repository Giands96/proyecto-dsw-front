export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS : '/admin/users',
    TRAVELS : '/admin/travels',
    TICKETS: '/admin/tickets',
  },
  DASHBOARD: '/dashboard',
  CHECKOUT: (viajeId: string) => `/checkout/${viajeId}`,
  VALIDATE: (id: string) => `/validate/${id}`,
};
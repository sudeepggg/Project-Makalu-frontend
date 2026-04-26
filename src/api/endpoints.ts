// All paths are relative to axiosInstance baseURL (/api → proxied to /api/v1)
export const endpoints = {
  auth: {
    login:    '/auth/login',
    register: '/auth/register',
    profile:  '/auth/profile',
  },
  customers:  '/customers',
  products:   '/products',
  orders:     '/orders',
  inventory:  '/inventory',
  pricing:    '/pricing',
  payments:   '/payments',
  reports:    '/reports',
};

import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('authToken');
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default axiosInstance;
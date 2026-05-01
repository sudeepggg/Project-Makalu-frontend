import axios, { type InternalAxiosRequestConfig } from "axios";

export const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(
  /(^"|"$)/g,
  "",
);

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
axiosInstance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default axiosInstance;

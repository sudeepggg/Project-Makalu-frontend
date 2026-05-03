import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/authStore";

export const API_BASE = import.meta.env.VITE_API_URL || "/api";

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (fn: () => void) => {
  unauthorizedHandler = fn;
};

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (unauthorizedHandler) {
        unauthorizedHandler();
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(err: unknown) {
    const axiosErr = err instanceof AxiosError ? err : null;
    const message =
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      (err instanceof Error ? err.message : "Unknown error");

    super(message);
    this.name = "ApiError";

    if (axiosErr) {
      this.status = axiosErr.response?.status;
      this.data   = axiosErr.response?.data;
    }
  }
}

export const request = async <T = unknown>(
  config: AxiosRequestConfig & { signal?: AbortSignal },
): Promise<T> => {
  try {
    const res = await axiosInstance.request<T>(config);
    return res.data;
  } catch (err) {
    throw new ApiError(err);
  }
};

export default axiosInstance;
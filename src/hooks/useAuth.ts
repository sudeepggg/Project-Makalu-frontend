import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { endpoints } from "../api/endpoints";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post(endpoints.auth.login, {
        email,
        password,
      });

      const token: string = data.data.token;
      const user = data.data.user;
      console.log("Login response:", data);

      if (!token || !user) throw new Error("Invalid response from server");
      setAuth(user, token);

      navigate("/dashboard", { replace: true });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    setLoading(true);
    try {
      const { data } = await api.post(endpoints.auth.register, payload);

      const token: string = data.data.token;
      const user = data.data.user;

      if (!token || !user) throw new Error("Invalid response from server");

      setAuth(user, token);
      navigate("/dashboard", { replace: true });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const hasRole = (role: string): boolean =>
    user?.roles?.includes(role) ?? false;   

  const hasAny = (roles: string[]) =>
    roles.some((r) => user?.roles?.includes(r)) ?? false;
  const isAdmin = () => hasRole("ADMIN");
  const isStaff = () => hasRole("SALES_STAFF");

  const isTokenValid = (): boolean => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const isAuthenticated = !!token && isTokenValid();
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "";

  return {
    // state
    user,
    token,
    isLoading,
    isAuthenticated,
    fullName,

    // actions
    login,
    register,
    logout,

    // role guards
    hasRole,
    hasAny,
    isAdmin,
    isStaff,
  };
}

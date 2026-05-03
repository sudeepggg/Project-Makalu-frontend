import api from "../api/client";
import { endpoints } from "../api/endpoints";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth); //  use dedicated clear instead of null as any

  const login = async (email: string, password: string) => {
    const { data } = await api.post(endpoints.auth.login, { email, password });

    const token: string = data.data.token;
    const user = data.data.user;

    if (!token || !user) {
      throw new Error("Invalid response from server"); //  guard against malformed response
    }

    setAuth(user, token);
    return data;
  };

  //  clearAuth already handles localStorage + state — no duplication
  const logout = () => clearAuth();

  return { login, logout };
}

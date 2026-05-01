import api from '../api/client';
import { endpoints } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const setAuth = useAuthStore(s => s.setAuth);
  const login = async (email: string, password: string) => {
    const r = await api.post(endpoints.auth.login, { email, password });
    const token = r.data.data.token;
    const user = r.data.data.user;
    setAuth(user, token);
    return r.data;
  };
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuth(null as any, null as any);
  };
  return { login, logout };
}
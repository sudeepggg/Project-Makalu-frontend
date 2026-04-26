import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
  } | null;
  setAuth: (user: AuthState['user'], token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('authToken'),
  user: (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  setAuth: (user, token) => {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
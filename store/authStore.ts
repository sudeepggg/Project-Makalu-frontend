import create from 'zustand';
import { User } from '../types/auth';

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('authToken'),
  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    set({ user: null, token: null });
  },
}));
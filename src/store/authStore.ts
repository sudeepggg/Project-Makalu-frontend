import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id:        string;
  username:  string;
  email:     string;
  firstName?: string;
  lastName?:  string;
  roles:     string[];
}

interface AuthState {
  user:     User | null;
  token:    string | null;
  isLoading: boolean;
  setAuth:   (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading:(v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:      null,
      token:     null,
      isLoading: false,

      setAuth: (user, token) => set({ user, token }),
      clearAuth: ()          => set({ user: null, token: null }),
      setLoading: (v)        => set({ isLoading: v }),
    }),
    {
      name:    "auth-storage",      
      partialize: (s) => ({   
        user:  s.user,
        token: s.token,
      }),
    }
  )
);
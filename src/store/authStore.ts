import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (user: AuthUser | null, token: string | null) => void;
  clearAuth: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (user, token) => set({ user, token }),

      clearAuth: () => set({ user: null, token: null }),

      hasRole: (role) => get().user?.roles?.includes(role) ?? false,
    }),
    {
      name: 'auth-storage',                          // localStorage key
      storage: createJSONStorage(() => localStorage),
      // partialize: (state) => ({                      // only persist what's needed
      //   token: state.token,
      //   user: state.user,
      // }),
    }
  )
);
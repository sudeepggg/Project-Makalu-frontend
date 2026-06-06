import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  id:       string;
  username: string;
  email:    string;
  roles:    string[];
}

interface AuthContextType {
  user:      User | null;
  token:     string | null;
  isLoading: boolean;
  login:     (token: string, user: User) => void;
  logout:    () => void;
  hasRole:   (role: string) => boolean;
  isAdmin:   () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]      = useState<User | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user",  JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false;
  const isAdmin = ()              => hasRole("ADMIN");

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
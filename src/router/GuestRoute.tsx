import { Navigate, Outlet } from "react-router-dom";
import { useAuth }          from "../hooks/useAuth";

export const GuestRoute = () => {
  const { isAuthenticated } = useAuth();

  // Already logged in — bounce to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
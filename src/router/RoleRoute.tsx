import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { hasAny } = useAuth();

  console.log("hasAny", hasAny);
  console.log("hasAny", hasAny(allowedRoles));

  if (!hasAny(allowedRoles)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

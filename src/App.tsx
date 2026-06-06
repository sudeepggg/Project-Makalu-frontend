import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { GuestRoute } from "./router/GuestRoute";
import { ProtectedRoute } from "./router/ProtectedRouter";
import { RoleRoute } from "./router/RoleRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/index.";
import Orders from "./pages/order";
import Customers from "./pages/customers";
import Inventory from "./pages/Inventory";
import Products from "./pages/products";
import Suppliers from "./pages/suppliers";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/common/Sidebar";
import Pricing from "./pages/Pricing";
import Register from "./pages/Register";

function AppShell() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/orders", element: <Orders /> },
          { path: "/customers", element: <Customers /> },
          { path: "/pricing", element: <Pricing /> },
          {
            element: <RoleRoute allowedRoles={["ADMIN"]} />,
            children: [
              { path: "/inventory", element: <Inventory /> },
              { path: "/products", element: <Products /> },
              { path: "/suppliers", element: <Suppliers /> },
              { path: "/reports", element: <Reports /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "/unauthorized", element: <NotFound /> },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

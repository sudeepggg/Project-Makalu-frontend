import { createBrowserRouter, Navigate } from "react-router-dom";
import Customers from "../pages/customers";
import Dashboard from "../pages/dashboard/index.";
import Inventory from "../pages/Inventory";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Orders from "../pages/Orders";
import Pricing from "../pages/Pricing";
import Products from "../pages/Products";
import Reports from "../pages/Reports";
import GuestLayout from "../layout/guestLayout";
import AuthLayout from "../layout";

export const router = createBrowserRouter([
  {
    element: <GuestLayout />,          // redirects to /dashboard if already logged in
    children: [
      { path: "/login", element: <Login /> },
    ],
  },
  {
    element: <AuthLayout />,           // redirects to /login if not authenticated
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard",  element: <Dashboard /> },
      { path: "customers",  element: <Customers /> },
      { path: "products",   element: <Products /> },
      { path: "orders",     element: <Orders /> },
      { path: "inventory",  element: <Inventory /> },
      { path: "pricing",    element: <Pricing /> },
      { path: "reports",    element: <Reports /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
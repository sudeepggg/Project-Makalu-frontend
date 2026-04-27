import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Warehouse,
  Tag,
  BarChart3,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/customers", label: "Customers", Icon: Users },
  { to: "/products", label: "Products", Icon: Package },
  { to: "/orders", label: "Orders", Icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", Icon: Warehouse },
  { to: "/pricing", label: "Pricing", Icon: Tag },
  { to: "/reports", label: "Reports", Icon: BarChart3 },
];

const Sidebar: React.FC = () => (
  <aside className="w-56 bg-white border-r border-surface-200 min-h-[calc(100vh-56px)]  flex flex-col py-4 px-3 shrink-0">
    <nav className="space-y-0.5">
      {nav.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="mt-auto pt-4 border-t border-surface-200">
      <div className="px-3 py-2 text-xs text-ink-faint font-mono">
        DOMS v1.0
      </div>
    </div>
  </aside>
);
export default Sidebar;

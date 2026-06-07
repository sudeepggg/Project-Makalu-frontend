import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Mountain,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const nav = [
  {
    to: "/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
    roles: ["ADMIN", "SALES_STAFF"],
    section: "General",
  },
  {
    to: "/customers",
    label: "Customers",
    Icon: Users,
    roles: ["ADMIN", "SALES_STAFF"],
    section: "General",
  },
  {
    to: "/orders",
    label: "Orders",
    Icon: ShoppingCart,
    roles: ["ADMIN", "SALES_STAFF"],
    section: "General",
  },
  {
    to: "/products",
    label: "Products",
    Icon: Package,
    roles: ["ADMIN"],
    section: "Management",
  },
  {
    to: "/inventory",
    label: "Inventory",
    Icon: Warehouse,
    roles: ["ADMIN"],
    section: "Management",
  },
  {
    to: "/pricing",
    label: "Pricing",
    Icon: Tag,
    roles: ["ADMIN", "SALES_STAFF"],
    section: "Management",
  },
  {
    to: "/suppliers",
    label: "Suppliers",
    Icon: Truck,
    roles: ["ADMIN"],
    section: "Management",
  },
  {
    to: "/reports",
    label: "Reports",
    Icon: BarChart3,
    roles: ["ADMIN"],
    section: "Analytics",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Sidebar = () => {
  const navigate = useNavigate();
  const { fullName, isAdmin, logout } = useAuth();
  const userRole = isAdmin() ? "ADMIN" : "SALES_STAFF";

  const filteredNav = nav.filter((item) => item.roles.includes(userRole));

  // Group by section, preserving order
  const sections = filteredNav.reduce<{ label: string; items: typeof nav }[]>(
    (acc, item) => {
      const last = acc[acc.length - 1];
      if (last?.label === item.section) {
        last.items.push(item);
      } else {
        acc.push({ label: item.section, items: [item] });
      }
      return acc;
    },
    [],
  );

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-white border-r border-surface-200 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-surface-200 ">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5"
          aria-label="Go to dashboard"
        >
          <Mountain size={22} className="text-accent" aria-hidden />
          <span className="font-display text-xl text-primary tracking-wide">
            Project Makalu
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map(({ label, items }) => (
          <div key={label}>
            <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest text-ink-faint uppercase">
              {label}
            </p>
            <ul className="space-y-0.5">
              {items.map(({ to, label: itemLabel, Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={16} />
                    {itemLabel}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-surface-200">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
            {getInitials(fullName ?? "?")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink truncate">
              {fullName}
            </p>
            <p className="text-[10px] text-ink-faint">{userRole}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-md text-ink-faint hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

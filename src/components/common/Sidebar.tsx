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

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const { fullName, isAdmin, logout } = useAuth();
  const userRole = isAdmin() ? "ADMIN" : "SALES_STAFF";

  const filteredNav = nav.filter((item) => item.roles.includes(userRole));

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
    <aside
      className={`
        flex flex-col min-h-screen bg-white border-r border-surface-200 shrink-0
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed ? "w-[60px]" : "w-56"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center h-14 border-b border-surface-200 px-[18px] overflow-hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 shrink-0"
          aria-label="Go to dashboard"
        >
          <Mountain size={22} className="text-accent shrink-0" aria-hidden />
          <span
            className={`
              font-display text-xl text-primary tracking-wide whitespace-nowrap
              transition-all duration-300
              ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
            `}
          >
            Project Makalu
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-5">
        {sections.map(({ label, items }) => (
          <div key={label}>
            {/* Section label — hidden when collapsed */}
            <p
              className={`
                mb-1 text-[10px] font-semibold tracking-widest text-ink-faint uppercase
                transition-all duration-200 whitespace-nowrap overflow-hidden
                ${collapsed ? "opacity-0 h-0 mb-0" : "opacity-100 px-3"}
              `}
            >
              {label}
            </p>

            <ul className="space-y-0.5">
              {items.map(({ to, label: itemLabel, Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    title={collapsed ? itemLabel : undefined}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""} ${
                        collapsed ? "justify-center px-0" : ""
                      }`
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    <span
                      className={`
                        whitespace-nowrap overflow-hidden transition-all duration-300
                        ${collapsed ? "w-0 opacity-0" : "opacity-100"}
                      `}
                    >
                      {itemLabel}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-2 py-3 border-t border-surface-200">
        <div
          className={`flex items-center gap-2.5 px-2 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div
            className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-semibold shrink-0"
            title={collapsed ? (fullName ?? "") : undefined}
          >
            {getInitials(fullName ?? "?")}
          </div>

          <div
            className={`
              flex-1 min-w-0 transition-all duration-300
              ${collapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"}
            `}
          >
            <p className="text-xs font-semibold text-ink truncate">{fullName}</p>
            <p className="text-[10px] text-ink-faint">{userRole}</p>
          </div>

          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-md text-ink-faint hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
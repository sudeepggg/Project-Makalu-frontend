import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const linkClass = ({isActive}:{isActive:boolean}) => isActive ? 'block px-4 py-2 bg-primary text-white rounded' : 'block px-4 py-2 hover:bg-gray-100 rounded';
  return (
    <aside className="w-64 bg-white border-r h-screen p-4 hidden md:block">
      <nav className="space-y-2 text-sm">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/customers" className={linkClass}>Customers</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        <NavLink to="/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
        <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;
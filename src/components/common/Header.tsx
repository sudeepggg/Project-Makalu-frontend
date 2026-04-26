import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Mountain } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clearAuth);

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.username || user?.email || 'User';

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-14 bg-primary flex items-center justify-between px-6 shadow-md sticky top-0 z-40">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2.5 group"
      >
        <Mountain size={22} className="text-accent" />
        <span className="font-display text-xl text-white tracking-wide">Project Makalu</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-800 border-2 border-accent/40 flex items-center justify-center text-sm font-semibold text-accent">
            {initial}
          </div>
          <span className="text-sm text-white/80 hidden sm:block">{displayName}</span>
        </div>
        <button
          onClick={() => { clearAuth(); navigate('/login'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-primary-800 transition-all"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
export default Header;

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Mountain } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clearAuth);

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.username ?? user?.email ?? 'User';

  const initial = displayName.charAt(0).toUpperCase();

  // ✅ stable reference, no inline arrow recreated on every render
  const handleLogout = useCallback(() => {
    clearAuth();
    navigate('/login', { replace: true });   // ✅ replace so back button doesn't return to protected page
  }, [clearAuth, navigate]);

  return (
    <header className="h-14 bg-primary flex items-center justify-between px-6 shadow-md sticky top-0 z-40">
      {/*  semantic: logo is not really a button, use a link */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2.5"
        aria-label="Go to dashboard"
      >
        <Mountain size={22} className="text-accent" aria-hidden />
        <span className="font-display text-xl text-white tracking-wide">Project Makalu</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-primary-800 border-2 border-accent/40 flex items-center justify-center text-sm font-semibold text-accent"
            aria-hidden   //  decorative — screen readers get the name from the text beside it
          >
            {initial}
          </div>
          {/*  title shows full name on hover even when text is hidden on mobile */}
          <span className="text-sm text-white/80 hidden sm:block" title={displayName}>
            {displayName}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-primary-800 transition-all"
          aria-label="Logout"
        >
          <LogOut size={14} aria-hidden />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
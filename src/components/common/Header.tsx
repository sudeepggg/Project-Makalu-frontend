import { Bell, ChevronDown, LogOut, Menu, Palette, Settings, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/orders': 'Orders',
  '/products': 'Products',
  '/inventory': 'Inventory',
  '/pricing': 'Pricing',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports',
};

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clearAuth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : (user?.username ?? user?.email ?? 'User');

  const initial = displayName.charAt(0).toUpperCase();

  const pageTitle = Object.entries(navLabels).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'Dashboard';

  const handleLogout = useCallback(() => {
    clearAuth();
    navigate('/login', { replace: true });
  }, [clearAuth, navigate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <header className="h-14 bg-white flex items-center justify-between px-4 border-b border-surface-200 sticky top-0 z-40">

      {/* Left: sidebar toggle + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-md text-ink-faint hover:text-ink hover:bg-surface-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-[18px] font-semibold text-ink">{pageTitle}</h1>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-1">

        <button
          className="relative p-2 rounded-md text-ink-faint hover:text-ink hover:bg-surface-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 ml-1 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-semibold shrink-0">
              {initial}
            </div>
            <span className="text-sm font-medium text-ink hidden sm:block max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className={`text-ink-faint hidden sm:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-[calc(100%+6px)] w-56 bg-white border border-surface-200 rounded-xl shadow-lg overflow-hidden z-50"
              role="menu"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-surface-100">
                <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
                <p className="text-xs text-ink-faint truncate">{user?.email ?? ''}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-ink hover:bg-surface-50 transition-colors"
                  role="menuitem"
                >
                  <User size={14} className="text-ink-faint" /> Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-ink hover:bg-surface-50 transition-colors"
                  role="menuitem"
                >
                  <Settings size={14} className="text-ink-faint" /> Settings
                </button>
                <button
                  onClick={() => { navigate('/settings/appearance'); setDropdownOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-ink hover:bg-surface-50 transition-colors"
                  role="menuitem"
                >
                  <Palette size={14} className="text-ink-faint" /> Appearance
                </button>
              </div>

              <div className="border-t border-surface-100 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  role="menuitem"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
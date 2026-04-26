import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const clear = useAuthStore(s => s.clearAuth);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-xl font-bold text-primary">Project Makalu</button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">{user ? user.firstName || user.username : ''}</div>
          <button onClick={() => { clear(); navigate('/login'); }} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Logout</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
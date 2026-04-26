import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
      <Mountain size={48} className="text-primary-200 mb-4" />
      <h1 className="font-display text-5xl text-primary mb-2">404</h1>
      <p className="text-ink-muted mb-6">This page doesn't exist.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
    </div>
  );
};
export default NotFound;

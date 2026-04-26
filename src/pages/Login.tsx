import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { endpoints } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';
import { Mountain, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@doms.local');
  const [password, setPassword] = useState('admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await api.post(endpoints.auth.login, { email, password });
      const { token, user } = r.data.data;
      setAuth(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-4">
            <Mountain size={32} className="text-accent" />
          </div>
          <h1 className="font-display text-4xl text-white mb-1">Project Makalu</h1>
          <p className="text-white/50 text-sm">Dealer Order Management System</p>
        </div>

        <div className="card p-8 shadow-modal">
          <h2 className="font-display text-2xl text-primary mb-6">Sign in</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="form-field" placeholder="admin@doms.local" required autoFocus
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="form-field" placeholder="••••••••" required
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;

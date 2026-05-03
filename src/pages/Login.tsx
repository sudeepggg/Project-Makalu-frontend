import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';   //  use the hook you already built — don't inline API logic

const Login: React.FC = () => {
  //  remove hardcoded credentials — use empty strings in production
  const [email, setEmail]       = useState(import.meta.env.DEV ? 'admin@doms.local' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'admin@123' : '');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate    = useNavigate();
  const { login }   = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);   //  separate lines — easier to read/debug

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });  //  replace so back button doesn't return to /login
    } catch (err) {
      //  no `any` — proper narrowing
      const message =
        err instanceof Error ? err.message : 'Login failed. Check credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"  //  pointer-events-none — overlay shouldn't capture clicks
        style={{ backgroundImage: 'url("data:image/svg+xml,...")' }}
        aria-hidden  //  decorative
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-4">
            <Mountain size={32} className="text-accent" aria-hidden />
          </div>
          <h1 className="font-display text-4xl text-white mb-1">Project Makalu</h1>
          <p className="text-white/50 text-sm">Dealer Order Management System</p>
        </div>

        <div className="card p-8 shadow-modal">
          <h2 className="font-display text-2xl text-primary mb-6">Sign in</h2>

          {error && (
            <div
              role="alert"   //  screen readers announce this immediately when it appears
              className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4"
            >
              <AlertCircle size={16} className="shrink-0" aria-hidden />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4" noValidate>  {/*  noValidate — use your own error UI, not browser tooltips */}
            <div>
              <label htmlFor="email" className="form-label">Email</label>  {/*  htmlFor links label to input */}
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-field"
                placeholder="admin@doms.local"
                required
                autoFocus
                autoComplete="email"   //  helps password managers
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-field"
                placeholder="••••••••"
                required
                autoComplete="current-password"   //  password manager hint
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"  //  visual disabled feedback
              aria-busy={loading}   //  screen readers know it's loading
            >
              {loading && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden
                />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Mountain, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormValues {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstname,
        lastName: data.lastname,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Register failed. Check credentials.';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,...")' }}
        aria-hidden
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
          <h2 className="font-display text-2xl text-primary mb-6">Create Account</h2>

          {/* Root-level (server) error */}
          {errors.root && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4"
            >
              <AlertCircle size={16} className="shrink-0" aria-hidden />
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* First Name */}
            <div>
              <label htmlFor="firstname" className="form-label">First Name</label>
              <Controller
                name="firstname"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="firstname"
                    type="text"
                    className="form-field"
                    placeholder="John"
                    autoComplete="given-name"
                    autoFocus
                  />
                )}
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastname" className="form-label">Last Name</label>
              <Controller
                name="lastname"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="lastname"
                    type="text"
                    className="form-field"
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                )}
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="form-label">Username</label>
              <Controller
                name="username"
                control={control}
                rules={{
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="username"
                    type="text"
                    className="form-field"
                    placeholder="johndoe"
                    autoComplete="username"
                  />
                )}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className="form-field"
                    placeholder="admin@doms.local"
                    autoComplete="email"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="password"
                    type="password"
                    className="form-field"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-busy={isSubmitting}
            >
              {isSubmitting && (
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden
                />
              )}
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { endpoints } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

const Login: React.FC = () => {
  const [email,setEmail]=useState('admin@doms.local'); const [password,setPassword]=useState('admin@123');
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [error,setError]=useState('');
  const submit = async (e:any) => {
    e.preventDefault();
    try {
      const r = await api.post(endpoints.auth.login, { email, password });
      const token = r.data.data.token; const user = r.data.data.user;
      setAuth(user, token);
      navigate('/dashboard');
    } catch (err:any) { setError(err?.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded mb-2" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded mb-4" />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary text-white rounded">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
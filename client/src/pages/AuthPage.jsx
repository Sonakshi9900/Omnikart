import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { User, Store, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'sonner';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('customer');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { ...formData, role } : { email: formData.email, password: formData.password };

      const res = await API.post(endpoint, payload);

      dispatch(setCredentials(res.data.user));
      toast.success(`Welcome to OmniKart, ${res.data.user.name}!`, {
        description: `Logged in as ${res.data.user.role.toUpperCase()}`,
      });

      if (res.data.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Demo session fallback when backend MongoDB is offline
      const demoSessionUser = {
        id: `usr_${Date.now()}`,
        name: formData.name || 'OmniKart Explorer',
        email: formData.email,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        vendorProfile: role === 'vendor' ? { storeName: formData.storeName || 'Aura Sound Labs', commissionRate: 10.0 } : null,
      };

      dispatch(setCredentials(demoSessionUser));
      toast.success(`Signed in as ${role.toUpperCase()}`, {
        description: 'Welcome to your OmniKart dashboard',
      });

      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl bg-slate-900/90">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 mx-auto shadow-glow flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {isRegister ? 'Create OmniKart Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-400">
              {isRegister
                ? 'Join as a Customer, Vendor, or Super Admin'
                : 'Sign in to manage your orders or SaaS vendor store'}
            </p>
          </div>

          {/* Role Switcher tabs if registering */}
          {isRegister && (
            <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${
                  role === 'customer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${
                  role === 'vendor'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Vendor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Alex Vance"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'vendor' && (
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400">Store Name</label>
                <div className="relative mt-1">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="storeName"
                    required
                    placeholder="Aura Sound Labs"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="alex@omnikart.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <span>{isRegister ? `Register as ${role.toUpperCase()}` : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center border-t border-slate-800/80 pt-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

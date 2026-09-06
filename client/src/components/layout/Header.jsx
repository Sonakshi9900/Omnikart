import React from 'react';
import { Search, ShoppingBag, Store, ShieldCheck, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotalCount, toggleCartSheet } from '../../store/cartSlice';
import { selectCurrentUser, logoutUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'sonner';
import logoImg from '../../assets/logoDataUrl';

export default function Header({ searchQuery, setSearchQuery }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartTotalCount);
  const user = useSelector(selectCurrentUser);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    dispatch(logoutUser());
    toast.info('Logged out from OmniKart');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass-header px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Official OmniKart Logo Image */}
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src={logoImg}
          alt="OmniKart Logo"
          className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
        />
      </Link>

      {/* Sticky Search Header */}
      <div className="flex-1 max-w-xl relative hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products across verified vendors..."
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-brand-blue-light animate-pulse"></span>
            <span className="text-slate-400">Role:</span>
            <span className="font-bold text-brand-blue-light uppercase tracking-wider">{user.role}</span>
          </div>
        )}

        {user?.role === 'vendor' && (
          <Link
            to="/vendor/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/40 text-brand-blue-light transition-all"
          >
            <Store className="w-4 h-4" />
            <span>Vendor SaaS</span>
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-orange/20 hover:bg-brand-orange/30 border border-brand-orange/40 text-brand-orange-light transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Command Center</span>
          </Link>
        )}

        {/* Cart Trigger */}
        <button
          onClick={() => dispatch(toggleCartSheet())}
          className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all"
          title="Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5 text-brand-orange-light" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-orange text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-glow">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Auth Menu */}
        {user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 pl-2">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-brand-blue-light object-cover"
              />
              <span className="text-xs font-semibold text-slate-200 hidden lg:inline">
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-light text-white font-semibold text-xs shadow-glow transition-all"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}

import React from 'react';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotalCount, toggleCartSheet } from '../../store/cartSlice';
import { selectCurrentUser } from '../../store/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function BottomNavBar({ onOpenCategories }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector(selectCartTotalCount);
  const user = useSelector(selectCurrentUser);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050811]/95 backdrop-blur-xl border-t border-slate-800/90 md:hidden pb-safe">
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-xs font-semibold transition-colors active:scale-95 ${
            isActive('/') ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        {/* Categories */}
        <button
          onClick={onOpenCategories || (() => navigate('/'))}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors active:scale-95"
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => dispatch(toggleCartSheet())}
          className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-indigo-400 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-indigo-600 text-white font-extrabold text-[9px] flex items-center justify-center border border-[#050811]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-slate-300">Cart</span>
        </button>

        {/* Profile / Account */}
        <Link
          to={user ? '/account' : '/auth'}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-xs font-semibold transition-colors active:scale-95 ${
            isActive('/account') || isActive('/auth') || isActive('/vendor/dashboard') || isActive('/admin/dashboard')
              ? 'text-teal-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {user ? (
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="w-5 h-5 rounded-full border border-teal-400 object-cover mb-0.5"
            />
          ) : (
            <User className="w-5 h-5 mb-0.5" />
          )}
          <span>{user ? 'Account' : 'Sign In'}</span>
        </Link>
      </div>
    </nav>
  );
}

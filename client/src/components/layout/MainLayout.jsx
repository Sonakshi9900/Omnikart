import React, { useState } from 'react';
import Navbar from './Navbar';
import BottomNavBar from './BottomNavBar';
import Footer from './Footer';
import CartDrawer from '../customer/CartDrawer';
import PageTransition from './PageTransition';
import logoImg from '../../assets/logoDataUrl';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotalCount, toggleCartSheet } from '../../store/cartSlice';
import { selectCurrentUser } from '../../store/authSlice';
import { Link } from 'react-router-dom';

export default function MainLayout({ children, searchQuery, setSearchQuery, onOpenCategories }) {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartTotalCount);
  const user = useSelector(selectCurrentUser);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0B1330] text-slate-100 flex flex-col font-sans text-sm overflow-x-hidden selection:bg-[#1D63E0] selection:text-white">
      {/* 1. Desktop Navbar (hidden on mobile, visible on md+) */}
      <div className="hidden md:block">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* 2. Mobile Native Header (visible on mobile, hidden on md+) */}
      <header className="block md:hidden sticky top-0 z-40 bg-[#0B1330]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logoImg}
              alt="OmniKart Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="relative flex items-center bg-[#101B3D] border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-[#1D63E0]">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products & vendors..."
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Cart Icon Trigger for Mobile Header */}
          <button
            onClick={() => dispatch(toggleCartSheet())}
            className="relative p-2 rounded-xl bg-[#101B3D] border border-slate-800 text-slate-300 active:scale-95 transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 text-[#1D63E0]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-gradient text-white font-bold text-[10px] flex items-center justify-center border border-[#0B1330]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 3. Main Content Wrapper constrained to max-w-7xl on desktop */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 flex-1 py-3 md:py-6 pb-20 md:pb-8">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Global Cart Drawer */}
      <CartDrawer />

      {/* 4. Mobile Bottom App Bar (visible on mobile only, fixed at bottom) */}
      <div className="block md:hidden">
        <BottomNavBar onOpenCategories={onOpenCategories} />
      </div>

      {/* Desktop Footer */}
      <Footer />
    </div>
  );
}

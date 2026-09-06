import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  ChevronDown,
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  Package,
  MapPin,
  Settings,
  CreditCard,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotalCount, toggleCartSheet } from '../../store/cartSlice';
import { selectCurrentUser, logoutUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { toast } from 'sonner';
import logoImg from '../../assets/omnikart-logo.jpg';

const MEGA_MENU_DATA = {
  Electronics: {
    categories: [
      { name: 'Audio & Headphones', items: ['Wireless Earbuds', 'Noise Canceling', 'Soundbars', 'Speakers'] },
      { name: 'Computers & Tech', items: ['Mechanical Keyboards', 'Gaming Mice', 'Monitors', 'USB Hubs'] },
      { name: 'Smart Wearables', items: ['Smartwatches', 'Fitness Bands', 'VR Headsets'] },
    ],
    featured: {
      title: 'Aura Pro Sound Series',
      subtitle: 'Up to 40% OFF on Noise Canceling Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    },
  },
  Fashion: {
    categories: [
      { name: 'Men’s Wear', items: ['Jackets & Coats', 'Casual Shirts', 'Denim & Jeans', 'Activewear'] },
      { name: 'Footwear', items: ['Sneakers', 'Running Shoes', 'Formal Shoes', 'Boots'] },
      { name: 'Accessories', items: ['Leather Backpacks', 'Watches', 'Sunglasses', 'Belts'] },
    ],
    featured: {
      title: 'Kinetix Velocity Edition',
      subtitle: 'New Arrival Carbon-Plate Running Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    },
  },
  'Home & Kitchen': {
    categories: [
      { name: 'Smart Home', items: ['Ambient Lighting', 'Smart Plugs', 'Security Cameras'] },
      { name: 'Decor & Furniture', items: ['Ergonomic Chairs', 'Desk Lamps', 'Wall Art'] },
    ],
    featured: {
      title: 'Zenith Smart Lighting',
      subtitle: 'Automated Circadian LED Desk Lamps',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    },
  },
};

export default function Navbar({ searchQuery, setSearchQuery }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartTotalCount);
  const user = useSelector(selectCurrentUser);

  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [wishlistCount] = useState(3);

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Mock logout
    }
    dispatch(logoutUser());
    toast.info('Logged out from OmniKart');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050811]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      {/* Top Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-6">
        {/* Official OmniKart Logo Image */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={logoImg}
            alt="OmniKart Logo"
            className="h-11 w-auto object-contain rounded-xl shadow-glow group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Center Prominent Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              placeholder="Search across 120+ verified vendors, brands, categories..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1">
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-4">
          {/* Wishlist Icon */}
          <button
            onClick={() => toast.info(`Wishlist has ${wishlistCount} saved items`)}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-slate-300 hover:text-rose-400 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#050811] shadow-glow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => dispatch(toggleCartSheet())}
            className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#050811] shadow-glow animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-indigo-500/50 object-cover"
                />
                <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-64 glass-panel bg-slate-900 border border-teal-500/20 rounded-2xl p-2 shadow-2xl z-50 space-y-1 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Logged in User Details Header */}
                  <div className="px-3 py-2 border-b border-slate-800 space-y-0.5">
                    <p className="font-bold font-heading text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-teal-950 border border-teal-500/30 text-teal-300 font-bold uppercase text-[9px]">
                      {user.role}
                    </span>
                  </div>

                  {/* Account Quick Links */}
                  <div className="py-1 space-y-0.5 border-b border-slate-800">
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Package className="w-4 h-4 text-teal-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account?tab=wishlist"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Wishlist</span>
                    </Link>

                    <Link
                      to="/account?tab=addresses"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>Saved Addresses</span>
                    </Link>

                    <Link
                      to="/account?tab=settings"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4 text-amber-400" />
                      <span>Account Settings</span>
                    </Link>

                    <Link
                      to="/account?tab=payments"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Payment Methods</span>
                    </Link>
                  </div>

                  {/* Vendor / Admin Specific Dashboards */}
                  {user.role === 'vendor' && (
                    <Link
                      to="/vendor/dashboard"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-teal-300 hover:bg-teal-950/40 font-semibold transition-colors"
                    >
                      <Store className="w-4 h-4 text-teal-400" />
                      <span>Vendor Dashboard</span>
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-purple-300 hover:bg-purple-950/40 font-semibold transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Admin Command Center</span>
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setShowAccountDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition-all"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Secondary Navigation Bar with Mega Menu */}
      <nav className="border-t border-slate-800/60 bg-slate-950/70 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-8 text-xs font-semibold text-slate-300 overflow-x-auto scrollbar-none py-2.5">
          {Object.keys(MEGA_MENU_DATA).map((catName) => (
            <div
              key={catName}
              onMouseEnter={() => setActiveMegaMenu(catName)}
              onMouseLeave={() => setActiveMegaMenu(null)}
              className="relative group cursor-pointer py-1 flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <span>{catName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:rotate-180 transition-transform" />

              {activeMegaMenu === catName && (
                <div className="absolute top-full left-0 mt-1 w-[680px] glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl z-50 grid grid-cols-3 gap-6 text-slate-200">
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    {MEGA_MENU_DATA[catName].categories.map((sub, idx) => (
                      <div key={idx} className="space-y-2">
                        <h5 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">
                          {sub.name}
                        </h5>
                        <ul className="space-y-1.5 text-slate-400">
                          {sub.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <a href="#" className="hover:text-white transition-colors block text-xs">
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-1 glass-panel bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                    <img
                      src={MEGA_MENU_DATA[catName].featured.image}
                      alt=""
                      className="w-full h-24 object-cover rounded-xl border border-slate-800"
                    />
                    <div>
                      <h6 className="font-bold text-white text-xs">
                        {MEGA_MENU_DATA[catName].featured.title}
                      </h6>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {MEGA_MENU_DATA[catName].featured.subtitle}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                      Shop Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <a href="#" className="hover:text-indigo-400 transition-colors">Top Verified Sellers</a>
          <a href="#" className="hover:text-indigo-400 transition-colors text-amber-400 flex items-center gap-1 font-bold">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Flash Deals</span>
          </a>
          <a href="/vendor/dashboard" className="hover:text-indigo-400 transition-colors text-indigo-400 font-semibold">
            Become a Seller
          </a>
        </div>
      </nav>
    </header>
  );
}

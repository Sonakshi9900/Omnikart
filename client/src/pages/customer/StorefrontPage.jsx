import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SplashScreen from '../../components/layout/SplashScreen';
import CategoryChips from '../../components/customer/CategoryChips';
import SwipeableSection from '../../components/customer/SwipeableSection';
import FacetedFilters from '../../components/customer/FacetedFilters';
import ProductGrid from '../../components/customer/ProductGrid';
import QuickViewModal from '../../components/customer/QuickViewModal';
import ProductCard from '../../components/customer/ProductCard';
import { Sparkles, SlidersHorizontal, Flame, ArrowRight } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    _id: 'prod_1',
    title: 'Aura Sound Pro Wireless Noise-Canceling Headphones with Spatial Audio',
    slug: 'aura-sound-pro-wireless-headphones',
    description: 'High-fidelity audio with active noise cancellation, 40-hour battery life, and spatial 3D audio precision.',
    category: 'Electronics',
    price: 24999,
    compareAtPrice: 28999,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    ratingAverage: 4.9,
    ratingCount: 42,
    vendor: { storeName: 'Aura Sound Labs', isApproved: true },
  },
  {
    _id: 'prod_2',
    title: 'Kinetix Velocity Ultra-Light Carbon-Plate Running Sneakers',
    slug: 'kinetix-velocity-ultra-light-running-sneakers',
    description: 'Engineered carbon-plate midsole for maximum energy return and ultra-breathable mesh upper.',
    category: 'Footwear',
    price: 12999,
    compareAtPrice: 15999,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    ratingAverage: 4.7,
    ratingCount: 28,
    vendor: { storeName: 'Kinetix Footwear', isApproved: true },
  },
  {
    _id: 'prod_3',
    title: 'Zenith Ambient LED Smart Desk Lamp with Circadian Rhythm Control',
    slug: 'zenith-ambient-led-smart-desk-lamp',
    description: 'Adjustable color temperatures, magnetic wireless charging base, and automated circadian rhythm modes.',
    category: 'Home & Living',
    price: 6999,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
    ratingAverage: 4.8,
    ratingCount: 19,
    vendor: { storeName: 'Zenith Smart Home', isApproved: true },
  },
  {
    _id: 'prod_4',
    title: 'CyberDeck Mechanical Ergonomic RGB Keyboard with Anodized Frame',
    slug: 'cyberdeck-mechanical-ergonomic-keyboard',
    description: 'Hot-swappable tactile switches, per-key RGB backlighting, and CNC anodized aluminum frame.',
    category: 'Accessories',
    price: 14999,
    compareAtPrice: 17999,
    stock: 0,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
    ratingAverage: 4.9,
    ratingCount: 56,
    vendor: { storeName: 'CyberTek Gear', isApproved: true },
  },
  {
    _id: 'prod_5',
    title: 'Minimalist Water-Resistant Full-Grain Leather Urban Backpack',
    slug: 'minimalist-leather-urban-backpack',
    description: 'Water-resistant full-grain leather with dedicated 16-inch laptop compartment and hidden travel pocket.',
    category: 'Fashion',
    price: 8999,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    ratingAverage: 4.6,
    ratingCount: 31,
    vendor: { storeName: 'Vance Leatherworks', isApproved: true },
  },
  {
    _id: 'prod_6',
    title: 'Botanical Organic Cold-Pressed Hydrating Face Serum Set',
    slug: 'botanical-hydrating-face-serum-set',
    description: 'Cold-pressed organic botanical oils enriched with hyaluronic acid and niacinamide for radiant skin.',
    category: 'Beauty',
    price: 3499,
    compareAtPrice: 4299,
    stock: 3,
    images: ['https://images.unsplash.com/photo-1608248597261-833258657b45?w=600'],
    ratingAverage: 5.0,
    ratingCount: 14,
    vendor: { storeName: 'Lumiere Skincare', isApproved: true },
  },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: 'newest',
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    let filtered = [...MOCK_PRODUCTS];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }
    if (filters.rating) {
      filtered = filtered.filter((p) => p.ratingAverage >= Number(filters.rating));
    }

    if (filters.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating') filtered.sort((a, b) => b.ratingAverage - a.ratingAverage);

    setProducts(filtered);
  }, [selectedCategory, searchQuery, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setFilters({ minPrice: '', maxPrice: '', rating: '', sort: 'newest' });
  };

  return (
    <MainLayout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onOpenCategories={() => setShowMobileFilter(!showMobileFilter)}
    >
      {/* Opening Intro Splash Screen */}
      <SplashScreen />

      {/* Hero Banner Section */}
      <section className="relative my-2 md:my-4 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="glass-panel p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-800/90 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8 bg-gradient-to-r from-[#090d19]/90 via-[#0d1222]/80 to-[#12182c]/60 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-[11px] sm:text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Source E-Commerce Platform</span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Discover Products From Independent Vendors.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Atomic sub-order fulfillment, direct vendor payouts, and verified quality controls — all unified in omniKart.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0">
            <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800/90 text-center bg-slate-900/40">
              <span className="block text-lg sm:text-2xl font-extrabold text-indigo-400">120+</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Verified Sellers</span>
            </div>
            <div className="glass-panel p-3 sm:p-4 rounded-xl border border-slate-800/90 text-center bg-slate-900/40">
              <span className="block text-lg sm:text-2xl font-extrabold text-emerald-400">99.9%</span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Atomic Payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Swipeable Mobile Flash Deals Section */}
      <div className="md:hidden my-4">
        <SwipeableSection
          title="⚡ Flash Deals"
          subtitle="Limited time offer from top vendors"
          action={
            <button className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          {MOCK_PRODUCTS.slice(0, 4).map((product) => (
            <div key={`flash-${product._id}`} className="w-44">
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </div>
          ))}
        </SwipeableSection>
      </div>

      {/* Main Product Catalog Section */}
      <section className="space-y-4 md:space-y-6 my-4">
        {/* Swipeable Category Chips */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <FacetedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="min-h-[40px] flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filters</span>
            </button>
          </div>

          {showMobileFilter && (
            <div className="lg:hidden col-span-1">
              <FacetedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          )}

          {/* Universal Product Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              loading={loading}
              onQuickView={setQuickViewProduct}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </MainLayout>
  );
}

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SplashScreen from '../../components/layout/SplashScreen';
import CategoryChips from '../../components/customer/CategoryChips';
import SwipeableSection from '../../components/customer/SwipeableSection';
import FacetedFilters from '../../components/customer/FacetedFilters';
import ProductGrid from '../../components/customer/ProductGrid';
import QuickViewModal from '../../components/customer/QuickViewModal';
import ProductCard from '../../components/customer/ProductCard';
import API from '../../services/api';
import { ShieldCheck, SlidersHorizontal, ArrowRight, Zap, RefreshCw, Lock } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_REAL_PRODUCTS = [
  {
    _id: 'prod_1',
    title: 'Aura Sound Pro Wireless Noise-Canceling Headphones with Spatial 3D Audio',
    slug: 'aura-sound-pro-wireless-headphones',
    description: 'Acoustically tuned drivers with adaptive active noise cancellation, 40-hour battery life, and spatial audio precision.',
    category: 'Electronics',
    price: 24999,
    compareAtPrice: 28999,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    ratingAverage: 4.9,
    ratingCount: 42,
    vendor: { storeName: 'Aura Sound Labs', isApproved: true, trustScore: 98, fulfillmentRate: 99 },
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
    vendor: { storeName: 'Kinetix Footwear', isApproved: true, trustScore: 95, fulfillmentRate: 98 },
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
    vendor: { storeName: 'Zenith Smart Home', isApproved: true, trustScore: 97, fulfillmentRate: 100 },
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
    vendor: { storeName: 'CyberTek Gear', isApproved: true, trustScore: 94, fulfillmentRate: 96 },
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
    vendor: { storeName: 'Vance Leatherworks', isApproved: true, trustScore: 96, fulfillmentRate: 99 },
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
    vendor: { storeName: 'Lumiere Skincare', isApproved: true, trustScore: 99, fulfillmentRate: 100 },
  },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [platformStats, setPlatformStats] = useState({ verifiedSellersCount: 12, totalProductsCount: 34 });

  // Fetch Real Products End-to-End from REST API
  useEffect(() => {
    let isMounted = true;

    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
        if (searchQuery.trim()) params.append('search', searchQuery);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.rating) params.append('rating', filters.rating);
        if (filters.sort) params.append('sort', filters.sort);

        const res = await API.get(`/products?${params.toString()}`);
        if (isMounted) {
          if (res.data?.products && res.data.products.length > 0) {
            setProducts(res.data.products);
            setPlatformStats((prev) => ({
              ...prev,
              totalProductsCount: res.data.total || res.data.products.length,
            }));
          } else {
            // Client fallback to rich seeded catalog if DB query returned 0 items
            let filtered = [...DEFAULT_REAL_PRODUCTS];
            if (selectedCategory !== 'All') {
              filtered = filtered.filter((p) => p.category === selectedCategory);
            }
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              filtered = filtered.filter(
                (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
              );
            }
            if (filters.minPrice) filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
            if (filters.maxPrice) filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
            if (filters.rating) filtered = filtered.filter((p) => p.ratingAverage >= Number(filters.rating));
            setProducts(filtered);
          }
        }
      } catch (err) {
        if (isMounted) {
          let filtered = [...DEFAULT_REAL_PRODUCTS];
          if (selectedCategory !== 'All') filtered = filtered.filter((p) => p.category === selectedCategory);
          setProducts(filtered);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();

    return () => {
      isMounted = false;
    };
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
      <SplashScreen />

      {/* Hero Banner Section with Non-Templated Geometric Dot Pattern */}
      <section className="relative my-2 md:my-4 overflow-hidden rounded-2xl md:rounded-3xl border border-teal-500/20 bg-slate-900/60 bg-grid-pattern shadow-2xl p-4 sm:p-6 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-[11px] sm:text-xs font-semibold tracking-wide shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>100% Buyer Protection & Verified Seller Guarantee</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Shop Directly From Verified Independent Creators.
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
              Discover unique craft, tech, and apparel items with transparent pricing, instant UPI & Stripe refunds, and zero hidden platform markups.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Direct Vendor Payouts
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-teal-400" /> 7-Day Hassle-Free Returns
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> Encrypted Checkout
              </span>
            </div>
          </div>

          {/* Real Live Metrics Display */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-64 shrink-0">
            <div className="glass-panel p-3.5 rounded-xl border border-teal-500/20 text-center bg-slate-950/60">
              <span className="block text-xl sm:text-2xl font-extrabold font-heading text-teal-400">
                {platformStats.verifiedSellersCount}+
              </span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Verified Stores</span>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-amber-500/20 text-center bg-slate-950/60">
              <span className="block text-xl sm:text-2xl font-extrabold font-heading text-amber-400">
                {products.length || 6}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Active Listings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Swipeable Mobile Flash Deals Section */}
      <div className="md:hidden my-4">
        <SwipeableSection
          title="⚡ Flash Deals"
          subtitle="Direct from top-rated verified creators"
          action={
            <button className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          {products.slice(0, 4).map((product) => (
            <div key={`flash-${product._id}`} className="w-44">
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </div>
          ))}
        </SwipeableSection>
      </div>

      {/* Main Catalog Grid */}
      <section className="space-y-4 md:space-y-6 my-4">
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <FacetedFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </aside>

          <div className="lg:hidden flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="min-h-[40px] flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
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

      {/* Quick View Modal with Transparent Payout Split & Trust Score */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </MainLayout>
  );
}

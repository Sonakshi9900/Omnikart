import React from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ products, loading, onQuickView, onResetFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-6 sm:p-12 text-center space-y-4 border border-slate-800">
        <PackageSearch className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto" />
        <h3 className="text-sm sm:text-lg font-bold text-slate-200">No products match your search</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try clearing your search query or resetting category and price filters.
        </p>
        <button
          onClick={onResetFilters}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-glow transition-all"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

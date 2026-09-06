import React from 'react';
import { Filter, Star, ArrowUpDown, RefreshCw } from 'lucide-react';

export default function FacetedFilters({
  filters,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <div className="glass-panel p-5 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm tracking-wide">
          <Filter className="w-4 h-4" />
          <span>Faceted Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sort By</span>
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((stars) => {
            const isSelected = Number(filters.rating) === stars;
            return (
              <button
                key={stars}
                onClick={() => onFilterChange('rating', isSelected ? '' : stars)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-medium'
                    : 'bg-slate-900/40 text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="ml-1.5">& Up</span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

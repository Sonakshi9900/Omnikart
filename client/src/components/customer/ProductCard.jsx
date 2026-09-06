import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Eye, Star, Store, ShieldCheck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { formatINR } from '../../utils/currency';
import { toast } from 'sonner';

export default function ProductCard({ product, onQuickView }) {
  const dispatch = useDispatch();

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  // Calculate discount percentage if compareAtPrice exists
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added to cart`, {
      description: `${product.title} (Sold by ${product.vendor?.storeName || 'Verified Vendor'})`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="glass-panel glass-card-hover rounded-2xl md:rounded-3xl p-2.5 sm:p-4 border border-slate-800/80 bg-slate-900/50 flex flex-col justify-between group shadow-lg hover:border-indigo-500/40 relative overflow-hidden"
    >
      <div className="space-y-2 sm:space-y-3">
        {/* Strict aspect-[4/5] object-cover Image Container across device sizes */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-2xl bg-slate-950/60 border border-slate-800/60">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

          {/* Glass Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discountPercent && (
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full backdrop-blur-md">
                {discountPercent}% OFF
              </span>
            )}
            {isOutOfStock ? (
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full backdrop-blur-md">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full backdrop-blur-md">
                Only {product.stock} Left
              </span>
            ) : null}
          </div>

          {/* Quick View Button (Desktop Hover) */}
          <button
            onClick={() => onQuickView && onQuickView(product)}
            className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-xl bg-slate-950/70 text-slate-300 hover:text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-slate-700/50 hidden sm:flex"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-1 sm:space-y-1.5">
          {/* Vendor Name */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
            <Store className="w-3 h-3 shrink-0" />
            <span className="truncate">{product.vendor?.storeName || 'OmniVendor'}</span>
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" title="Verified Seller" />
          </div>

          {/* Title: 1-line truncation on mobile (`line-clamp-1`), 2-line on desktop (`md:line-clamp-2`) */}
          <h3 className="font-bold text-slate-100 text-xs sm:text-sm line-clamp-1 md:line-clamp-2 group-hover:text-indigo-300 transition-colors tracking-tight leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-300 pt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold">{product.ratingAverage || 4.8}</span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">({product.ratingCount || 12})</span>
          </div>
        </div>
      </div>

      {/* Footer Price & Add To Cart Button */}
      <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-slate-800/80 mt-2">
        <div className="min-w-0 flex-1 pr-1">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Price</span>
          <div className="flex items-baseline gap-1 sm:gap-1.5 truncate">
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-white tracking-tight">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through truncate hidden xs:inline">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile-First Action Buttons:
            - Mobile: Compact circular '+' button to save space
            - Desktop: Full "Add" button with icon & text
        */}
        <div className="shrink-0">
          {/* Mobile '+' Icon Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Add to cart"
            className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all min-h-[32px] min-w-[32px] ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 active:scale-90 text-white shadow-glow'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Desktop Full Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

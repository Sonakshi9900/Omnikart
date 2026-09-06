import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Store, ShieldCheck, CheckCircle2, Truck, PieChart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { formatINR } from '../../utils/currency';
import { toast } from 'sonner';

export default function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const trustScore = product.vendor?.trustScore || 98;
  const vendorPayoutAmount = Math.round(product.price * 0.85);
  const platformFeeAmount = product.price - vendorPayoutAmount;

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity}x "${product.title}" to cart`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B1330]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl glass-panel bg-surface/95 border border-brand-blue/30 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-card/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery & Trust Score Badge */}
          <div className="p-6 bg-card/40 flex flex-col justify-between space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-background relative">
              <img
                src={product.images[selectedImg] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Dynamic Vendor Trust Badge with Blue-to-Orange Gradient */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 border border-brand-blue/40 backdrop-blur-md text-[11px] font-bold text-white shadow-glow">
                <ShieldCheck className="w-4 h-4 text-brand-orange-light" />
                <span>{trustScore}% Seller Trust Score</span>
              </div>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === idx ? 'border-brand-blue scale-105' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Differentiating Feature: Transparent Payout Breakdown Box */}
            <div className="p-3.5 rounded-2xl bg-brand-blue-dark/20 border border-brand-blue/30 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-brand-blue-light text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-brand-orange-light" />
                  Transparent Payment Split
                </span>
                <span className="text-[10px] text-slate-400">Direct Payout</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">85% to Verified Seller:</span>
                  <span className="font-semibold text-brand-orange-light">{formatINR(vendorPayoutAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">15% Security & Infra Fee:</span>
                  <span className="font-semibold text-brand-blue-light">{formatINR(platformFeeAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue-light">
                <Store className="w-4 h-4" />
                <span>{product.vendor?.storeName || 'OmniVendor Store'}</span>
                <ShieldCheck className="w-4 h-4 text-brand-orange-light" title="Verified Seller" />
              </div>

              <h2 className="text-xl font-bold font-heading text-slate-100">{product.title}</h2>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-brand-orange-light text-brand-orange-light" />
                  <span className="font-bold text-slate-200">{product.ratingAverage || 4.8}</span>
                  <span className="text-slate-400">({product.ratingCount || 12} reviews)</span>
                </div>
                <span className="text-slate-700">•</span>
                <span className="text-brand-orange-light flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue-light" />
                  {product.stock > 0 ? `${product.stock} in stock` : 'Backorder Available'}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-h-28 overflow-y-auto pr-2">
                {product.description}
              </p>

              <div className="p-3 rounded-xl bg-card border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Truck className="w-4 h-4 text-brand-blue-light" />
                  <span>Free Express All-India Shipping</span>
                </div>
                <p className="pl-6">Dispatched by seller within 24h with real-time tracking.</p>
              </div>
            </div>

            {/* Price & Primary CTA Blue-to-Orange Gradient Button */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold font-heading text-white">{formatINR(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-800 rounded-xl bg-card overflow-hidden min-h-[44px]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold min-h-[44px] min-w-[36px]"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold min-h-[44px] min-w-[36px]"
                  >
                    +
                  </button>
                </div>

                {/* Primary CTA: Blue-to-Orange Wheel Gradient */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold shadow-glow active:scale-95 transition-all min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

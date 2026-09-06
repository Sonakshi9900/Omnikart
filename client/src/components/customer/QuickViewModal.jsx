import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Store, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { formatINR } from '../../utils/currency';
import { toast } from 'sonner';

export default function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Gallery */}
          <div className="p-6 bg-slate-950/50 flex flex-col justify-between">
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 relative">
              <img
                src={product.images[selectedImg] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === idx ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Store className="w-4 h-4" />
                <span>{product.vendor?.storeName || 'OmniVendor Store'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" title="Verified Seller" />
              </div>

              <h2 className="text-xl font-bold text-slate-100">{product.title}</h2>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-200">{product.ratingAverage || 4.8}</span>
                  <span className="text-slate-500">({product.ratingCount || 12} reviews)</span>
                </div>
                <span className="text-slate-700">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {product.stock} items available
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed max-h-32 overflow-y-auto pr-2">
                {product.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Truck className="w-4 h-4 text-indigo-400" />
                  <span>Free Express Shipping across India</span>
                </div>
                <p className="pl-6">Dispatched directly by verified vendor within 24 hours.</p>
              </div>
            </div>

            {/* Price formatted in INR */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-white">{formatINR(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-glow transition-all"
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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Store, Lock, Truck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalPrice,
  toggleCartSheet,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../../store/cartSlice';
import { formatINR } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((state) => state.cart.isCartOpen);
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);

  if (!isOpen) return null;

  // Group items by Vendor
  const itemsByVendor = items.reduce((acc, item) => {
    const vendorName = item.product.vendor?.storeName || 'OmniKart Vendor';
    if (!acc[vendorName]) acc[vendorName] = [];
    acc[vendorName].push(item);
    return acc;
  }, {});

  const handleCheckout = () => {
    dispatch(toggleCartSheet(false));
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Dark Transparent Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(toggleCartSheet(false))}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        />

        {/* Responsive Sliding Drawer: 100% width on mobile, 400px on desktop */}
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full sm:w-[400px] glass-panel bg-slate-900/95 border-l border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-blue/20 border border-brand-blue/30 text-brand-blue-light">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-100">Shopping Cart</h2>
                  <p className="text-xs text-slate-400">
                    {items.length} unique item{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xs text-slate-400 hover:text-rose-400 active:scale-95 transition-colors pr-2 font-medium"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => dispatch(toggleCartSheet(false))}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List Grouped by Vendor */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                  <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700 text-slate-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-semibold text-slate-200 text-base">Your cart is empty</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Explore products from independent verified sellers on omniKart.
                  </p>
                </div>
              ) : (
                Object.entries(itemsByVendor).map(([vendorName, vendorItems]) => (
                  <div key={vendorName} className="space-y-3 bg-slate-950/50 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue-light border-b border-slate-800 pb-2">
                      <Store className="w-3.5 h-3.5" />
                      <span>{vendorName}</span>
                    </div>

                    <div className="space-y-3">
                      {vendorItems.map(({ product, quantity }) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-3 bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800/60"
                        >
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150'}
                            alt={product.title}
                            className="w-14 h-14 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-200 truncate">
                              {product.title}
                            </h4>
                            <p className="text-xs text-brand-orange-light font-extrabold mt-0.5">
                              {formatINR(product.price)}
                            </p>

                            {/* Quantity Controls with Touch Target Sizes */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950 overflow-hidden text-xs">
                                <button
                                  onClick={() =>
                                    dispatch(updateQuantity({ productId: product._id, quantity: quantity - 1 }))
                                  }
                                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 font-bold active:scale-95"
                                >
                                  -
                                </button>
                                <span className="px-2.5 text-slate-200 font-bold">{quantity}</span>
                                <button
                                  onClick={() =>
                                    dispatch(updateQuantity({ productId: product._id, quantity: quantity + 1 }))
                                  }
                                  className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 font-bold active:scale-95"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => dispatch(removeFromCart(product._id))}
                                className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-500 hover:text-rose-400 active:scale-95 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Bottom Footer Checkout CTA */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">{formatINR(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Shipping Fee</span>
                    <span className="text-brand-blue-light font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Free Express Delivery
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-extrabold text-white">
                    <span>Total Amount</span>
                    <span className="text-brand-orange font-extrabold text-base">{formatINR(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-gradient hover:opacity-90 active:scale-[0.98] text-white font-bold text-sm shadow-glow transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

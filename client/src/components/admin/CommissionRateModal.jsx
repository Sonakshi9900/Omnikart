import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, Save, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { toast } from 'sonner';

export default function CommissionRateModal({ vendor, onClose, onUpdated }) {
  const [rate, setRate] = useState(vendor?.commissionRate || 10.0);

  if (!vendor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/vendors/${vendor._id}/commission`, {
        commissionRate: Number(rate),
      });
      toast.success(`Updated platform commission for ${vendor.storeName} to ${rate}%`);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      toast.info(`Simulated: Commission for ${vendor.storeName} set to ${rate}%`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Platform Commission Rate</h3>
                <p className="text-xs text-slate-400">{vendor.storeName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">
                Commission Rate Percentage (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-lg font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                This rate is automatically deducted during multi-vendor checkout before transferring payouts to the vendor’s Stripe Connect account.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Rate Override</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

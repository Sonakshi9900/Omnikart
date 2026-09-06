import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import RevenueChart from '../../components/vendor/RevenueChart';
import ProductFormModal from '../../components/vendor/ProductFormModal';
import OrderFulfillmentTable from '../../components/vendor/OrderFulfillmentTable';
import { DollarSign, ShoppingBag, Package, AlertTriangle, Plus, Store, CheckCircle2, ShieldAlert } from 'lucide-react';
import API from '../../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';

export default function VendorDashboardPage() {
  const user = useSelector(selectCurrentUser);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 14850.0,
    totalOrders: 84,
    totalProducts: 12,
    lowStockAlerts: [
      { _id: 'p1', title: 'Kinetix Velocity Sneakers', stock: 4 },
      { _id: 'p2', title: 'Botanical Hydrating Face Serum', stock: 3 },
    ],
  });
  const [showProductModal, setShowProductModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Vendor Profile & Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                  {user?.vendorProfile?.storeName || 'Aura Sound Labs Store'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                  Verified Vendor
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Platform Commission Rate: <span className="text-indigo-400 font-semibold">{user?.vendorProfile?.commissionRate || 10.0}%</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Payout Revenue</span>
              <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">After 10% platform fee</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Orders</span>
              <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{analytics.totalOrders}</div>
            <span className="text-[11px] text-indigo-400 font-medium">Sub-orders dispatched</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Catalog</span>
              <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{analytics.totalProducts} Items</div>
            <span className="text-[11px] text-slate-400">Live on storefront</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Low Stock Warning</span>
              <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-400">
              {analytics.lowStockAlerts.length} Products
            </div>
            <span className="text-[11px] text-amber-400 font-medium">Stock &lt; 5 units</span>
          </div>
        </div>

        {/* Low Stock Alerts Banner */}
        {analytics.lowStockAlerts.length > 0 && (
          <div className="glass-panel p-4 rounded-2xl border border-amber-900/60 bg-amber-950/20 flex items-center gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-amber-300">Inventory Alert: </span>
              <span className="text-slate-300">
                {analytics.lowStockAlerts.map((p) => `${p.title} (${p.stock} left)`).join(', ')}
              </span>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold"
            >
              Restock Now
            </button>
          </div>
        )}

        {/* Interactive Revenue Chart */}
        <RevenueChart />

        {/* Order Fulfillment Queue */}
        <OrderFulfillmentTable />
      </main>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
      />
    </div>
  );
}

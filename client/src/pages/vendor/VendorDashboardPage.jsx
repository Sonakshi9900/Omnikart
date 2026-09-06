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
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue-light">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                  {user?.vendorProfile?.storeName || 'Aura Sound Labs Store'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue-light border border-brand-blue/40 text-[10px] font-bold uppercase">
                  Verified Vendor
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Platform Commission Rate: <span className="text-brand-orange-light font-semibold">{user?.vendorProfile?.commissionRate || 10.0}%</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProductModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-light text-white font-semibold text-xs shadow-glow transition-all"
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
              <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-blue-light">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-brand-blue-light font-medium">After 10% platform fee</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Orders</span>
              <div className="p-2 rounded-xl bg-brand-orange/20 text-brand-orange-light">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{analytics.totalOrders}</div>
            <span className="text-[11px] text-brand-blue-light font-medium">Sub-orders dispatched</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Catalog</span>
              <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-blue-light">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{analytics.totalProducts} Items</div>
            <span className="text-[11px] text-slate-400">Live on storefront</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Low Stock Warning</span>
              <div className="p-2 rounded-xl bg-brand-orange/20 text-brand-orange-light">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-brand-orange-light">
              {analytics.lowStockAlerts.length} Products
            </div>
            <span className="text-[11px] text-brand-orange font-medium">Stock &lt; 5 units</span>
          </div>
        </div>

        {/* Low Stock Alerts Banner */}
        {analytics.lowStockAlerts.length > 0 && (
          <div className="glass-panel p-4 rounded-2xl border border-brand-orange/40 bg-brand-orange/10 flex items-center gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 text-brand-orange-light shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-brand-orange-light">Inventory Alert: </span>
              <span className="text-slate-300">
                {analytics.lowStockAlerts.map((p) => `${p.title} (${p.stock} left)`).join(', ')}
              </span>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-3 py-1.5 rounded-lg bg-brand-orange/20 text-brand-orange-light border border-brand-orange/40 text-[11px] font-bold"
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

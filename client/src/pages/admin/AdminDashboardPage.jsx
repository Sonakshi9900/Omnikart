import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import VendorApprovalTable from '../../components/admin/VendorApprovalTable';
import CommissionRateModal from '../../components/admin/CommissionRateModal';
import { ShieldCheck, DollarSign, Store, Users, TrendingUp, AlertCircle, Percent } from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedVendorForCommission, setSelectedVendorForCommission] = useState(null);

  const stats = {
    totalGrossRevenue: 142800.0,
    totalCommissionEarnings: 14280.0,
    totalActiveVendors: 48,
    pendingVendorApprovals: 3,
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Admin Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-900/40 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Super Admin Command Center</h1>
              <p className="text-xs text-slate-400">
                Platform-wide governance, vendor auditing, commission rates, and audit trails
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800 text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Super Admin Access</span>
          </div>
        </div>

        {/* Global Platform Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Platform Gross Volume</span>
              <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              ${stats.totalGrossRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">All Multi-Vendor Checkout Volume</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Platform Commission Cut</span>
              <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-purple-400">
              ${stats.totalCommissionEarnings.toLocaleString()}
            </div>
            <span className="text-[11px] text-purple-300 font-medium">Platform Net Margin (10% avg)</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Vendor Stores</span>
              <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{stats.totalActiveVendors}</div>
            <span className="text-[11px] text-slate-400">Approved sellers</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending Vendor Approval</span>
              <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-400">
              {stats.pendingVendorApprovals} Applicants
            </div>
            <span className="text-[11px] text-amber-400 font-medium">Requires Admin Review</span>
          </div>
        </div>

        {/* Vendor Approval & Commission Management Table */}
        <VendorApprovalTable
          onEditCommission={(vendor) => setSelectedVendorForCommission(vendor)}
        />
      </main>

      {/* Commission Modal */}
      {selectedVendorForCommission && (
        <CommissionRateModal
          vendor={selectedVendorForCommission}
          onClose={() => setSelectedVendorForCommission(null)}
        />
      )}
    </div>
  );
}

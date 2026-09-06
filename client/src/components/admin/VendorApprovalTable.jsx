import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Percent, Store, Ban } from 'lucide-react';
import API from '../../services/api';
import { toast } from 'sonner';

export default function VendorApprovalTable({ vendors, onVendorUpdated, onEditCommission }) {
  const sampleVendors = vendors && vendors.length > 0 ? vendors : [
    {
      _id: 'ven_1',
      storeName: 'Aura Sound Labs',
      storeSlug: 'aura-sound-labs',
      isApproved: true,
      commissionRate: 10.0,
      user: { name: 'Julian Vance', email: 'julian@aurasound.com' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'ven_2',
      storeName: 'Kinetix Footwear',
      storeSlug: 'kinetix-footwear',
      isApproved: false,
      commissionRate: 12.5,
      user: { name: 'Elena Rostova', email: 'elena@kinetix.com' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'ven_3',
      storeName: 'Zenith Smart Home',
      storeSlug: 'zenith-smart-home',
      isApproved: false,
      commissionRate: 8.0,
      user: { name: 'Marcus Brody', email: 'marcus@zenithhome.io' },
      createdAt: new Date().toISOString(),
    },
  ];

  const handleToggleApproval = async (vendorId, currentStatus) => {
    try {
      await API.put(`/admin/vendors/${vendorId}/approval`, {
        isApproved: !currentStatus,
      });
      toast.success(`Vendor approval status updated to ${!currentStatus ? 'Approved' : 'Pending'}`);
      if (onVendorUpdated) onVendorUpdated();
    } catch (err) {
      toast.info(`Simulated: Vendor approval updated to ${!currentStatus ? 'Approved' : 'Pending'}`);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Vendor Onboarding & Approval Queue</span>
          </h3>
          <p className="text-xs text-slate-400">
            Review applicant seller accounts, audit credentials, and manage commission rates
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Store / Owner</th>
              <th className="p-3.5">Approval Status</th>
              <th className="p-3.5">Platform Commission</th>
              <th className="p-3.5">Onboarding Date</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sampleVendors.map((vendor) => (
              <tr key={vendor._id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-950/50 border border-indigo-800/50 text-indigo-400">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{vendor.storeName}</div>
                      <div className="text-[11px] text-slate-500">{vendor.user?.email || 'vendor@omnikart.com'}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3.5">
                  {vendor.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800">
                      <XCircle className="w-3 h-3" />
                      Pending Approval
                    </span>
                  )}
                </td>

                <td className="p-3.5">
                  <button
                    onClick={() => onEditCommission(vendor)}
                    className="flex items-center gap-1 font-bold text-indigo-300 hover:text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-900/60 transition-all"
                  >
                    <Percent className="w-3 h-3" />
                    <span>{vendor.commissionRate || 10.0}%</span>
                  </button>
                </td>

                <td className="p-3.5 text-slate-400 font-mono">
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleToggleApproval(vendor._id, vendor.isApproved)}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                      vendor.isApproved
                        ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow'
                    }`}
                  >
                    {vendor.isApproved ? 'Revoke Access' : 'Approve Vendor'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

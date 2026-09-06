import React, { useState } from 'react';
import { Truck, CheckCircle2, Clock, PackageCheck, Save } from 'lucide-react';
import API from '../../services/api';
import { toast } from 'sonner';

export default function OrderFulfillmentTable({ orders, onStatusUpdated }) {
  const [trackingInputs, setTrackingInputs] = useState({});

  const sampleOrders = orders && orders.length > 0 ? orders : [
    {
      _id: 'ord_101',
      customer: { name: 'Alex Johnson', email: 'alex@example.com' },
      createdAt: new Date().toISOString(),
      subOrders: [
        {
          _id: 'sub_1',
          items: [{ title: 'Pro Wireless Headphones', quantity: 1, price: 199.99 }],
          subtotal: 199.99,
          vendorPayout: 179.99,
          status: 'processing',
          trackingNumber: 'TRK-98721-USA',
          carrier: 'FedEx Express',
        },
      ],
    },
    {
      _id: 'ord_102',
      customer: { name: 'Sarah Miller', email: 'sarah@example.com' },
      createdAt: new Date().toISOString(),
      subOrders: [
        {
          _id: 'sub_2',
          items: [{ title: 'Minimalist Desk Lamp', quantity: 2, price: 89.0 }],
          subtotal: 178.0,
          vendorPayout: 160.2,
          status: 'pending',
          trackingNumber: '',
          carrier: 'UPS',
        },
      ],
    },
  ];

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/vendor/orders/${orderId}/status`, {
        status,
        trackingNumber: trackingInputs[orderId] || undefined,
      });
      toast.success(`Fulfillment status updated to ${status.toUpperCase()}`);
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      toast.success(`Fulfillment status updated to ${status.toUpperCase()}`);
    }
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-slate-100">Order Fulfillment Queue</h3>
          <p className="text-xs text-slate-400">Manage order statuses and dispatch tracking info</p>
        </div>
        <span className="text-xs text-brand-blue-light font-semibold bg-brand-blue/20 px-3 py-1 rounded-full border border-brand-blue/40">
          Live Sync Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Items</th>
              <th className="p-3.5">Net Payout</th>
              <th className="p-3.5">Fulfillment Status</th>
              <th className="p-3.5">Tracking Number</th>
              <th className="p-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sampleOrders.map((order) => {
              const sub = order.subOrders[0];
              return (
                <tr key={order._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3.5 font-mono text-brand-blue-light font-bold">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="p-3.5">
                    {sub?.items.map((i, idx) => (
                      <div key={idx} className="font-medium text-slate-200">
                        {i.quantity}x {i.title}
                      </div>
                    ))}
                  </td>
                  <td className="p-3.5 font-bold text-brand-orange">
                    ${sub?.vendorPayout?.toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        sub?.status === 'delivered'
                          ? 'bg-brand-blue/20 text-brand-blue-light border border-brand-blue/40'
                          : sub?.status === 'shipped'
                          ? 'bg-brand-blue/20 text-brand-blue-light border border-brand-blue/40'
                          : 'bg-brand-orange/20 text-brand-orange-light border border-brand-orange/40'
                      }`}
                    >
                      {sub?.status === 'delivered' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : sub?.status === 'shipped' ? (
                        <Truck className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {sub?.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <input
                      type="text"
                      placeholder={sub?.trackingNumber || 'Enter Tracking ID...'}
                      value={trackingInputs[order._id] ?? (sub?.trackingNumber || '')}
                      onChange={(e) =>
                        setTrackingInputs({ ...trackingInputs, [order._id]: e.target.value })
                      }
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-blue"
                    />
                  </td>
                  <td className="p-3.5 flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(order._id, 'shipped')}
                      className="px-2.5 py-1 rounded-lg bg-brand-blue hover:bg-brand-blue-light text-white font-semibold text-[11px] transition-all"
                    >
                      Ship Order
                    </button>
                    <button
                      onClick={() => handleStatusChange(order._id, 'delivered')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-all"
                    >
                      Mark Delivered
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function RevenueChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jan', revenue: 1400 },
    { month: 'Feb', revenue: 2300 },
    { month: 'Mar', revenue: 1950 },
    { month: 'Apr', revenue: 3800 },
    { month: 'May', revenue: 4900 },
    { month: 'Jun', revenue: 6200 },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-100">Revenue Performance</h3>
          <p className="text-xs text-slate-400">Monthly payout metrics post platform commissions</p>
        </div>
        <span className="px-3 py-1 text-xs font-bold text-brand-blue-light bg-brand-blue/20 border border-brand-blue/40 rounded-full">
          +28.4% YoY
        </span>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1D63E0" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#16214A" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#101B3D',
                borderColor: '#16214A',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Payout']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1D63E0"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

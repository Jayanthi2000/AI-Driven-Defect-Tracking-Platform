// TrendChart.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>)}
    </div>
  );
};

const TrendChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="trendFixed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
        </linearGradient>
        <linearGradient id="trendActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
        </linearGradient>
      </defs>
      <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="fixed"  stroke="#10b981" fill="url(#trendFixed)"  strokeWidth={2} name="Fixed"  />
      <Area type="monotone" dataKey="active" stroke="#3b82f6" fill="url(#trendActive)" strokeWidth={2} name="Active" />
    </AreaChart>
  </ResponsiveContainer>
);

export default TrendChart;

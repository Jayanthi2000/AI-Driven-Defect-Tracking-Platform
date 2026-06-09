// StatusChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.payload.fill }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const StatusChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
        {data.map((entry, i) => <Cell key={i} fill={entry.fill || '#6366f1'} />)}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
);

export default StatusChart;

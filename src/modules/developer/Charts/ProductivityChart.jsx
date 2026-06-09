// ProductivityChart.jsx
import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>)}
    </div>
  );
};

const ProductivityChart = ({ stats = {} }) => {
  const data = [
    { subject: 'Assigned', value: stats.assigned    || 0 },
    { subject: 'Progress', value: stats.inProgress  || 0 },
    { subject: 'Fixed',    value: stats.fixed        || 0 },
    { subject: 'Testing',  value: stats.readyForTesting || 0 },
    { subject: 'Done',     value: stats.completed   || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
        <Radar name="Bugs" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ProductivityChart;

// SeverityChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.fill }} className="font-medium">{p.name}: {p.value}</p>)}
    </div>
  );
};

const COLORS = { MINOR: '#22c55e', MAJOR: '#f97316', CRITICAL: '#ef4444', BLOCKER: '#dc2626' };

const SeverityChart = ({ bugs = [] }) => {
  const data = ['MINOR', 'MAJOR', 'CRITICAL', 'BLOCKER'].map(sev => ({
    name: sev,
    value: bugs.filter(b => b.severity === sev).length,
    fill: COLORS[sev],
  })).filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={20}>
        <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Bugs">
          {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SeverityChart;

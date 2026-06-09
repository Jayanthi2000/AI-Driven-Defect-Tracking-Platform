import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { getStore, analyticsData } from '../../data/store';

const S = {
  card: { background: 'rgba(10,15,28,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 },
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: '#475569', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ fontSize: 13, color: p.color, display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const PIE_COLORS = ['#f87171','#fbbf24','#60a5fa','#34d399'];
const severityData = [
  { name: 'Critical', value: 2 },
  { name: 'High', value: 3 },
  { name: 'Medium', value: 2 },
  { name: 'Low', value: 1 },
];

const resolutionData = [
  { day: 'Mon', resolved: 4, opened: 3 },
  { day: 'Tue', resolved: 6, opened: 5 },
  { day: 'Wed', resolved: 3, opened: 7 },
  { day: 'Thu', resolved: 8, opened: 4 },
  { day: 'Fri', resolved: 5, opened: 2 },
  { day: 'Sat', resolved: 2, opened: 1 },
  { day: 'Sun', resolved: 1, opened: 0 },
];

export default function AnalyticsPage() {
  const bugs = getStore('bugs') || [];
  const team = getStore('team') || [];
  const [period, setPeriod] = useState('6m');

  const resolved = bugs.filter(b => b.status === 'resolved').length;
  const resRate = Math.round((resolved / bugs.length) * 100);

  const kpis = [
    { label: 'Total Bugs', value: bugs.length, sub: '+12 this month', color: '#f87171', trend: '↑' },
    { label: 'Resolved', value: resolved, sub: `${resRate}% rate`, color: '#34d399', trend: '↑' },
    { label: 'Avg Fix Time', value: '3.2d', sub: '-0.4d vs last month', color: '#60a5fa', trend: '↓' },
    { label: 'Team Velocity', value: '94%', sub: '+2% this sprint', color: '#a855f7', trend: '↑' },
    { label: 'Bug Density', value: '1.8', sub: 'bugs per feature', color: '#fbbf24', trend: '↓' },
    { label: 'MTTR', value: '18h', sub: 'mean time to resolve', color: '#14b8a6', trend: '↑' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.03em' }}>Analytics</h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>Performance metrics and trends</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
          {['7d','1m','6m','1y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12,
              background: period === p ? 'rgba(34,197,94,0.15)' : 'transparent',
              color: period === p ? '#22c55e' : '#64748b',
              fontWeight: period === p ? 700 : 400,
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ ...S.card, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
              <span style={{ fontSize: 13, color: k.trend === '↑' ? '#34d399' : '#f87171' }}>{k.trend}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...S.card, padding: 22 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Bug Trend</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Opened vs Resolved over {period}</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={analyticsData.bugTrend}>
              <defs>
                <linearGradient id="gOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="opened" name="Opened" stroke="#f87171" fill="url(#gOpen)" strokeWidth={2} dot={false}/>
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#34d399" fill="url(#gResolved)" strokeWidth={2} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ ...S.card, padding: 22 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Weekly Resolution</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Bugs opened vs closed this week</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={resolutionData} barGap={4}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Bar dataKey="opened" name="Opened" fill="rgba(248,113,113,0.6)" radius={[3,3,0,0]}/>
              <Bar dataKey="resolved" name="Resolved" fill="rgba(52,211,153,0.7)" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Sprint velocity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ ...S.card, padding: 22 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Sprint Velocity</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Story points</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={analyticsData.sprintVelocity}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="sprint" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Line type="monotone" dataKey="planned" name="Planned" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} dot={false} strokeDasharray="4 3"/>
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Severity pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} style={{ ...S.card, padding: 22 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Severity Split</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Current bug distribution</div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={severityData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                {severityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 12px', justifyContent: 'center' }}>
            {severityData.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: PIE_COLORS[i], display: 'inline-block' }}/>
                {s.name} <strong style={{ color: '#e2e8f0' }}>{s.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team productivity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} style={{ ...S.card, padding: 22 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Team Productivity</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Score per member</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {team.slice(0, 5).map(m => (
              <div key={m.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{m.name.split(' ')[0]}</span>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{m.productivity}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${m.productivity}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    style={{
                      height: '100%', borderRadius: 4,
                      background: m.productivity >= 90 ? '#34d399' : m.productivity >= 80 ? '#22c55e' : '#fbbf24',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

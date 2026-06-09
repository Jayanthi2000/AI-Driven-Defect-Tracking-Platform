import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart,
  Pie, Cell, Legend,
} from 'recharts';
import {
  Bug, Users, Zap, TrendingUp, TrendingDown,
  ArrowRight, Activity, CheckCircle, Clock,
  AlertTriangle, BarChart2, Target, RefreshCw,
} from 'lucide-react';
import { getStore, analyticsData } from '../../data/store';
import { Avatar } from '../../components/ui/Avatar';

// ── Animated counter ────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
}

// ── Custom tooltip ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
      borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ fontSize: 13, color: p.color, display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ── Severity badge ──────────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const map = {
    critical: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' },
    high:     { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    medium:   { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
    low:      { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' },
  };
  const s = map[severity] || map.low;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'capitalize', letterSpacing: '0.02em',
    }}>{severity}</span>
  );
};

// ── Status badge ────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    resolved:    { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' },
    'in-progress': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
    open:        { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af', border: 'rgba(156,163,175,0.2)' },
  };
  const s = map[status] || map.open;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: 'capitalize', letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>{status}</span>
  );
};

// ── Activity dot ────────────────────────────────────────────────
const ActivityDot = ({ type }) => {
  const map = {
    success: '#10b981',
    error:   '#ef4444',
    info:    '#3b82f6',
  };
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: map[type] || '#6b7280',
      flexShrink: 0, marginTop: 6,
      boxShadow: `0 0 6px ${map[type] || '#6b7280'}80`,
    }} />
  );
};

// ── Mini progress bar ───────────────────────────────────────────
const ProgressBar = ({ value, color = 'var(--accent)' }) => (
  <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{ height: '100%', background: color, borderRadius: 4 }}
    />
  </div>
);

// ── Section header ──────────────────────────────────────────────
const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <div>
      <div className="font-display" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
    {action}
  </div>
);

const recentActivity = [
  { action: 'Bug resolved', detail: 'BUG-008 CSV import fixed', time: '10m', type: 'success', avatar: 'DK' },
  { action: 'Task created', detail: 'K8s migration planning', time: '34m', type: 'info', avatar: 'AM' },
  { action: 'Critical alert', detail: 'BUG-006 escalated', time: '1h', type: 'error', avatar: 'RS' },
  { action: 'Sprint review', detail: 'Sprint 17 completed 96%', time: '2h', type: 'success', avatar: 'PS' },
  { action: 'Team update', detail: 'Ravi Nair joined', time: '3h', type: 'info', avatar: 'RN' },
];

const stagger = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function Dashboard() {
  const navigate = useNavigate();
  const bugs = getStore('bugs');
  const team = getStore('team');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const openBugs      = bugs.filter(b => b.status === 'open').length;
  const resolvedBugs  = bugs.filter(b => b.status === 'resolved').length;
  const criticalBugs  = bugs.filter(b => b.severity === 'critical').length;
  const inProgressBugs = bugs.filter(b => b.status === 'in-progress').length;
  const resolutionRate = Math.round((resolvedBugs / bugs.length) * 100);

  const statCards = [
    {
      label: 'Total Bugs', value: bugs.length, change: +12, icon: Bug,
      color: '#ef4444', trend: 'up-bad',
      sub: `${criticalBugs} critical`,
    },
    {
      label: 'Resolved', value: resolvedBugs, change: +24, icon: CheckCircle,
      color: '#10b981', trend: 'up-good',
      sub: `${resolutionRate}% rate`,
    },
    {
      label: 'In Progress', value: inProgressBugs, change: 0, icon: Clock,
      color: '#3b82f6', trend: 'neutral',
      sub: `${openBugs} open`,
    },
    {
      label: 'AI Accuracy', value: 94, change: +3, icon: Zap,
      color: '#a855f7', trend: 'up-good', suffix: '%',
      sub: 'predictions correct',
    },
    {
      label: 'Team Size', value: team.length, change: 0, icon: Users,
      color: 'var(--accent)', trend: 'neutral',
      sub: `${team.filter(m => m.status === 'online').length} online`,
    },
    {
      label: 'Sprint Goal', value: 96, change: +2, icon: Target,
      color: '#f59e0b', trend: 'up-good', suffix: '%',
      sub: 'Sprint 17',
    },
  ];

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Last updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}
      >
        {statCards.map((card) => (
          <motion.div key={card.label} variants={stagger} className="glass-card"
            style={{ padding: 18, cursor: 'default' }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${card.color}20`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <card.icon size={17} color={card.color} />
              </div>
              {card.change !== 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3, fontSize: 12,
                  color: card.trend === 'up-bad' ? '#ef4444' : '#10b981',
                  background: card.trend === 'up-bad' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  padding: '2px 7px', borderRadius: 6,
                }}>
                  {card.trend === 'up-bad'
                    ? <TrendingUp size={11} />
                    : <TrendingUp size={11} />}
                  {card.change > 0 ? '+' : ''}{card.change}
                </div>
              )}
            </div>
            <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              <AnimatedCounter target={card.value} />{card.suffix}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{card.label}</div>
            {card.sub && (
              <div style={{ fontSize: 11, color: card.color, marginTop: 6, opacity: 0.85 }}>{card.sub}</div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Alert Banner (if critical bugs) ── */}
      {criticalBugs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 10, marginBottom: 16,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <AlertTriangle size={15} color="#ef4444" />
          <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 500 }}>
            {criticalBugs} critical bug{criticalBugs > 1 ? 's' : ''} require immediate attention
          </span>
          <button
            onClick={() => navigate('/bugs')}
            style={{
              marginLeft: 'auto', fontSize: 12, color: '#ef4444',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            View bugs <ArrowRight size={11} />
          </button>
        </motion.div>
      )}

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Bug Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader
            title="Bug Trend"
            sub="Last 6 months"
            action={
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Opened
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981', display: 'inline-block' }} /> Resolved
                </span>
              </div>
            }
          />
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={analyticsData.bugTrend}>
              <defs>
                <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="opened" name="Opened" stroke="#ef4444" fill="url(#colorOpen)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" fill="url(#colorResolved)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sprint Velocity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader title="Sprint Velocity" sub="Story points per sprint" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={analyticsData.sprintVelocity} barGap={4}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="planned" name="Planned" fill="var(--border-bright)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Middle Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Severity Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader title="Severity Split" sub="Current open bugs" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={analyticsData.severityDist}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={70}
                paddingAngle={3} dataKey="value"
              >
                {analyticsData.severityDist.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
                  borderRadius: 8, fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', justifyContent: 'center' }}>
            {analyticsData.severityDist.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block' }} />
                {s.name} <strong style={{ color: 'var(--text-primary)' }}>{s.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader title="Team Performance" sub="Productivity score" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {team.map(member => (
              <div key={member.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initials={member.avatar} size={22} status={member.status} />
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{member.name.split(' ')[0]}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{member.productivity}%</span>
                </div>
                <ProgressBar
                  value={member.productivity}
                  color={member.productivity >= 90 ? '#10b981' : member.productivity >= 80 ? 'var(--accent)' : '#f59e0b'}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader title="Quick Actions" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Report a Bug', icon: Bug, color: '#ef4444', path: '/bugs/create' },
              { label: 'Add Team Member', icon: Users, color: 'var(--accent)', path: '/team' },
              { label: 'View Analytics', icon: BarChart2, color: '#3b82f6', path: '/analytics' },
              { label: 'AI Insights', icon: Zap, color: '#a855f7', path: '/ai' },
            ].map(({ label, icon: Icon, color, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.18s', textAlign: 'left', width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}40`;
                  e.currentTarget.style.background = `${color}0d`;
                  e.currentTarget.style.color = color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={13} color={color} />
                </div>
                {label}
                <ArrowRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 14 }}>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader
            title="Recent Activity"
            action={<Activity size={14} color="var(--text-muted)" />}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '10px 0',
                borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'flex-start',
              }}>
                <Avatar initials={item.avatar} size={28} />
                <ActivityDot type={item.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.action}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.detail}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bugs Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card" style={{ padding: 20 }}
        >
          <SectionHeader
            title="Recent Bugs"
            action={
              <button
                onClick={() => navigate('/bugs')}
                style={{
                  fontSize: 12, color: 'var(--accent)', background: 'none',
                  border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 4,
                }}
              >
                View all <ArrowRight size={12} />
              </button>
            }
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'Title', 'Severity', 'Status', 'Assignee'].map(h => (
                    <th key={h} style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                      textAlign: 'left', padding: '0 0 10px',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bugs.slice(0, 6).map((bug, i) => (
                  <motion.tr
                    key={bug.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                    style={{ borderTop: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => navigate(`/bugs/${bug.id}`)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '9px 8px 9px 0', fontSize: 12, color: 'var(--accent)', fontFamily: 'monospace' }}>
                      {bug.id}
                    </td>
                    <td style={{ padding: '9px 8px', fontSize: 13, color: 'var(--text-primary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {bug.title}
                    </td>
                    <td style={{ padding: '9px 8px' }}>
                      <SeverityBadge severity={bug.severity} />
                    </td>
                    <td style={{ padding: '9px 8px' }}>
                      <StatusBadge status={bug.status} />
                    </td>
                    <td style={{ padding: '9px 0 9px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {bug.assignee
                        ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Avatar initials={bug.assignee.split(' ').map(n => n[0]).join('')} size={20} />
                            <span>{bug.assignee.split(' ')[0]}</span>
                          </div>
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                      }
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
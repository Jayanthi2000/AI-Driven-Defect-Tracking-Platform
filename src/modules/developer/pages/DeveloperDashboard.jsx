// DeveloperDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bug, AlertCircle, Clock, CheckCircle, FlaskConical, Trophy,
  TrendingUp, ArrowRight, Activity, Target, Flame, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import {
  getCurrentUser, getDeveloperBugs, getDeveloperActivities, getDeveloperStats,
  getUserNotifications, BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY,
  initializeDemoData
} from '../services/developerService';

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

const GlassCard = ({ children, className = '', glowColor = '' }) => (
  <div
    className={`rounded-2xl relative overflow-hidden ${className}`}
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
    }}
  >
    {glowColor && (
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
        style={{ background: glowColor, filter: 'blur(20px)', transform: 'translate(30%, -30%)' }}
      />
    )}
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div {...fadeInUp(delay)}>
    <GlassCard className="p-5 hover:border-white/15 transition-all duration-300 group cursor-default" glowColor={color}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <TrendingUp className="w-4 h-4 text-white/20 group-hover:text-emerald-400/50 transition-colors" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/50 text-sm">{label}</p>
    </GlassCard>
  </motion.div>
);

const priorityColors = {
  LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444',
};
const statusColors = {
  ASSIGNED: '#6366f1', IN_PROGRESS: '#f59e0b', FIXED: '#10b981', READY_FOR_TESTING: '#3b82f6', COMPLETED: '#22c55e',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(18,18,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setBugs(getDeveloperBugs(user.id));
      setActivities(getDeveloperActivities(user.id));
      setStats(getDeveloperStats(user.id));
    }
  }, []);

  const statCards = [
    { icon: Bug, label: 'Total Assigned', value: stats.assigned || 0, color: '#6366f1', delay: 0.1 },
    { icon: AlertCircle, label: 'Open Bugs', value: stats.open || 0, color: '#ef4444', delay: 0.15 },
    { icon: Clock, label: 'In Progress', value: stats.inProgress || 0, color: '#f59e0b', delay: 0.2 },
    { icon: CheckCircle, label: 'Fixed', value: stats.fixed || 0, color: '#10b981', delay: 0.25 },
    { icon: FlaskConical, label: 'Ready for Testing', value: stats.readyForTesting || 0, color: '#3b82f6', delay: 0.3 },
    { icon: Trophy, label: 'Completed', value: stats.completed || 0, color: '#22c55e', delay: 0.35 },
  ];

  // Chart data
  const priorityData = Object.entries(
    bugs.reduce((acc, bug) => { acc[bug.priority] = (acc[bug.priority] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const statusData = Object.entries(
    bugs.reduce((acc, bug) => { acc[bug.status] = (acc[bug.status] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value, fill: statusColors[name] }));

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const dayBugs = bugs.filter(b => new Date(b.updatedAt).toDateString() === date.toDateString());
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fixed: dayBugs.filter(b => b.status === BUG_STATUS.FIXED || b.status === BUG_STATUS.COMPLETED).length,
      active: dayBugs.filter(b => b.status === BUG_STATUS.IN_PROGRESS).length,
    };
  });

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const monthBugs = bugs.filter(b => new Date(b.createdAt).getMonth() === date.getMonth());
    return { month, bugs: monthBugs.length, fixed: monthBugs.filter(b => b.status === BUG_STATUS.COMPLETED).length };
  });

  const recentBugs = bugs.slice(0, 5);
  const recentActivities = activities.slice(0, 6);

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getBadge = (value, colors) => (
    <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: `${colors[value]}20`, color: colors[value], border: `1px solid ${colors[value]}30` }}>
      {value}
    </span>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-full bg-transparent">
      {/* Header */}
      <motion.div {...fadeInUp(0)} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {(currentUser?.name || currentUser?.fullName)?.split(' ')[0]} 👋
          </h2>
          <p className="text-white/40 text-sm mt-1">Here's your development overview for today</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Active Developer</span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly activity */}
        <motion.div {...fadeInUp(0.4)} className="lg:col-span-2">
          <GlassCard className="p-5 h-64">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm">Weekly Activity</h3>
                <p className="text-white/40 text-xs">Bugs worked vs fixed</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-white/50">Fixed</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-white/50">Active</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="75%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="fixedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="fixed" stroke="#10b981" fill="url(#fixedGrad)" strokeWidth={2} name="Fixed" />
                <Area type="monotone" dataKey="active" stroke="#3b82f6" fill="url(#activeGrad)" strokeWidth={2} name="Active" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Priority breakdown */}
        <motion.div {...fadeInUp(0.45)}>
          <GlassCard className="p-5 h-64">
            <h3 className="text-white font-semibold text-sm mb-1">Priority Breakdown</h3>
            <p className="text-white/40 text-xs mb-3">Bug distribution</p>
            <ResponsiveContainer width="100%" height="75%">
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {priorityData.map((entry, i) => (
                    <Cell key={i} fill={priorityColors[entry.name] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-1">
              {priorityData.map((p) => (
                <div key={p.name} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: priorityColors[p.name] }} />
                  <span className="text-white/40 text-xs">{p.name} ({p.value})</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Monthly trend + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeInUp(0.5)}>
          <GlassCard className="p-5 h-56">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-sm">Monthly Trend</h3>
                <p className="text-white/40 text-xs">6-month overview</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="75%">
              <BarChart data={monthlyData} barSize={14}>
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bugs" fill="rgba(99,102,241,0.6)" radius={[3, 3, 0, 0]} name="Assigned" />
                <Bar dataKey="fixed" fill="rgba(16,185,129,0.7)" radius={[3, 3, 0, 0]} name="Fixed" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        <motion.div {...fadeInUp(0.55)}>
          <GlassCard className="p-5 h-56">
            <h3 className="text-white font-semibold text-sm mb-1">Status Distribution</h3>
            <p className="text-white/40 text-xs mb-3">Current bug states</p>
            <div className="space-y-2.5">
              {statusData.map((s) => {
                const pct = stats.assigned > 0 ? Math.round((s.value / stats.assigned) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/60">{s.name}</span>
                      <span className="text-white/40">{s.value} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: s.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Bugs + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Assigned Bugs */}
        <motion.div {...fadeInUp(0.6)}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Recent Assigned Bugs</h3>
              <button
                onClick={() => navigate('/developer/my-bugs')}
                className="text-emerald-400 text-xs hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {recentBugs.length === 0 ? (
                <p className="text-white/30 text-sm py-4 text-center">No bugs assigned</p>
              ) : (
                recentBugs.map((bug) => (
                  <button
                    key={bug.id}
                    onClick={() => navigate(`/developer/bug-details/${bug.id}`)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">{bug.title}</p>
                        <p className="text-white/30 text-xs mt-0.5">{bug.module} · {timeAgo(bug.createdAt)}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {getBadge(bug.priority, priorityColors)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div {...fadeInUp(0.65)}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
              <button
                onClick={() => navigate('/developer/activity')}
                className="text-emerald-400 text-xs hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {recentActivities.length === 0 ? (
                <div className="py-4 text-center">
                  <Activity className="w-6 h-6 text-white/20 mx-auto mb-2" />
                  <p className="text-white/30 text-sm">No activity yet. Start working on bugs!</p>
                </div>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs font-medium">{act.action}</p>
                      <p className="text-white/30 text-xs">{act.details} · {timeAgo(act.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Productivity score */}
      <motion.div {...fadeInUp(0.7)}>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" /> Developer Productivity Score
              </h3>
              <p className="text-white/40 text-xs">Based on bug resolution rate and activity</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-400">{stats.assigned > 0 ? Math.round(((stats.fixed + stats.completed) / stats.assigned) * 100) : 0}%</p>
              <p className="text-white/30 text-xs">Fix Rate</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Bugs Resolved', value: (stats.fixed || 0) + (stats.completed || 0), icon: CheckCircle, color: '#10b981' },
              { label: 'Total Activities', value: activities.length, icon: Activity, color: '#6366f1' },
              { label: 'Pending', value: (stats.open || 0) + (stats.inProgress || 0), icon: Clock, color: '#f59e0b' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                <div>
                  <p className="text-white font-bold text-lg leading-none">{item.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default DeveloperDashboard;
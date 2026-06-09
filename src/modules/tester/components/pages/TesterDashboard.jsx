// TesterDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bug, CheckCircle, XCircle, RotateCcw, Clock, AlertTriangle,
  TrendingUp, Plus, ArrowRight, Activity, Eye, FlaskConical
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { getCurrentUser, getTesterStats, getBugsByReporter } from '../../services/testerService';
import { getActivitiesByUser, ACTIVITY_LABELS } from '../../services/activityService';
import { computeTesterAnalytics } from '../../services/analyticsService';
import { STATUS_COLORS, SEVERITY_COLORS } from '../../services/bugWorkflowService';
import { GlassCard, StatCard, StatusBadge, SeverityBadge, PageHeader, EmptyState, TimeAgo } from '../shared/SharedComponents';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: 'easeOut' },
});

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const SEVERITY_PIE_COLORS = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e',
};

export default function TesterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [recentBugs, setRecentBugs] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    setUser(u);
    setStats(getTesterStats(u.id));
    setAnalytics(computeTesterAnalytics(u.id));
    setRecentBugs(getBugsByReporter(u.id).slice(0, 6));
    setActivities(getActivitiesByUser(u.id).slice(0, 8));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Total Reported',    value: stats.total || 0,           icon: Bug,          color: 'emerald' },
    { label: 'Open',              value: stats.open || 0,            icon: AlertTriangle, color: 'blue'    },
    { label: 'Ready for Retest',  value: stats.readyForTesting || 0, icon: FlaskConical,  color: 'indigo'  },
    { label: 'In Review',         value: stats.testerReview || 0,    icon: Eye,           color: 'orange'  },
    { label: 'Approved',          value: stats.approved || 0,        icon: CheckCircle,   color: 'cyan'    },
    { label: 'Closed',            value: stats.closed || 0,          icon: CheckCircle,   color: 'gray'    },
    { label: 'Rejected',          value: stats.rejected || 0,        icon: XCircle,       color: 'red'     },
    { label: 'Reopened',          value: stats.reopened || 0,        icon: RotateCcw,     color: 'yellow'  },
  ];

  // Severity pie data
  const severityPieData = Object.entries(analytics.severityDist || {})
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // Status bar data
  const statusBarData = Object.entries(analytics.statusDist || {})
    .map(([status, count]) => ({ status: status.replace(/_/g, ' '), count }));

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's your testing overview for today</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/tester/report-bug')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={15} /> Report Bug
        </motion.button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {statCards.map((card, i) => (
          <motion.div key={card.label} {...fadeUp(0.05 + i * 0.04)}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly trend */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2">
          <GlassCard className="p-5 h-60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Weekly Bug Reports</h3>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="75%">
              <AreaChart data={analytics.weeklyTrends || []}>
                <defs>
                  <linearGradient id="testerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#testerGrad)" strokeWidth={2} name="Bugs" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Severity breakdown */}
        <motion.div {...fadeUp(0.35)}>
          <GlassCard className="p-5 h-60">
            <h3 className="text-sm font-semibold text-white mb-1">Severity Breakdown</h3>
            <p className="text-xs text-gray-500 mb-2">All reported bugs</p>
            {severityPieData.length === 0 ? (
              <div className="flex items-center justify-center h-36 text-gray-600 text-xs">No data yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="65%">
                  <PieChart>
                    <Pie data={severityPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                      {severityPieData.map((entry, i) => (
                        <Cell key={i} fill={SEVERITY_PIE_COLORS[entry.name] || '#6366f1'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-1">
                  {severityPieData.map(s => (
                    <div key={s.name} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_PIE_COLORS[s.name] }} />
                      <span className="text-gray-500 text-[10px]">{s.name} ({s.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Performance + Status distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(0.4)}>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-400" /> Performance Metrics
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Closure Rate',   value: analytics.closureRate   || 0, color: 'bg-emerald-500' },
                { label: 'Approval Rate',  value: analytics.approvalRate  || 0, color: 'bg-blue-500'    },
                { label: 'Rejection Rate', value: analytics.rejectionRate || 0, color: 'bg-red-500'     },
                { label: 'Reopen Rate',    value: analytics.reopenRate    || 0, color: 'bg-orange-500'  },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-400">{m.label}</span>
                    <span className="text-xs font-semibold text-white">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${m.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div {...fadeUp(0.45)}>
          <GlassCard className="p-5 h-56">
            <h3 className="text-sm font-semibold text-white mb-3">Status Distribution</h3>
            {statusBarData.length === 0 ? (
              <div className="flex items-center justify-center h-36 text-gray-600 text-xs">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={statusBarData} barSize={14}>
                  <XAxis dataKey="status" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="rgba(16,185,129,0.6)" radius={[3, 3, 0, 0]} name="Bugs" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Bugs + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent bugs */}
        <motion.div {...fadeUp(0.5)}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Bug Reports</h3>
              <button
                onClick={() => navigate('/tester/my-bugs')}
                className="text-emerald-400 text-xs hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            {recentBugs.length === 0 ? (
              <EmptyState title="No bugs reported yet" />
            ) : (
              <div className="space-y-2">
                {recentBugs.map(bug => (
                  <button
                    key={bug.id}
                    onClick={() => navigate(`/tester/bug-details/${bug.id}`)}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">{bug.title}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{bug.module} · <TimeAgo date={bug.createdAt} /></p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <SeverityBadge severity={bug.severity} />
                        <StatusBadge status={bug.status} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div {...fadeUp(0.55)}>
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <button
                onClick={() => navigate('/tester/activity')}
                className="text-emerald-400 text-xs hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            {activities.length === 0 ? (
              <EmptyState title="No activity yet" />
            ) : (
              <div className="space-y-1">
                {activities.map(act => (
                  <div key={act.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300">
                        <span className="text-emerald-400">{(ACTIVITY_LABELS || {})[act.type] || act.type?.replace(/_/g, ' ')}</span>
                        {act.bugTitle && <span className="text-gray-500"> — {act.bugTitle}</span>}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5"><TimeAgo date={act.createdAt} /></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
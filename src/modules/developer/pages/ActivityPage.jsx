// ActivityPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Bug, MessageSquare, CheckCircle, Play, Send, FileText, Filter, Calendar } from 'lucide-react';
import { getCurrentUser, getDeveloperActivities, getDeveloperBugs, initializeDemoData } from '../services/developerService';

const GlassCard = ({ children, className = '' }) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
    {children}
  </div>
);

const actionConfig = {
  'Started Bug': { icon: Play, color: '#10b981' },
  'Fixed Bug': { icon: CheckCircle, color: '#22c55e' },
  'Added Comment': { icon: MessageSquare, color: '#6366f1' },
  'Updated Fix Notes': { icon: FileText, color: '#f59e0b' },
  'Sent For Testing': { icon: Send, color: '#3b82f6' },
  'Paused Bug': { icon: Bug, color: '#f97316' },
  'default': { icon: Activity, color: '#10b981' },
};

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const acts = getDeveloperActivities(user.id);
      setActivities(acts);
      setBugs(getDeveloperBugs(user.id));
    }
  }, []);

  const actionTypes = [...new Set(activities.map(a => a.action))];
  const filtered = filter === 'all' ? activities : activities.filter(a => a.action === filter);

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Group by date
  const grouped = filtered.reduce((acc, act) => {
    const dateLabel = formatDate(act.timestamp);
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(act);
    return acc;
  }, {});

  const totalFixed = activities.filter(a => a.action === 'Fixed Bug').length;
  const totalComments = activities.filter(a => a.action === 'Added Comment').length;
  const totalStarted = activities.filter(a => a.action === 'Started Bug').length;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Activity</h2>
          <p className="text-white/40 text-sm">{activities.length} total activities</p>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Activities', value: activities.length, icon: Activity, color: '#6366f1' },
          { label: 'Bugs Fixed', value: totalFixed, icon: CheckCircle, color: '#10b981' },
          { label: 'Started Work', value: totalStarted, icon: Play, color: '#f59e0b' },
          { label: 'Comments Added', value: totalComments, icon: MessageSquare, color: '#3b82f6' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{card.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{card.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Filter sidebar */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-4 sticky top-20">
            <h3 className="text-white/50 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Filter
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${filter === 'all' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                All ({activities.length})
              </button>
              {actionTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${filter === type ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  {type} ({activities.filter(a => a.action === type).length})
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Activity feed */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="lg:col-span-3 space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Activity className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No activities yet. Start working on your assigned bugs!</p>
            </GlassCard>
          ) : (
            Object.entries(grouped).map(([date, acts]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-white/40 text-xs font-medium uppercase tracking-widest">{date}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <GlassCard className="overflow-hidden">
                  {acts.map((act, i) => {
                    const config = actionConfig[act.action] || actionConfig.default;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={act.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${config.color}15`, border: `1px solid ${config.color}25` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white/80 text-sm font-medium">{act.action}</span>
                            <span className="text-white/25 text-xs">·</span>
                            <span className="text-white/30 text-xs">{timeAgo(act.timestamp)}</span>
                          </div>
                          <p className="text-white/40 text-xs truncate">{act.details}</p>
                        </div>
                        <span className="text-white/20 text-xs flex-shrink-0">
                          {new Date(act.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                    );
                  })}
                </GlassCard>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityPage;
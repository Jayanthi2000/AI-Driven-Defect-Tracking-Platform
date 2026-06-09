// ActivityPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Search, Filter, ArrowRight, CheckCircle, XCircle,
  RotateCcw, Lock, MessageSquare, RefreshCw, AlertTriangle, User, Tag
} from 'lucide-react';
import { getCurrentUser } from '../../services/testerService';
import { getActivitiesByUser, ACTIVITY_LABELS, ACTIVITY_TYPES } from '../../services/activityService';
import { GlassCard, PageHeader, TimeAgo, EmptyState } from '../shared/SharedComponents';

const TYPE_CONFIG = {
  BUG_REPORTED: { icon: AlertTriangle, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  BUG_ASSIGNED: { icon: User, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-400' },
  BUG_APPROVED: { icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  BUG_REJECTED: { icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  BUG_REOPENED: { icon: RotateCcw, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  BUG_CLOSED: { icon: Lock, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' },
  COMMENT_ADDED: { icon: MessageSquare, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', dot: 'bg-cyan-400' },
  RETEST_COMPLETED: { icon: RefreshCw, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
  REVIEW_ADDED: { icon: Tag, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400' },
  STATUS_CHANGED: { icon: Tag, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', dot: 'bg-gray-400' },
};

const ALL_TYPES = Object.keys(ACTIVITY_TYPES);

export default function ActivityPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    if (user) setActivities(getActivitiesByUser(user.id));
  }, []);

  const filtered = useMemo(() => {
    let result = [...activities];
    if (search) result = result.filter(a =>
      (a.bugTitle || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.details || '').toLowerCase().includes(search.toLowerCase()) ||
      (ACTIVITY_LABELS[a.type] || '').toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'ALL') result = result.filter(a => a.type === typeFilter);
    return result;
  }, [activities, search, typeFilter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(act => {
      const d = new Date(act.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      let key;
      if (d.toDateString() === today.toDateString()) key = 'Today';
      else if (d.toDateString() === yesterday.toDateString()) key = 'Yesterday';
      else key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(act);
    });
    return groups;
  }, [filtered]);

  const typeCounts = useMemo(() => {
    const counts = {};
    activities.forEach(a => counts[a.type] = (counts[a.type] || 0) + 1);
    return counts;
  }, [activities]);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <PageHeader
        title="Activity Log"
        subtitle={`${activities.length} total activities`}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: activities.length, color: 'text-white' },
          { label: 'Bugs Reported', value: typeCounts.BUG_REPORTED || 0, color: 'text-blue-400' },
          { label: 'Approvals', value: typeCounts.BUG_APPROVED || 0, color: 'text-emerald-400' },
          { label: 'Comments', value: typeCounts.COMMENT_ADDED || 0, color: 'text-cyan-400' },
        ].map(s => (
          <GlassCard key={s.label} className="p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-3 space-y-2">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search activities..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
              typeFilter === 'ALL'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'text-gray-500 border-white/10 hover:text-white hover:bg-white/5'
            }`}
          >
            All Types
          </button>
          {ALL_TYPES.map(type => {
            const config = TYPE_CONFIG[type];
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'text-gray-500 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {ACTIVITY_LABELS[type] || type}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Activity Timeline */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activities found"
          description={search || typeFilter !== 'ALL' ? "Try adjusting your filters" : "Your activity will appear here"}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{date}</span>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] text-gray-600">{acts.length} events</span>
              </div>
              <div className="space-y-2">
                {acts.map((act, i) => {
                  const config = TYPE_CONFIG[act.type] || TYPE_CONFIG.STATUS_CHANGED;
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex gap-3"
                    >
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${config.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-white/10 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-sm font-medium text-white">
                              {ACTIVITY_LABELS[act.type] || act.type.replace(/_/g, ' ')}
                            </span>
                            {act.bugTitle && (
                              <span className="text-sm text-gray-500"> — {act.bugTitle}</span>
                            )}
                          </div>
                          <TimeAgo date={act.createdAt} />
                        </div>
                        {act.details && (
                          <p className="text-xs text-gray-500 mt-1">{act.details}</p>
                        )}
                        {act.bugId && (
                          <button
                            onClick={() => navigate(`/tester/bug-details/${act.bugId}`)}
                            className="mt-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                          >
                            View bug <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
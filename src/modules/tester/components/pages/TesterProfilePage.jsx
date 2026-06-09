// TesterProfilePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Edit2, Save, X, Award, TrendingUp, Bug,
  CheckCircle, XCircle, RotateCcw, Star, Shield, Zap
} from 'lucide-react';
import { getCurrentUser, updateUser, getBugsByReporter } from '../../services/testerService';
import { getActivitiesByUser } from '../../services/activityService';
import { computeTesterAnalytics } from '../../services/analyticsService';
import {
  GlassCard, StatCard, PageHeader, GreenButton, GhostButton, Input, Textarea
} from '../shared/SharedComponents';

const ACHIEVEMENTS = [
  { id: 'first_bug', label: 'First Bug', desc: 'Reported your first bug', icon: Bug, threshold: (s) => s.total >= 1 },
  { id: 'bug_hunter', label: 'Bug Hunter', desc: 'Reported 10+ bugs', icon: Shield, threshold: (s) => s.total >= 10 },
  { id: 'critical_finder', label: 'Critical Finder', desc: 'Reported 3+ critical bugs', icon: Zap, threshold: (s) => s.criticalCount >= 3 },
  { id: 'closer', label: 'Closer', desc: 'Closed 5+ bugs', icon: CheckCircle, threshold: (s) => s.closed >= 5 },
  { id: 'star_tester', label: 'Star Tester', desc: '90%+ approval rate', icon: Star, threshold: (s) => s.approvalRate >= 90 },
  { id: 'veteran', label: 'Veteran', desc: 'Reported 50+ bugs', icon: Award, threshold: (s) => s.total >= 50 },
];

export default function TesterProfilePage() {
  const [user, setUser] = useState(getCurrentUser());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', phone: '' });
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!user) return;
    const bugs = getBugsByReporter(user.id);
    const criticalCount = bugs.filter(b => b.severity === 'CRITICAL').length;
    const s = {
      total: bugs.length,
      closed: bugs.filter(b => b.status === 'CLOSED').length,
      approved: bugs.filter(b => ['APPROVED', 'CLOSED'].includes(b.status)).length,
      rejected: bugs.filter(b => b.status === 'REJECTED').length,
      reopened: bugs.filter(b => b.status === 'REOPENED').length,
      criticalCount,
    };
    const a = computeTesterAnalytics(user.id);
    s.approvalRate = a.approvalRate;
    setStats(s);
    setAnalytics(a);
    setActivities(getActivitiesByUser(user.id).slice(0, 5));
    setForm({ name: user.name || '', bio: user.bio || '', phone: user.phone || '' });
  }, []);

  const handleSave = () => {
    const updated = updateUser({ ...user, ...form });
    setUser(getCurrentUser());
    setEditing(false);
  };

  const earnedAchievements = ACHIEVEMENTS.filter(a => a.threshold(stats));
  const lockedAchievements = ACHIEVEMENTS.filter(a => !a.threshold(stats));

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <PageHeader title="Profile" subtitle="Your tester profile and statistics" />

      {/* Profile Header */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-emerald-400">
                {user?.name?.charAt(0).toUpperCase() || 'T'}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield size={12} className="text-black" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  rows={2}
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
                <div className="flex gap-2">
                  <GreenButton onClick={handleSave} size="sm">
                    <Save size={13} className="inline mr-1.5" /> Save
                  </GreenButton>
                  <GhostButton onClick={() => setEditing(false)} size="sm">
                    <X size={13} className="inline mr-1.5" /> Cancel
                  </GhostButton>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    {user?.bio && <p className="text-sm text-gray-500 mt-1">{user.bio}</p>}
                  </div>
                  <GhostButton onClick={() => setEditing(true)} size="sm">
                    <Edit2 size={13} className="inline mr-1.5" /> Edit
                  </GhostButton>
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                    Tester
                  </span>
                  {user?.phone && (
                    <span className="text-xs text-gray-500">{user.phone}</span>
                  )}
                  <span className="text-xs text-gray-500">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Bugs" value={stats.total || 0} icon={Bug} color="emerald" />
        <StatCard label="Closed" value={stats.closed || 0} icon={CheckCircle} color="gray" />
        <StatCard label="Approved" value={stats.approved || 0} icon={CheckCircle} color="blue" />
        <StatCard label="Reopened" value={stats.reopened || 0} icon={RotateCcw} color="orange" />
      </div>

      {/* Performance + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-emerald-400" /> Performance Metrics
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Closure Rate', value: analytics.closureRate || 0, color: 'bg-emerald-500' },
              { label: 'Approval Rate', value: analytics.approvalRate || 0, color: 'bg-blue-500' },
              { label: 'Rejection Rate', value: analytics.rejectionRate || 0, color: 'bg-red-500' },
              { label: 'Reopen Rate', value: analytics.reopenRate || 0, color: 'bg-orange-500' },
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
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full ${m.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
            <div className="text-center bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Reports</p>
            </div>
            <div className="text-center bg-white/[0.02] rounded-xl p-3 border border-white/5">
              <p className="text-2xl font-bold text-emerald-400">{analytics.approvalRate || 0}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Approval Rate</p>
            </div>
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="p-4">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Award size={15} className="text-yellow-400" /> Achievements
            <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-0.5 rounded-full ml-auto">
              {earnedAchievements.length}/{ACHIEVEMENTS.length}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS.map(ach => {
              const earned = earnedAchievements.includes(ach);
              const Icon = ach.icon;
              return (
                <div
                  key={ach.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    earned
                      ? 'bg-yellow-400/5 border-yellow-400/20'
                      : 'bg-white/[0.01] border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      earned ? 'bg-yellow-400/15' : 'bg-white/5'
                    }`}>
                      <Icon size={13} className={earned ? 'text-yellow-400' : 'text-gray-600'} />
                    </div>
                    <span className={`text-[11px] font-semibold ${earned ? 'text-white' : 'text-gray-600'}`}>
                      {ach.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-snug">{ach.desc}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Activity Summary */}
      <GlassCard className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
        {activities.length === 0 ? (
          <p className="text-xs text-gray-600 py-4 text-center">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {activities.map(act => (
              <div key={act.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300">
                    <span className="text-emerald-400">{act.type.replace(/_/g, ' ')}</span>
                    {act.bugTitle && <span className="text-gray-500"> — {act.bugTitle}</span>}
                  </p>
                </div>
                <span className="text-[10px] text-gray-600 flex-shrink-0">
                  {new Date(act.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
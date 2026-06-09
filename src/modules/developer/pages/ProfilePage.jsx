// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Edit3, Save, X, Bug, CheckCircle, Activity, Trophy, Zap,
  Code, Clock, Target, Award, Star, TrendingUp
} from 'lucide-react';
import {
  getCurrentUser, getDeveloperBugs, getDeveloperActivities, getDeveloperStats,
  getUsers, saveUsers, BUG_STATUS, initializeDemoData
} from '../services/developerService';

const GlassCard = ({ children, className = '' }) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
    {children}
  </div>
);

const achievements = [
  { id: 'first_fix', label: 'First Fix', desc: 'Fixed your first bug', icon: Bug, color: '#10b981', unlocked: (stats) => (stats.fixed + stats.completed) >= 1 },
  { id: 'five_fixes', label: 'Bug Slayer', desc: 'Fixed 5 bugs', icon: Zap, color: '#f59e0b', unlocked: (stats) => (stats.fixed + stats.completed) >= 5 },
  { id: 'ten_fixes', label: 'Debug Master', desc: 'Fixed 10 bugs', icon: Trophy, color: '#6366f1', unlocked: (stats) => (stats.fixed + stats.completed) >= 10 },
  { id: 'active', label: 'Active Coder', desc: 'Currently working on bugs', icon: Activity, color: '#3b82f6', unlocked: (stats) => stats.inProgress > 0 },
  { id: 'testing', label: 'Quality Focus', desc: 'Sent bugs for testing', icon: Target, color: '#ec4899', unlocked: (stats) => stats.readyForTesting > 0 },
  { id: 'complete', label: 'Completionist', desc: 'Completed 3+ bugs', icon: Star, color: '#f97316', unlocked: (stats) => stats.completed >= 3 },
];

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [bugs, setBugs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [toast, setToast] = useState(null);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setEditData({ name: user.name, bio: user.bio || '', skills: user.skills || [], experience: user.experience || '' });
      setBugs(getDeveloperBugs(user.id));
      setActivities(getDeveloperActivities(user.id));
      setStats(getDeveloperStats(user.id));
    }
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleSave = () => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...editData };
      saveUsers(users);
      localStorage.setItem('defectai_currentUser', JSON.stringify(users[idx]));
      setCurrentUser(users[idx]);
    }
    setEditMode(false);
    showToast('Profile updated!');
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setEditData(d => ({ ...d, skills: [...(d.skills || []), skillInput.trim()] }));
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setEditData(d => ({ ...d, skills: (d.skills || []).filter(s => s !== skill) }));
  };

  const getInitials = (name) => (name || 'D').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const fixRate = stats.assigned > 0 ? Math.round(((stats.fixed + stats.completed) / stats.assigned) * 100) : 0;

  const recentBugs = bugs.filter(b => b.status === BUG_STATUS.COMPLETED || b.status === BUG_STATUS.FIXED).slice(0, 4);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium text-emerald-400 shadow-2xl"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(20px)' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(30%, -30%)', filter: 'blur(40px)' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20">
                {getInitials(currentUser?.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editMode ? (
                <input
                  value={editData.name}
                  onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                  className="text-2xl font-bold text-white bg-white/10 border border-white/20 rounded-xl px-3 py-1 outline-none focus:border-emerald-500/50 mb-1 w-full max-w-sm"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{currentUser?.name}</h2>
              )}
              <p className="text-emerald-400 text-sm font-medium">Developer</p>
              <p className="text-white/40 text-sm">{currentUser?.email}</p>
            </div>

            {/* Edit button */}
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-sm transition-all">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={() => setEditMode(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 text-sm transition-all">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 text-sm transition-all">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5 pt-5 border-t border-white/10">
            {editMode ? (
              <textarea
                value={editData.bio}
                onChange={e => setEditData(d => ({ ...d, bio: e.target.value }))}
                placeholder="Write a short bio about yourself..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none resize-none transition-colors"
              />
            ) : (
              <p className="text-white/50 text-sm">{currentUser?.bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* Experience */}
          <div className="mt-3">
            <label className="text-white/30 text-xs">Experience</label>
            {editMode ? (
              <input
                value={editData.experience}
                onChange={e => setEditData(d => ({ ...d, experience: e.target.value }))}
                placeholder="e.g. 3 years"
                className="w-full mt-1 px-3 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none transition-colors"
              />
            ) : (
              <p className="text-white/70 text-sm mt-0.5">{currentUser?.experience || 'Not specified'}</p>
            )}
          </div>

          {/* Skills */}
          <div className="mt-4">
            <label className="text-white/30 text-xs mb-2 block">Skills</label>
            <div className="flex flex-wrap gap-2">
              {(editMode ? editData.skills : currentUser?.skills || []).map(skill => (
                <span key={skill} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Code className="w-3 h-3" />
                  {skill}
                  {editMode && (
                    <button onClick={() => removeSkill(skill)} className="ml-1 text-emerald-400/60 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {editMode && (
                <div className="flex items-center gap-2">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill..."
                    className="px-3 py-1 rounded-lg text-xs text-white/80 placeholder-white/25 bg-white/5 border border-white/15 focus:border-emerald-500/40 outline-none transition-colors w-28"
                  />
                  <button onClick={addSkill} className="px-2 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">+</button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Performance stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Fix Rate', value: `${fixRate}%`, icon: Target, color: '#10b981' },
          { label: 'Bugs Fixed', value: (stats.fixed || 0) + (stats.completed || 0), icon: CheckCircle, color: '#22c55e' },
          { label: 'Total Assigned', value: stats.assigned || 0, icon: Bug, color: '#6366f1' },
          { label: 'Activities', value: activities.length, icon: Activity, color: '#3b82f6' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{item.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.label}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Achievements
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach) => {
                const isUnlocked = ach.unlocked(stats);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border transition-all ${isUnlocked ? 'border-opacity-30' : 'border-white/5 opacity-40'}`}
                    style={isUnlocked ? { background: `${ach.color}10`, border: `1px solid ${ach.color}30` } : { background: 'rgba(255,255,255,0.02)' }}
                  >
                    <ach.icon className="w-5 h-5 mb-2" style={{ color: isUnlocked ? ach.color : '#ffffff30' }} />
                    <p className={`text-xs font-medium ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{ach.label}</p>
                    <p className="text-white/30 text-xs mt-0.5">{ach.desc}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Activity summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard className="p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Performance Summary
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Completion Rate', value: fixRate, color: '#10b981' },
                {
                  label: 'In Progress',
                  value: stats.assigned > 0 ? Math.round((stats.inProgress / stats.assigned) * 100) : 0,
                  color: '#f59e0b',
                },
                {
                  label: 'Ready for Testing',
                  value: stats.assigned > 0 ? Math.round((stats.readyForTesting / stats.assigned) * 100) : 0,
                  color: '#3b82f6',
                },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/50">{item.label}</span>
                    <span className="text-white/40">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs mb-3">Recent Completed Bugs</p>
              {recentBugs.length === 0 ? (
                <p className="text-white/20 text-xs">No completed bugs yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentBugs.map(bug => (
                    <div key={bug.id} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <p className="text-white/60 text-xs truncate">{bug.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
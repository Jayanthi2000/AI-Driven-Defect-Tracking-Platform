// BugDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bug, AlertCircle, Clock, CheckCircle, FlaskConical, Send,
  Play, Pause, MessageSquare, FileText, Calendar, User, Tag, Monitor,
  RefreshCw, ChevronDown, ChevronUp, Paperclip
} from 'lucide-react';
import {
  getCurrentUser, getBugById, updateBug, addActivity, addNotification,
  getUsers, BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY, initializeDemoData
} from '../services/developerService';
import ScreenshotViewer from '../../tester/components/shared/ScreenshotViewer';

const priorityColors = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' };
const statusColors = {
  ASSIGNED: '#6366f1', IN_PROGRESS: '#f59e0b', FIXED: '#10b981',
  READY_FOR_TESTING: '#3b82f6', COMPLETED: '#22c55e', REOPENED: '#ef4444',
};
const severityColors = { MINOR: '#22c55e', MAJOR: '#f97316', CRITICAL: '#ef4444', BLOCKER: '#dc2626' };

const Badge = ({ value, colors, large }) => (
  <span
    className={`rounded-lg font-medium ${large ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}
    style={{ background: `${colors[value]}20`, color: colors[value], border: `1px solid ${colors[value]}30` }}
  >
    {value?.replace(/_/g, ' ')}
  </span>
);

const GlassCard = ({ children, className = '' }) => (
  <div className={`rounded-2xl ${className}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
    {children}
  </div>
);

const BugDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState('');
  const [fixNotes, setFixNotes] = useState('');
  const [showFixNotes, setShowFixNotes] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    setCurrentUser(user);
    setUsers(getUsers());
    const foundBug = getBugById(id);
    if (foundBug) {
      setBug(foundBug);
      setFixNotes(foundBug.fixNotes || '');
    }
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const notifyAdminAndTester = (action, message) => {
    const adminUser = users.find(u => u.role === 'admin');
    const testerUser = users.find(u => u.id === bug.assignedTester);
    if (adminUser) {
      addNotification({
        recipientId: adminUser.id,
        title: `Developer ${action}`,
        message: `${currentUser?.name}: ${message} — ${bug.title}`,
        type: 'developer_action',
        bugId: bug.id,
      });
    }
    if (testerUser) {
      addNotification({
        recipientId: testerUser.id,
        title: `Developer ${action}`,
        message: `${currentUser?.name}: ${message} — ${bug.title}`,
        type: 'developer_action',
        bugId: bug.id,
      });
    }
  };

  const addTimelineEntry = (action) => {
    const entry = {
      id: `tl_${Date.now()}`,
      action,
      userId: currentUser?.id,
      userName: currentUser?.name,
      timestamp: new Date().toISOString(),
    };
    return [...(bug.timeline || []), entry];
  };

  const handleStartProgress = () => {
    if (bug.status !== BUG_STATUS.ASSIGNED) return;
    setLoading(true);
    const timeline = addTimelineEntry('Started working on this bug');
    const updated = updateBug(bug.id, { status: BUG_STATUS.IN_PROGRESS, timeline });
    setBug(updated);
    addActivity({ userId: currentUser.id, action: 'Started Bug', details: bug.title, bugId: bug.id });
    notifyAdminAndTester('Started Work', 'started working on bug');
    setLoading(false);
    showToast('Started working on bug!');
  };

  const handlePauseProgress = () => {
    if (bug.status !== BUG_STATUS.IN_PROGRESS) return;
    const timeline = addTimelineEntry('Paused work on this bug');
    const updated = updateBug(bug.id, { status: BUG_STATUS.ASSIGNED, timeline });
    setBug(updated);
    addActivity({ userId: currentUser.id, action: 'Paused Bug', details: bug.title, bugId: bug.id });
    showToast('Bug paused', 'warning');
  };

  const handleMarkFixed = () => {
    if (!fixNotes.trim()) { showToast('Please add fix notes before marking as fixed', 'error'); setShowFixNotes(true); return; }
    const timeline = addTimelineEntry('Marked bug as fixed');
    const updated = updateBug(bug.id, { status: BUG_STATUS.FIXED, fixNotes, timeline });
    setBug(updated);
    addActivity({ userId: currentUser.id, action: 'Fixed Bug', details: bug.title, bugId: bug.id });
    notifyAdminAndTester('Fixed Bug', 'fixed the bug');
    showToast('Bug marked as fixed!');
  };

  const handleSendForTesting = () => {
    if (bug.status !== BUG_STATUS.FIXED) { showToast('Bug must be marked as fixed first', 'error'); return; }
    const timeline = addTimelineEntry('Sent bug for testing');
    const updated = updateBug(bug.id, { status: BUG_STATUS.READY_FOR_TESTING, timeline });
    setBug(updated);
    addActivity({ userId: currentUser.id, action: 'Sent For Testing', details: bug.title, bugId: bug.id });
    notifyAdminAndTester('Sent For Testing', 'sent bug for testing');
    showToast('Bug sent for testing!');
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser?.id,
      userName: currentUser?.name,
      text: comment,
      timestamp: new Date().toISOString(),
    };
    const updatedComments = [...(bug.comments || []), newComment];
    const timeline = addTimelineEntry('Added a comment');
    const updated = updateBug(bug.id, { comments: updatedComments, timeline });
    setBug(updated);
    addActivity({ userId: currentUser.id, action: 'Added Comment', details: bug.title, bugId: bug.id });
    notifyAdminAndTester('Added Comment', 'added a comment');
    setComment('');
    showToast('Comment added!');
  };

  const handleSaveFixNotes = () => {
    const updated = updateBug(bug.id, { fixNotes });
    setBug(updated);
    addActivity({ userId: currentUser.id, action: 'Updated Fix Notes', details: bug.title, bugId: bug.id });
    showToast('Fix notes saved!');
  };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!bug) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-white/30 text-center">
        <Bug className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p>Bug not found</p>
        <button onClick={() => navigate('/developer/my-bugs')} className="mt-3 text-emerald-400 text-sm hover:underline">Back to My Bugs</button>
      </div>
    </div>
  );

  const statusFlow = [BUG_STATUS.ASSIGNED, BUG_STATUS.IN_PROGRESS, BUG_STATUS.FIXED, BUG_STATUS.READY_FOR_TESTING];
  const currentStatusIdx = statusFlow.indexOf(bug.status);

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl"
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.2)' : toast.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)'}`,
              color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#f59e0b',
              backdropFilter: 'blur(20px)',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => navigate('/developer/my-bugs')} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 border border-white/10 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-white/30 text-xs font-mono">{bug.id}</span>
            <Badge value={bug.status} colors={statusColors} large />
            <Badge value={bug.priority} colors={priorityColors} />
            <Badge value={bug.severity} colors={severityColors} />
          </div>
          <h1 className="text-lg font-bold text-white">{bug.title}</h1>
        </div>
      </motion.div>

      {/* Status Workflow */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-4">
          <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Bug Workflow</p>
          <div className="flex items-center gap-2">
            {statusFlow.map((status, idx) => (
              <React.Fragment key={status}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${idx <= currentStatusIdx ? 'text-white' : 'text-white/30'}`}
                  style={{
                    background: idx <= currentStatusIdx ? `${statusColors[status]}20` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${idx <= currentStatusIdx ? statusColors[status] + '40' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {idx < currentStatusIdx ? <CheckCircle className="w-3 h-3" style={{ color: statusColors[status] }} /> : idx === currentStatusIdx ? <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: statusColors[status] }} /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                  {status.replace(/_/g, ' ')}
                </div>
                {idx < statusFlow.length - 1 && <div className="flex-1 h-px" style={{ background: idx < currentStatusIdx ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)' }} />}
              </React.Fragment>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard className="p-5">
              <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3">Description</h3>
              <p className="text-white/70 text-sm leading-relaxed">{bug.description}</p>
            </GlassCard>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-5">
              <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3">Actions</h3>
              <div className="flex flex-wrap gap-2">
                {bug.status === BUG_STATUS.ASSIGNED && (
                  <button onClick={handleStartProgress} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
                    <Play className="w-3.5 h-3.5" /> Start Progress
                  </button>
                )}
                {bug.status === BUG_STATUS.IN_PROGRESS && (
                  <>
                    <button onClick={handlePauseProgress} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all">
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </button>
                    <button onClick={handleMarkFixed} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Fixed
                    </button>
                  </>
                )}
                {bug.status === BUG_STATUS.FIXED && (
                  <button onClick={handleSendForTesting} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all">
                    <Send className="w-3.5 h-3.5" /> Send For Testing
                  </button>
                )}
                <button onClick={() => setShowFixNotes(!showFixNotes)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all">
                  <FileText className="w-3.5 h-3.5" /> Fix Notes
                </button>
              </div>

              <AnimatePresence>
                {showFixNotes && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <label className="text-white/40 text-xs block mb-2">Fix Notes</label>
                      <textarea
                        value={fixNotes}
                        onChange={e => setFixNotes(e.target.value)}
                        placeholder="Describe your fix, root cause, and changes made..."
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none transition-colors resize-none"
                      />
                      <button onClick={handleSaveFixNotes} className="mt-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
                        Save Fix Notes
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>

          {/* Fix Notes Display */}
          {bug.fixNotes && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <GlassCard className="p-5">
                <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Fix Notes
                </h3>
                <p className="text-emerald-300/80 text-sm leading-relaxed p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  {bug.fixNotes}
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* Screenshot */}
          {bug.screenshot && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <ScreenshotViewer screenshot={bug.screenshot} />
            </motion.div>
          )}

          {/* Comments */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="p-5">
              <h3 className="text-white/60 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Comments ({(bug.comments || []).length})
              </h3>
              <div className="space-y-3 mb-4">
                {(bug.comments || []).length === 0 ? (
                  <p className="text-white/20 text-sm">No comments yet.</p>
                ) : (
                  bug.comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                        {c.userName?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/70 text-xs font-medium">{c.userName}</span>
                          <span className="text-white/30 text-xs">{timeAgo(c.timestamp)}</span>
                        </div>
                        <p className="text-white/60 text-sm p-3 rounded-xl bg-white/5 border border-white/10">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none transition-colors resize-none"
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddComment(); }}
                />
                <button onClick={handleAddComment} disabled={!comment.trim()} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all self-end">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right: Meta + Timeline */}
        <div className="space-y-4">
          {/* Bug Info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-5">
              <h3 className="text-white/60 text-xs uppercase tracking-widest mb-4">Bug Information</h3>
              <div className="space-y-3">
                {[
                  { icon: Tag, label: 'Module', value: bug.module },
                  { icon: Monitor, label: 'Environment', value: bug.environment },
                  { icon: User, label: 'Assigned Tester', value: users.find(u => u.id === bug.assignedTester)?.name || 'Unassigned' },
                  { icon: User, label: 'Assigned Admin', value: users.find(u => u.id === bug.assignedAdmin || u.role === 'admin')?.name || 'Admin' },
                  { icon: Calendar, label: 'Created', value: formatDate(bug.createdAt) },
                  { icon: RefreshCw, label: 'Updated', value: formatDate(bug.updatedAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/30 text-xs">{label}</p>
                      <p className="text-white/70 text-xs font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Attachments placeholder */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard className="p-5">
              <h3 className="text-white/60 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5" /> Attachments
              </h3>
              <div className="rounded-xl border-2 border-dashed border-white/10 p-4 text-center">
                <Paperclip className="w-5 h-5 text-white/20 mx-auto mb-1" />
                <p className="text-white/20 text-xs">No attachments</p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="p-5">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="w-full flex items-center justify-between mb-3 text-white/60 text-xs uppercase tracking-widest hover:text-white/80 transition-colors"
              >
                Timeline ({(bug.timeline || []).length})
                {showTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <AnimatePresence>
                {showTimeline && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    {(bug.timeline || []).length === 0 ? (
                      <p className="text-white/20 text-xs">No timeline entries yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {[...bug.timeline].reverse().map((entry, i) => (
                          <div key={entry.id} className="flex gap-2">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-400/60 mt-1 flex-shrink-0" />
                              {i < bug.timeline.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                            </div>
                            <div className="pb-2 flex-1 min-w-0">
                              <p className="text-white/60 text-xs">{entry.action}</p>
                              <p className="text-white/25 text-xs">{entry.userName} · {timeAgo(entry.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BugDetailsPage;
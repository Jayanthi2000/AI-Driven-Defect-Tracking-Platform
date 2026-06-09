// BugDetailsPage.jsx - Tester Module
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bug, MessageSquare, CheckCircle, XCircle,
  RotateCcw, FlaskConical, Send, Calendar, User, Monitor,
  Tag, ChevronDown, ChevronUp, Clock, FileText
} from 'lucide-react';
import {
  getCurrentUser, getBugById, getUsers, addComment
} from '../../services/testerService';
import ScreenshotViewer from '../shared/ScreenshotViewer';
import {
  retestBug, approveFix, rejectFix, closeBug, reopenBug,
  BUG_STATUS, STATUS_COLORS, SEVERITY_COLORS, PRIORITY_COLORS
} from '../../services/bugWorkflowService';
import { getActivitiesByBug } from '../../services/activityService';
import {
  GlassCard, StatusBadge, SeverityBadge, PriorityBadge, TimeAgo
} from '../shared/SharedComponents';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: 'easeOut' },
});

// Which actions are available per status for a tester
const TESTER_ACTIONS = {
  [BUG_STATUS.READY_FOR_TESTING]: ['retest'],
  [BUG_STATUS.TESTER_REVIEW]:     ['approve', 'reject'],
  [BUG_STATUS.APPROVED]:          ['close'],
  [BUG_STATUS.FIXED]:             ['retest'],
  [BUG_STATUS.CLOSED]:            ['reopen'],
  [BUG_STATUS.REJECTED]:          ['reopen'],
};

export default function BugDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug]           = useState(null);
  const [user, setUser]         = useState(null);
  const [users, setUsers]       = useState([]);
  const [activities, setActs]   = useState([]);
  const [comment, setComment]   = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showTimeline, setShowTimeline] = useState(true);
  const [showActionModal, setShowActionModal] = useState(null); // 'approve'|'reject'|'reopen'|'retest'|'close'
  const [toast, setToast]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const refresh = () => {
    const b = getBugById(id);
    if (b) {
      setBug(b);
      setActs(getActivitiesByBug(id));
    }
  };

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setUsers(getUsers());
    refresh();
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (action) => {
    if (!user || !bug) return;
    setLoading(true);
    try {
      switch (action) {
        case 'retest':
          retestBug(bug.id, user, reviewNotes);
          showToast('Retest marked — bug moved to Tester Review');
          break;
        case 'approve':
          approveFix(bug.id, user, reviewNotes);
          showToast('Fix approved!');
          break;
        case 'reject':
          rejectFix(bug.id, user, reviewNotes);
          showToast('Fix rejected', 'warning');
          break;
        case 'close':
          closeBug(bug.id, user);
          showToast('Bug closed successfully');
          break;
        case 'reopen':
          reopenBug(bug.id, user, reopenReason);
          showToast('Bug reopened', 'warning');
          break;
      }
      refresh();
    } finally {
      setLoading(false);
      setShowActionModal(null);
      setReviewNotes('');
      setReopenReason('');
    }
  };

  const handleAddComment = () => {
    if (!comment.trim() || !user) return;
    addComment(bug.id, comment, user.id);
    setComment('');
    showToast('Comment added');
    refresh();
  };

  const getUserName = (uid) => users.find(u => u.id === uid)?.name || 'Unknown';

  const availableActions = bug ? (TESTER_ACTIONS[bug.status] || []) : [];

  const formatDate = (ts) => ts
    ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  if (!bug) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center text-gray-600">
        <Bug size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">Bug not found</p>
        <button onClick={() => navigate('/tester/my-bugs')} className="mt-2 text-emerald-400 text-sm hover:underline">
          Back to My Bugs
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-5xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl"
            style={{
              background: toast.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
              color: toast.type === 'success' ? '#10b981' : '#f59e0b',
              backdropFilter: 'blur(20px)',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setShowActionModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/3 z-50 max-w-md mx-auto rounded-2xl p-5"
              style={{ background: 'rgba(15,15,15,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <h3 className="text-white font-semibold text-sm mb-1 capitalize">{showActionModal} Bug</h3>
              <p className="text-gray-500 text-xs mb-4">"{bug.title}"</p>

              {['approve', 'reject', 'retest'].includes(showActionModal) && (
                <div className="mb-4">
                  <label className="text-gray-400 text-xs mb-1.5 block">
                    {showActionModal === 'retest' ? 'Retest notes (optional)' : showActionModal === 'reject' ? 'Rejection reason *' : 'Review notes (optional)'}
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder={showActionModal === 'reject' ? 'Describe why the fix is rejected...' : 'Add any notes...'}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none resize-none transition-colors"
                  />
                </div>
              )}

              {showActionModal === 'reopen' && (
                <div className="mb-4">
                  <label className="text-gray-400 text-xs mb-1.5 block">Reason for reopening</label>
                  <textarea
                    value={reopenReason}
                    onChange={e => setReopenReason(e.target.value)}
                    placeholder="Why is this bug being reopened?"
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none resize-none transition-colors"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(showActionModal)}
                  disabled={loading || (showActionModal === 'reject' && !reviewNotes.trim())}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    showActionModal === 'reject' || showActionModal === 'reopen'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                  }`}
                >
                  {loading ? 'Processing...' : `Confirm ${showActionModal}`}
                </button>
                <button
                  onClick={() => setShowActionModal(null)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex items-start gap-3">
        <button
          onClick={() => navigate('/tester/my-bugs')}
          className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 border border-white/10 transition-all flex-shrink-0 mt-0.5"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-gray-600 text-xs font-mono">{bug.id}</span>
            <StatusBadge status={bug.status} />
            <SeverityBadge severity={bug.severity} />
            {bug.priority && <PriorityBadge priority={bug.priority} />}
          </div>
          <h1 className="text-lg font-bold text-white leading-snug">{bug.title}</h1>
        </div>
      </motion.div>

      {/* Tester Actions */}
      {availableActions.length > 0 && (
        <motion.div {...fadeUp(0.1)}>
          <GlassCard className="p-4">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Tester Actions</p>
            <div className="flex flex-wrap gap-2">
              {availableActions.includes('retest') && (
                <button
                  onClick={() => setShowActionModal('retest')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/25 transition-all"
                >
                  <FlaskConical size={14} /> Mark Retested
                </button>
              )}
              {availableActions.includes('approve') && (
                <button
                  onClick={() => setShowActionModal('approve')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all"
                >
                  <CheckCircle size={14} /> Approve Fix
                </button>
              )}
              {availableActions.includes('reject') && (
                <button
                  onClick={() => setShowActionModal('reject')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-all"
                >
                  <XCircle size={14} /> Reject Fix
                </button>
              )}
              {availableActions.includes('close') && (
                <button
                  onClick={() => setShowActionModal('close')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-500/15 text-gray-400 border border-gray-500/25 hover:bg-gray-500/25 transition-all"
                >
                  <CheckCircle size={14} /> Close Bug
                </button>
              )}
              {availableActions.includes('reopen') && (
                <button
                  onClick={() => setShowActionModal('reopen')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-all"
                >
                  <RotateCcw size={14} /> Reopen Bug
                </button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          <motion.div {...fadeUp(0.15)}>
            <GlassCard className="p-5">
              <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-3">Description</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{bug.description}</p>
            </GlassCard>
          </motion.div>

          {/* Fix Notes (if available) */}
          {bug.fixNotes && (
            <motion.div {...fadeUp(0.2)}>
              <GlassCard className="p-5">
                <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText size={13} /> Developer Fix Notes
                </h3>
                <p className="text-emerald-300/80 text-sm leading-relaxed p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  {bug.fixNotes}
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* Review Notes (if available) */}
          {bug.reviewNotes && (
            <motion.div {...fadeUp(0.22)}>
              <GlassCard className="p-5">
                <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText size={13} /> Tester Review Notes
                </h3>
                <p className="text-blue-300/80 text-sm leading-relaxed p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  {bug.reviewNotes}
                </p>
              </GlassCard>
            </motion.div>
          )}

          {/* Screenshot */}
          {bug.screenshot && (
            <motion.div {...fadeUp(0.24)}>
              <ScreenshotViewer screenshot={bug.screenshot} />
            </motion.div>
          )}

          {/* Comments */}
          <motion.div {...fadeUp(0.25)}>
            <GlassCard className="p-5">
              <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={13} /> Comments ({(bug.comments || []).length})
              </h3>
              <div className="space-y-3 mb-4">
                {(bug.comments || []).length === 0 ? (
                  <p className="text-gray-600 text-sm">No comments yet.</p>
                ) : (
                  bug.comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                        {getUserName(c.userId)?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/70 text-xs font-medium">{getUserName(c.userId)}</span>
                          <span className="text-gray-600 text-xs"><TimeAgo date={c.createdAt} /></span>
                        </div>
                        <p className="text-gray-400 text-sm p-3 rounded-xl bg-white/[0.03] border border-white/8">{c.text}</p>
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
                  className="flex-1 px-3 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none resize-none transition-colors"
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAddComment(); }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all self-end"
                >
                  <Send size={14} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right: Meta + Timeline */}
        <div className="space-y-4">
          {/* Bug Info */}
          <motion.div {...fadeUp(0.2)}>
            <GlassCard className="p-5">
              <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4">Bug Details</h3>
              <div className="space-y-3">
                {[
                  { icon: Tag,      label: 'Module',      value: bug.module || 'N/A' },
                  { icon: Monitor,  label: 'Environment', value: bug.environment || 'N/A' },
                  { icon: User,     label: 'Assigned Dev',value: getUserName(bug.assignedDeveloperId) },
                  { icon: User,     label: 'Reported By', value: getUserName(bug.reporterId) },
                  { icon: Calendar, label: 'Created',     value: formatDate(bug.createdAt) },
                  { icon: Clock,    label: 'Updated',     value: formatDate(bug.updatedAt) },
                  ...(bug.closedAt  ? [{ icon: CheckCircle, label: 'Closed',   value: formatDate(bug.closedAt) }] : []),
                  ...(bug.approvedAt? [{ icon: CheckCircle, label: 'Approved', value: formatDate(bug.approvedAt) }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={13} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-xs">{label}</p>
                      <p className="text-gray-300 text-xs font-medium mt-0.5 break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Timeline */}
          <motion.div {...fadeUp(0.25)}>
            <GlassCard className="p-5">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="w-full flex items-center justify-between text-gray-500 text-xs uppercase tracking-widest hover:text-gray-300 transition-colors mb-3"
              >
                Activity Timeline ({activities.length})
                {showTimeline ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              <AnimatePresence>
                {showTimeline && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    {activities.length === 0 ? (
                      <p className="text-gray-600 text-xs">No timeline entries yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {activities.map((act, i) => (
                          <div key={act.id} className="flex gap-2.5">
                            <div className="flex flex-col items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1 flex-shrink-0" />
                              {i < activities.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1" />}
                            </div>
                            <div className="pb-2 flex-1 min-w-0">
                              <p className="text-gray-400 text-xs">{act.type?.replace(/_/g, ' ')}</p>
                              <p className="text-gray-600 text-xs">{act.userName} · <TimeAgo date={act.createdAt} /></p>
                              {act.details && <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{act.details}</p>}
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
}
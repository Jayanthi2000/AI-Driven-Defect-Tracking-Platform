// ─── DefectAI Notifications Page ─────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { PageHeader, GhostButton, PrimaryButton, EmptyState } from '../components/ui.jsx';

const TYPE_CONFIG = {
  user_created: { color: '#22c55e', bg: '#22c55e15', label: 'User Created', icon: '👤' },
  user_deleted: { color: '#ef4444', bg: '#ef444415', label: 'User Deleted', icon: '🗑️' },
  user_updated: { color: '#14b8a6', bg: '#14b8a615', label: 'User Updated', icon: '✏️' },
  ticket_created: { color: '#f59e0b', bg: '#f59e0b15', label: 'Ticket Created', icon: '🎫' },
  ticket_closed: { color: '#22c55e', bg: '#22c55e15', label: 'Ticket Closed', icon: '✅' },
  default: { color: '#9ca3af', bg: '#9ca3af15', label: 'Notification', icon: '🔔' },
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} minute${m > 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearAllNotifications, unreadCount } = useAdmin();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread · ${notifications.length} total`}
        action={
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <GhostButton onClick={markAllNotificationsRead} size="sm">
                Mark all read
              </GhostButton>
            )}
            {notifications.length > 0 && (
              <GhostButton onClick={clearAllNotifications} size="sm" variant="danger">
                Clear all
              </GhostButton>
            )}
          </div>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[#0a0f1c]/60 rounded-xl border border-white/5 w-fit">
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
                : 'text-[#6b7280] hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          description={filter === 'unread' ? 'You\'re all caught up!' : 'Nothing to show here'}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((n, i) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    !n.read
                      ? 'bg-[#0a0f1c]/80 border-white/10'
                      : 'bg-[#0a0f1c]/40 border-white/5 opacity-70'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                    style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.color}25` }}
                  >
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-[#9ca3af]'}`}>
                          {n.title}
                          {!n.read && (
                            <span
                              className="ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle"
                              style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }}
                            />
                          )}
                        </p>
                        <p className="text-sm text-[#6b7280] mt-0.5">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            className="text-[10px] text-[#22c55e] hover:text-[#22c55e]/80 px-2 py-1 rounded border border-[#22c55e]/20 hover:bg-[#22c55e]/5 transition-all"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#4b5563] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}25` }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[11px] text-[#4b5563]">{timeAgo(n.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
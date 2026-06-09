import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import { addNotification } from '../../services/adminStorage';

// ── Icons ─────────────────────────────────────────────────────
const BellIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const XIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const UserPlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const TicketIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
  </svg>
);

// ── Type config ────────────────────────────────────────────────
const TYPE_CONFIG = {
  user_created:  { label: 'User Created',  color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   icon: <UserPlusIcon /> },
  user_deleted:  { label: 'User Deleted',  color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   icon: <TrashIcon /> },
  user_updated:  { label: 'User Updated',  color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  icon: <UserPlusIcon /> },
  ticket_created:{ label: 'Ticket Created',color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  icon: <TicketIcon /> },
  ticket_closed: { label: 'Ticket Closed', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   icon: <CheckIcon /> },
  system:        { label: 'System',        color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  icon: <AlertIcon /> },
  default:       { label: 'Info',          color: '#9ca3af', bg: 'rgba(156,163,175,0.08)', icon: <BellIcon /> },
};

const typeOf = (n) => TYPE_CONFIG[n.type] || TYPE_CONFIG.default;

const FILTERS = ['all', 'unread', 'user_created', 'user_deleted', 'ticket_created', 'ticket_closed', 'system'];
const FILTER_LABELS = {
  all: 'All',
  unread: 'Unread',
  user_created: 'User Created',
  user_deleted: 'Deleted',
  ticket_created: 'Tickets',
  ticket_closed: 'Resolved',
  system: 'System',
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications,
  } = useAdmin();

  const [filter, setFilter] = useState('all');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  // ── Seed a test notification ──────────────────────────────
  const addTestNotif = () => {
    const types = ['user_created','user_deleted','ticket_created','ticket_closed','system'];
    const messages = [
      { type:'user_created', title:'New Developer Added', message:'Alex Kim joined as a developer.' },
      { type:'user_deleted', title:'User Removed', message:'Priya Sharma was removed from the workspace.' },
      { type:'ticket_created', title:'New Ticket #BUG-042', message:'Critical: Auth token expires prematurely.' },
      { type:'ticket_closed', title:'Ticket Resolved', message:'BUG-038 has been marked as resolved.' },
      { type:'system', title:'System Health', message:'All services operational. Uptime 99.98%.' },
    ];
    const pick = messages[Math.floor(Math.random() * messages.length)];
    addNotification(pick);
    refreshNotifications();
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter !== 'all') return n.type === filter;
    return true;
  }).filter((n) =>
    search === '' ||
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.message?.toLowerCase().includes(search.toLowerCase())
  );

  const unreadFiltered = filtered.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 md:px-8">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e]">
                <BellIcon size={15} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#22c55e] text-black text-xs font-bold shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-[#6b7280] text-sm ml-11">
              {notifications.length === 0 ? 'No notifications yet' : `${notifications.length} total · ${unreadCount} unread`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={addTestNotif}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 text-xs transition-all"
            >
              + Add test
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/10 text-xs transition-all"
              >
                <CheckIcon size={12} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-[#9ca3af] hover:text-[#ef4444] hover:border-[#ef4444]/30 text-xs transition-all"
              >
                <TrashIcon size={12} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications…"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#22c55e]/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white">
                <XIcon size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <FilterIcon />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e]'
                    : 'border border-white/[0.08] text-[#9ca3af] hover:text-white hover:border-white/20'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        {notifications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: notifications.length, color: '#9ca3af' },
              { label: 'Unread', value: unreadCount, color: '#22c55e' },
              { label: 'Tickets', value: notifications.filter(n => n.type?.startsWith('ticket')).length, color: '#f59e0b' },
              { label: 'User Events', value: notifications.filter(n => n.type?.startsWith('user')).length, color: '#14b8a6' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="text-[11px] text-[#6b7280] mb-1">{s.label}</p>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Notification list */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#4b5563]">
                <BellIcon size={22} />
              </div>
              <div className="text-center">
                <p className="text-[#9ca3af] font-medium text-sm">No notifications found</p>
                <p className="text-[#4b5563] text-xs mt-1">
                  {search ? 'Try a different search term' : filter !== 'all' ? 'No notifications in this category' : 'You\'re all caught up!'}
                </p>
              </div>
              <button
                onClick={addTestNotif}
                className="px-4 py-2 rounded-xl border border-[#22c55e]/30 text-[#22c55e] text-xs hover:bg-[#22c55e]/10 transition-all"
              >
                Add a test notification
              </button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((n, i) => {
                const cfg = typeOf(n);
                const isSelected = selected === n.id;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.02 }}
                    className={`group relative flex items-start gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 cursor-pointer transition-colors ${
                      !n.read ? 'bg-[#22c55e]/[0.02]' : ''
                    } hover:bg-white/[0.03]`}
                    onClick={() => {
                      setSelected(isSelected ? null : n.id);
                      if (!n.read) markNotificationRead(n.id);
                    }}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                    )}

                    {/* Icon */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}
                    >
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-medium leading-tight ${!n.read ? 'text-white' : 'text-[#d1d5db]'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-[#6b7280] mt-0.5 leading-snug">{n.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-[#4b5563] whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                            className="opacity-0 group-hover:opacity-100 text-[#4b5563] hover:text-[#ef4444] transition-all"
                          >
                            <XIcon />
                          </button>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-3">
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{ background: cfg.bg, color: cfg.color }}
                              >
                                {cfg.label}
                              </span>
                              <span className="text-[11px] text-[#4b5563]">
                                {new Date(n.createdAt).toLocaleString()}
                              </span>
                              {!n.read && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); markNotificationRead(n.id); }}
                                  className="ml-auto text-[11px] text-[#22c55e] hover:text-[#22c55e]/80 flex items-center gap-1"
                                >
                                  <CheckIcon size={10} /> Mark read
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-center text-xs text-[#374151] mt-4">
            Showing {filtered.length} of {notifications.length} notifications
          </p>
        )}
      </div>
    </div>
  );
}
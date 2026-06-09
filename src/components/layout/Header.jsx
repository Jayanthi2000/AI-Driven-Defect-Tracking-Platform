import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Command } from 'lucide-react';
import { getStore, setStore } from '../../data/store';
import { Avatar } from '../ui/Avatar';

export function Header({ onCommandPalette, title, subtitle }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifs = getStore('notifications');
  const unread = notifs.filter(n => !n.read).length;

  const markRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setStore('notifications', updated);
    setNotifOpen(false);
  };

  const notifIcon = { bug: '🐛', team: '👥', ai: '🤖', system: '⚙️' };

  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', borderBottom: '1px solid var(--border)',
      background: 'rgba(13,17,23,0.8)', backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
    }}>
      <div>
        {title && <h1 className="font-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h1>}
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onCommandPalette} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)' }}>
          <Search size={14} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Search
            <kbd style={{ fontSize: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', marginLeft: 4 }}>⌘K</kbd>
          </span>
        </button>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{
            position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '6px 8px', borderRadius: 8,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, background: 'var(--accent)', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity: 0, y: 4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.97 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, width: 340,
                  background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
                  borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 100,
                  marginTop: 6,
                }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Notifications</span>
                  <button onClick={markRead} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12 }}>Mark all read</button>
                </div>
                {notifs.slice(0, 5).map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: n.read ? 'transparent' : 'rgba(59,130,246,0.04)',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: 18 }}>{notifIcon[n.type]}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                    </div>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', marginTop: 4, flexShrink: 0 }} />}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Avatar initials="RS" size={32} status="online" />
      </div>
    </header>
  );
}
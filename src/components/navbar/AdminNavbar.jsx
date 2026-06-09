// ─── DefectAI Admin Navbar ────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from "../../context/AdminContext";
import { useAuth } from "../../context/AuthContext";
import {
  getCurrentUser,
  saveCurrentUser,
  addActivity,
} from "../../services/adminStorage";

const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.09 12.26a1 1 0 0 0 .78 1.64l5.13-.01L11 22l8.91-10.26a1 1 0 0 0-.78-1.64l-5.13.01L13 2Z" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        textDecoration: 'none',
        color: active ? '#22c55e' : '#64748b',
        background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
        border: active ? '1px solid rgba(34,197,94,0.18)' : '1px solid transparent',
        transition: 'all 0.16s',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = '#e2e8f0';
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {label}
    </Link>
  );
};

export default function AdminNavbar() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification, clearAllNotifications } = useAdmin();
  const { logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    addActivity({
      action: 'logout',
      user: currentUser?.name || currentUser?.fullName || 'Admin',
      role: currentUser?.role || 'ADMIN',
      details: 'User logged out',
    });
    logout();
    navigate('/login');
  };

  const initials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'A';

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const notifTypeColor = (type) => {
    const map = {
      user_created: '#22c55e',
      user_deleted: '#ef4444',
      user_updated: '#14b8a6',
      ticket_created: '#f59e0b',
      ticket_closed: '#22c55e',
      default: '#64748b',
    };
    return map[type] || map.default;
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/team-management', label: 'Team' },
    { to: '/admin/notifications', label: 'Notifications' },
    { to: '/admin/settings', label: 'Settings' },
  ];

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    marginTop: 10,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'linear-gradient(145deg, rgba(14,14,22,0.98) 0%, rgba(10,10,16,0.98) 100%)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    boxShadow: '0 0 0 1px rgba(34,197,94,0.06), 0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)',
    overflow: 'hidden',
    zIndex: 60,
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(8,8,14,0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
    }}>
      <div style={{ maxWidth: '100%', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

        {/* Logo */}
        <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'black',
            boxShadow: '0 0 16px rgba(34,197,94,0.35)',
            flexShrink: 0,
          }}>
            <BoltIcon />
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 17, letterSpacing: '-0.03em' }}>
            Defect<span style={{ color: '#22c55e' }}>AI</span>
          </span>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '3px 8px',
            borderRadius: 999,
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e',
            background: 'rgba(34,197,94,0.08)',
            textTransform: 'uppercase',
          }}>
            ADMIN
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }} className="hidden-mobile">
          {navLinks.map((l) => (
            <NavLink key={l.to} {...l} />
          ))}
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
              style={{
                position: 'relative',
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 10,
                background: notifOpen ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
                border: notifOpen ? '1px solid rgba(34,197,94,0.18)' : '1px solid rgba(255,255,255,0.06)',
                color: notifOpen ? '#22c55e' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.16s',
              }}
              onMouseEnter={e => {
                if (!notifOpen) {
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }
              }}
              onMouseLeave={e => {
                if (!notifOpen) {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }
              }}
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -2, right: -2,
                  width: 16, height: 16,
                  background: '#22c55e',
                  color: 'black',
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(34,197,94,0.7)',
                  border: '1.5px solid rgba(8,8,14,0.9)',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: [0.22,1,0.36,1] }}
                  style={{ ...dropdownStyle, width: 320 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.01em' }}>Notifications</span>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsRead} style={{ fontSize: 11, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          Mark all read
                        </button>
                      )}
                      <button onClick={clearAllNotifications} style={{ fontSize: 11, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Clear all
                      </button>
                    </div>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: '#475569' }}>No notifications</div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: !n.read ? 'rgba(34,197,94,0.025)' : 'transparent',
                            transition: 'background 0.15s',
                          }}
                        >
                          <div style={{
                            width: 7, height: 7,
                            borderRadius: '50%',
                            marginTop: 5,
                            flexShrink: 0,
                            background: notifTypeColor(n.type),
                            boxShadow: `0 0 6px ${notifTypeColor(n.type)}60`,
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: !n.read ? 600 : 400, color: !n.read ? '#e2e8f0' : '#64748b', margin: 0 }}>{n.title}</p>
                            <p style={{ fontSize: 11, color: '#475569', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</p>
                            <p style={{ fontSize: 10, color: '#334155', marginTop: 3 }}>{timeAgo(n.createdAt)}</p>
                          </div>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            style={{ color: '#334155', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0, transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 10 && (
                    <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <Link to="/admin/notifications" onClick={() => setNotifOpen(false)}
                        style={{ fontSize: 12, color: '#22c55e', textDecoration: 'none' }}>
                        View all {notifications.length} notifications →
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', margin: '0 2px' }} />

          {/* Profile */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px 5px 5px',
                borderRadius: 10,
                background: profileOpen ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
                border: profileOpen ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'all 0.16s',
              }}
              onMouseEnter={e => {
                if (!profileOpen) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={e => {
                if (!profileOpen) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }
              }}
            >
              <div style={{
                width: 28, height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'black',
                fontSize: 11, fontWeight: 700,
                boxShadow: '0 0 10px rgba(34,197,94,0.28)',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials(currentUser?.fullName || 'Admin')
                )}
              </div>
              <div style={{ display: 'none' }} className="profile-text">
                <p style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', lineHeight: 1, margin: 0 }}>{currentUser?.fullName || 'Admin'}</p>
                <p style={{ fontSize: 10, color: '#22c55e', marginTop: 2, textTransform: 'capitalize' }}>{currentUser?.role || 'admin'}</p>
              </div>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5"
                style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: [0.22,1,0.36,1] }}
                  style={{ ...dropdownStyle, width: 216 }}
                >
                  {/* Profile header */}
                  <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'black', fontSize: 13, fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {initials(currentUser?.fullName || 'Admin')}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0, letterSpacing: '-0.01em' }}>{currentUser?.fullName || 'Admin'}</p>
                        <p style={{ fontSize: 11, color: '#475569', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    { to: '/admin/profile', label: 'My Profile', icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    )},
                    { to: '/admin/settings', label: 'Settings', icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3"/></svg>
                    )},
                  ].map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px',
                        fontSize: 13, color: '#94a3b8',
                        textDecoration: 'none',
                        transition: 'all 0.14s',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ color: '#475569' }}>{icon}</span>
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px', fontSize: 13,
                      color: '#ef4444', background: 'transparent', border: 'none',
                      cursor: 'pointer', transition: 'all 0.14s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="mobile-only"
            style={{
              width: 36, height: 36,
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#64748b', cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              ) : (
                <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,14,0.98)', overflow: 'hidden' }}
          >
            <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, fontSize: 13, color: '#64748b', textDecoration: 'none', transition: 'all 0.14s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {l.label}
                </Link>
              ))}
              <button onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, fontSize: 13, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', marginTop: 4, transition: 'background 0.14s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

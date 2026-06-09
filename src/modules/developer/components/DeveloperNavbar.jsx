// DeveloperNavbar.jsx — matches AdminNavbar exactly
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import {
  getCurrentUser,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/developerService';

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const routeLabels = {
  '/developer/dashboard': 'Dashboard',
  '/developer/my-bugs':   'My Bugs',
  '/developer/activity':  'Activity',
  '/developer/profile':   'Profile',
};

export default function DeveloperNavbar({ onMobileMenuOpen }) {
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  const currentUser = getCurrentUser();

  const refreshNotifications = () => {
    if (currentUser) setNotifications(getUserNotifications(currentUser.id) || []);
  };

  useEffect(() => {
    refreshNotifications();
    const iv = setInterval(refreshNotifications, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pageTitle   = routeLabels[location.pathname] || 'Developer';

  const handleMarkAllRead = () => {
    if (currentUser) { markAllNotificationsRead(currentUser.id); refreshNotifications(); }
  };

  const handleNotifClick = (notif) => {
    markNotificationRead(notif.id);
    refreshNotifications();
    if (notif.bugId) navigate(`/developer/bug-details/${notif.bugId}`);
    setNotifOpen(false);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'D';

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left — page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-[#9ca3af] hover:text-white rounded-lg hover:bg-white/5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">{pageTitle}</h1>
            <p className="text-[#6b7280] text-xs hidden sm:block">DefectAI Developer Portal</p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#9ca3af] hover:text-white hover:bg-white/5 transition-all"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#22c55e] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#0a0f1c]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-[10px] text-[#22c55e] hover:text-[#22c55e]/80 transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-[#6b7280]">No notifications</div>
                    ) : (
                      notifications.slice(0, 10).map(n => (
                        <button
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors ${!n.read ? 'bg-[#22c55e]/3' : ''}`}
                        >
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#22c55e]" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${!n.read ? 'text-white' : 'text-[#9ca3af]'}`}>{n.title}</p>
                            <p className="text-[11px] text-[#6b7280] mt-0.5 truncate">{n.message}</p>
                            <p className="text-[10px] text-[#4b5563] mt-1">{timeAgo(n.timestamp || n.createdAt)}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#22c55e] to-[#14b8a6] flex items-center justify-center text-black text-xs font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                {initials(currentUser?.name || currentUser?.fullName || 'Developer')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-white leading-none">{(currentUser?.name || currentUser?.fullName || 'Developer').split(' ')[0]}</p>
                <p className="text-[10px] text-[#22c55e] capitalize mt-0.5">Developer</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6b7280]">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#0a0f1c]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs font-semibold text-white">{currentUser?.name || currentUser?.fullName}</p>
                    <p className="text-[11px] text-[#6b7280] truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/developer/profile'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span>👤</span> Profile
                  </button>
                  <div className="border-t border-white/5 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

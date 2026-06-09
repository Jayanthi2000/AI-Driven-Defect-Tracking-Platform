// TesterSidebar.jsx — matches AdminSidebar exactly
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  {
    label: 'Main',
    items: [
      { to: '/tester/dashboard', label: 'Dashboard', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      )},
      { to: '/tester/report-bug', label: 'Report Bug', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      )},
      { to: '/tester/my-bugs', label: 'My Bugs', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 2l1.88 1.88M16 2l-1.88 1.88M12 11v-1M12 18v-1"/>
          <path d="M2 13h2M20 13h2M5 7l1.5 1.5M18.5 8.5L17 7M5 19l1.5-1.5M18.5 17.5L17 19"/>
          <path d="M9 1h6v1a3 3 0 0 1-6 0V1z"/><rect x="6" y="11" width="12" height="9" rx="6"/>
        </svg>
      )},
      { to: '/tester/activity', label: 'Activity', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      )},
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/tester/profile', label: 'Profile', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )},
    ],
  },
];

export default function TesterSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const onToggle = () => setCollapsed(p => !p);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: '100%',
        background: 'rgba(5,8,22,0.85)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'sticky',
        top: 64,
        alignSelf: 'flex-start',
        maxHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Toggle button */}
      <div style={{ padding: '12px 12px 4px', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <button
          onClick={onToggle}
          style={{
            width: 28, height: 28,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s' }}>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 10px 16px' }}>
        {NAV_ITEMS.map((group) => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                color: '#22c55e', textTransform: 'uppercase',
                padding: '0 6px', marginBottom: 6, opacity: 0.7,
              }}>
                {group.label}
              </div>
            )}
            {collapsed && <div style={{ height: 8 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => {
                const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: collapsed ? '9px' : '8px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      color: active ? '#22c55e' : '#94a3b8',
                      background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
                      border: active ? '1px solid rgba(34,197,94,0.15)' : '1px solid transparent',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      if (!active) { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }
                    }}
                    onMouseLeave={e => {
                      if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }
                    }}
                  >
                    <span style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }}>{item.icon}</span>
                    {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                    {!collapsed && active && (
                      <span style={{
                        marginLeft: 'auto', width: 6, height: 6,
                        borderRadius: '50%', background: '#22c55e',
                        boxShadow: '0 0 6px rgba(34,197,94,0.8)',
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}

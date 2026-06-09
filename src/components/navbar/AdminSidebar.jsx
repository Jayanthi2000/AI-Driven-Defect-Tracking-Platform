import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  {
    label: 'Main',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      )},
      { to: '/admin/bugs', label: 'Bug Management', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 1h6v1a3 3 0 0 1-6 0V1z"/><rect x="6" y="11" width="12" height="9" rx="6"/>
          <path d="M2 13h2M20 13h2M5 7l1.5 1.5M17 7l-1.5 1.5M5 19l1.5-1.5M17 19l-1.5-1.5"/>
        </svg>
      )},
      { to: '/admin/analytics', label: 'Analytics', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 20V10M12 20V4M6 20v-6"/>
        </svg>
      )},
      { to: '/admin/ai-analysis', label: 'AI Analysis', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L15 22H9l-.3-7C6.7 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/>
          <line x1="9" y1="22" x2="15" y2="22"/>
        </svg>
      )},
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/admin/team-management', label: 'Team', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )},
      { to: '/admin/workflow', label: 'Workflow', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/>
          <path d="M12 8v3M5 16V11.5A3.5 3.5 0 0 1 8.5 8H12M19 16V11.5A3.5 3.5 0 0 0 15.5 8H12"/>
        </svg>
      )},
      { to: '/admin/reports', label: 'Reports', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )},
      { to: '/admin/team-chat', label: 'Team Chat', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )},
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/admin/notifications', label: 'Notifications', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      )},
      { to: '/admin/profile', label: 'Profile', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )},
      { to: '/admin/settings', label: 'Settings', icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
        </svg>
      )},
    ],
  },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 232 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: '100%',
        background: 'rgba(7,10,20,0.78)',
        borderRight: '1px solid rgba(34,197,94,0.08)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '1px 0 0 rgba(255,255,255,0.02), inset -1px 0 0 rgba(34,197,94,0.04)',
      }}
    >
      {/* Toggle button */}
      <div style={{
        padding: '14px 12px 8px',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-end',
        flexShrink: 0,
      }}>
        <button
          onClick={onToggle}
          style={{
            width: 26, height: 26,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#475569',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.18s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#e2e8f0';
            e.currentTarget.style.background = 'rgba(34,197,94,0.08)';
            e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.24s' }}>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '4px 10px 20px' }}>
        {NAV_ITEMS.map((group) => (
          <div key={group.label} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <div style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'rgba(34,197,94,0.5)',
                textTransform: 'uppercase',
                padding: '0 8px',
                marginBottom: 5,
              }}>
                {group.label}
              </div>
            )}
            {collapsed && <div style={{ height: 10 }} />}

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
                      padding: collapsed ? '9px 0' : '8px 10px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      color: active ? '#22c55e' : '#64748b',
                      background: active
                        ? 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(20,184,166,0.05) 100%)'
                        : 'transparent',
                      border: active ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      boxShadow: active ? '0 0 12px rgba(34,197,94,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
                      position: 'relative',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#cbd5e1';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    {active && !collapsed && (
                      <span style={{
                        position: 'absolute',
                        left: 0, top: '18%', bottom: '18%',
                        width: 2.5,
                        borderRadius: 2,
                        background: 'linear-gradient(180deg, #22c55e, #14b8a6)',
                        boxShadow: '0 0 8px rgba(34,197,94,0.7)',
                      }} />
                    )}
                    <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                    {!collapsed && (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{item.label}</span>
                    )}
                    {!collapsed && active && (
                      <span style={{
                        marginLeft: 'auto', width: 5, height: 5,
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 8px rgba(34,197,94,1)',
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

      {/* Bottom fade */}
      <div style={{
        height: 28,
        background: 'linear-gradient(to bottom, transparent, rgba(7,10,20,0.9))',
        flexShrink: 0,
        pointerEvents: 'none',
        marginTop: -28,
        position: 'relative',
        zIndex: 1,
      }} />
    </motion.aside>
  );
}

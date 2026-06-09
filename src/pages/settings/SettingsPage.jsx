import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettings, updateSettings } from '../../services/adminStorage';

// ── Icons ─────────────────────────────────────────────────────
const GearIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
);
const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const PaletteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="8" cy="14" r="1" fill="currentColor"/>
    <circle cx="12" cy="8" r="1" fill="currentColor"/>
    <circle cx="16" cy="14" r="1" fill="currentColor"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

// ── Reusable primitives ───────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative rounded-full transition-all duration-200 flex-shrink-0 ${
      checked ? 'bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-white/10'
    }`}
    style={{ height: '22px', width: '40px' }}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
        checked ? 'translate-x-[18px]' : 'translate-x-0'
      }`}
    />
  </button>
);

const Field = ({ label, hint, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
    <div className="flex-1 mr-8">
      <p className="text-sm text-white font-medium">{label}</p>
      {hint && <p className="text-xs text-[#6b7280] mt-0.5">{hint}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#22c55e]/40 appearance-none cursor-pointer min-w-[120px]"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} className="bg-[#0a0f1c]">{o.label}</option>
    ))}
  </select>
);

const NumberInput = ({ value, onChange, min, max, suffix }) => (
  <div className="flex items-center gap-2">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="w-20 bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#22c55e]/40 text-right"
    />
    {suffix && <span className="text-xs text-[#6b7280]">{suffix}</span>}
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="bg-white/[0.05] border border-white/[0.10] rounded-lg px-3 py-1.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#22c55e]/40 min-w-[180px]"
  />
);

// ── Tab definition ────────────────────────────────────────────
const TABS = [
  { id: 'general',       label: 'General',       icon: <GearIcon /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
  { id: 'security',      label: 'Security',      icon: <ShieldIcon /> },
  { id: 'appearance',    label: 'Appearance',    icon: <PaletteIcon /> },
];

const ACCENT_COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6', '#ec4899'];

// ── Apply settings to the live document ──────────────────────
const applySettingsToDOM = (settings) => {
  const root = document.documentElement;

  // Accent color → CSS variable used throughout the app
  if (settings.appearance?.accentColor) {
    root.style.setProperty('--accent', settings.appearance.accentColor);
    root.style.setProperty('--accent-rgb', hexToRgb(settings.appearance.accentColor));
  }

  // App name → browser tab title
  if (settings.general?.appName) {
    document.title = settings.general.appName;
  }

  // Compact mode → body class
  if (settings.appearance?.compactMode) {
    document.body.classList.add('compact-mode');
  } else {
    document.body.classList.remove('compact-mode');
  }

  // Theme → body class
  if (settings.appearance?.theme) {
    document.body.setAttribute('data-theme', settings.appearance.theme);
  }

  // Language → html lang attribute
  if (settings.general?.language) {
    document.documentElement.setAttribute('lang', settings.general.language);
  }
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

// ── Session timeout tracker ───────────────────────────────────
let sessionTimer = null;

const startSessionTimer = (minutes) => {
  if (sessionTimer) clearTimeout(sessionTimer);
  if (!minutes || minutes <= 0) return;
  sessionTimer = setTimeout(() => {
    alert('Your session has expired due to inactivity. You will be logged out.');
    localStorage.removeItem('defectai_token');
    localStorage.removeItem('defectai_currentUser');
    window.location.href = '/login';
  }, minutes * 60 * 1000);
};

const resetSessionTimer = (minutes) => {
  startSessionTimer(minutes);
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(() => getSettings());
  const [saved, setSaved] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { message, onConfirm }

  // Apply settings on mount (so saved settings persist across reloads)
  useEffect(() => {
    applySettingsToDOM(settings);
  }, []);

  // Start session timer on mount using saved timeout value
  useEffect(() => {
    const timeout = settings.security?.sessionTimeout;
    if (timeout > 0) {
      startSessionTimer(timeout);
      // Reset timer on any user activity
      const reset = () => resetSessionTimer(timeout);
      window.addEventListener('mousemove', reset);
      window.addEventListener('keydown', reset);
      return () => {
        window.removeEventListener('mousemove', reset);
        window.removeEventListener('keydown', reset);
        if (sessionTimer) clearTimeout(sessionTimer);
      };
    }
  }, [settings.security?.sessionTimeout]);

  const update = (section, key, value) => {
  setSettings((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      [key]: value,
    },
  }));
};

  const handleSave = () => {
  Object.keys(settings).forEach((section) => {
    updateSettings(section, settings[section]);
  });

  applySettingsToDOM(settings);

  setSaved(true);

  setTimeout(() => {
    setSaved(false);
  }, 2200);
};

  const SectionCard = ({ children }) => (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-2 mb-4">
      {children}
    </div>
  );

  // Confirmation dialog for danger zone
  const ConfirmDialog = () => {
    if (!confirmDialog) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0d1117] border border-[#ef4444]/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        >
          <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">Are you sure?</p>
          <p className="text-[#9ca3af] text-sm mb-6">{confirmDialog.message}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }}
              className="flex-1 px-4 py-2 rounded-xl bg-[#ef4444] text-white text-sm font-medium hover:bg-[#ef4444]/90 transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDialog(null)}
              className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-[#9ca3af] text-sm hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 md:px-8">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center text-[#22c55e]">
                <GearIcon />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Settings</h1>
            </div>
            <p className="text-[#6b7280] text-sm ml-11">Configure your {settings.general.appName} workspace</p>
          </div>

          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              saved
                ? 'bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e]'
                : 'bg-[#22c55e] text-black hover:bg-[#22c55e]/90 shadow-[0_0_16px_rgba(34,197,94,0.3)]'
            }`}
          >
            {saved ? <><CheckIcon /> Saved!</> : <><SaveIcon /> Save changes</>}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/[0.02] rounded-xl border border-white/[0.06] p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.id ? 'text-[#22c55e]' : 'text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              {activeTab === t.id && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute inset-0 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{t.icon}</span>
              <span className="relative z-10 hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {/* ── GENERAL ── */}
            {activeTab === 'general' && (
              <>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Workspace</p>
                  <Field label="Application Name" hint="Displayed in the navbar and browser tab">
                    <TextInput
  value={settings.general?.appName || ""}
  onChange={(v) => update("general", "appName", v)}
  placeholder="DefectAI"
/>
                  </Field>
                  <Field label="Language" hint="Interface language (sets html lang attribute)">
                    <Select
                      value={settings.general.language}
                      onChange={(v) => update('general', 'language', v)}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Español' },
                        { value: 'fr', label: 'Français' },
                        { value: 'de', label: 'Deutsch' },
                        { value: 'ja', label: '日本語' },
                      ]}
                    />
                  </Field>
                </SectionCard>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Date & Time</p>
                  <Field label="Timezone" hint="Used for all timestamps">
                    <Select
                      value={settings.general.timezone}
                      onChange={(v) => update('general', 'timezone', v)}
                      options={[
                        { value: 'UTC', label: 'UTC' },
                        { value: 'America/New_York', label: 'Eastern (ET)' },
                        { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
                        { value: 'Europe/London', label: 'London (GMT)' },
                        { value: 'Asia/Kolkata', label: 'India (IST)' },
                        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                        { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
                      ]}
                    />
                  </Field>
                  <Field label="Date Format" hint="How dates appear across the app">
                    <Select
                      value={settings.general.dateFormat}
                      onChange={(v) => update('general', 'dateFormat', v)}
                      options={[
                        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                        { value: 'MMM D, YYYY', label: 'Jan 1, 2025' },
                      ]}
                    />
                  </Field>
                  {/* Live date preview */}
                  <div className="py-3">
                    <p className="text-xs text-[#6b7280] mb-1">Date preview</p>
                    <p className="text-sm text-white font-mono">
                      {formatDatePreview(new Date(), settings.general.dateFormat, settings.general.timezone)}
                    </p>
                  </div>
                </SectionCard>
              </>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Channels</p>
                  <Field label="Email Notifications" hint="Send notifications to admin email address">
                    <Toggle
                      checked={settings.notifications.emailNotifications}
                      onChange={(v) => update('notifications', 'emailNotifications', v)}
                    />
                  </Field>
                </SectionCard>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">User Events</p>
                  <Field label="User Created" hint="Notify when a new developer or tester is added">
                    <Toggle
                      checked={settings.notifications.userCreated}
                      onChange={(v) => update('notifications', 'userCreated', v)}
                    />
                  </Field>
                  <Field label="User Deleted" hint="Notify when a user is removed from the workspace">
                    <Toggle
                      checked={settings.notifications.userDeleted}
                      onChange={(v) => update('notifications', 'userDeleted', v)}
                    />
                  </Field>
                  <Field label="User Login" hint="Notify when a user signs in">
                    <Toggle
                      checked={settings.notifications.userLogin}
                      onChange={(v) => update('notifications', 'userLogin', v)}
                    />
                  </Field>
                </SectionCard>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Ticket Events</p>
                  <Field label="Ticket Created" hint="Notify when a new bug is reported">
                    <Toggle
                      checked={settings.notifications.ticketCreated}
                      onChange={(v) => update('notifications', 'ticketCreated', v)}
                    />
                  </Field>
                  <Field label="Ticket Closed" hint="Notify when a ticket is marked as resolved">
                    <Toggle
                      checked={settings.notifications.ticketClosed}
                      onChange={(v) => update('notifications', 'ticketClosed', v)}
                    />
                  </Field>
                </SectionCard>
                {/* Status summary */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4">
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase mb-3">Active Notifications</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(settings.notifications)
                      .filter(([, v]) => v === true)
                      .map(([k]) => (
                        <span key={k} className="px-2 py-1 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs">
                          {k.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    {Object.values(settings.notifications).every((v) => !v) && (
                      <span className="text-xs text-[#6b7280]">All notifications are disabled</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── SECURITY ── */}
            {activeTab === 'security' && (
              <>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Access Control</p>
                  <Field label="Two-Factor Authentication" hint="Require 2FA for all admin logins">
                    <Toggle
                      checked={settings.security.twoFactorAuth}
                      onChange={(v) => update('security', 'twoFactorAuth', v)}
                    />
                  </Field>
                </SectionCard>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Session & Password</p>
                  <Field label="Session Timeout" hint="Auto-logout after inactivity (save to apply)">
                    <NumberInput
                      value={settings.security.sessionTimeout}
                      onChange={(v) => update('security', 'sessionTimeout', v)}
                      min={5}
                      max={480}
                      suffix="minutes"
                    />
                  </Field>
                  <Field label="Password Expiry" hint="Force password reset after this many days (0 = never)">
                    <NumberInput
                      value={settings.security.passwordExpiry}
                      onChange={(v) => update('security', 'passwordExpiry', v)}
                      min={0}
                      max={365}
                      suffix="days"
                    />
                  </Field>
                </SectionCard>

                {/* Security status */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 mb-4">
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase mb-3">Security Status</p>
                  <div className="space-y-2">
                    <SecurityStatus
                      label="Two-Factor Auth"
                      active={settings.security.twoFactorAuth}
                      good={settings.security.twoFactorAuth}
                    />
                    <SecurityStatus
                      label={`Session Timeout: ${settings.security.sessionTimeout} min`}
                      active
                      good={settings.security.sessionTimeout <= 60}
                    />
                    <SecurityStatus
                      label={settings.security.passwordExpiry === 0 ? 'Password Expiry: Never' : `Password Expiry: ${settings.security.passwordExpiry} days`}
                      active
                      good={settings.security.passwordExpiry > 0 && settings.security.passwordExpiry <= 90}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ef4444]/20 bg-[#ef4444]/[0.03] px-6 py-5">
                  <p className="text-sm text-[#ef4444] font-medium mb-1">Danger Zone</p>
                  <p className="text-xs text-[#6b7280] mb-4">These actions are irreversible. Proceed with caution.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="px-4 py-2 rounded-xl border border-[#ef4444]/30 text-[#ef4444] text-xs hover:bg-[#ef4444]/10 transition-all"
                      onClick={() =>
                        setConfirmDialog({
                          message: 'This will permanently clear all activity logs. This cannot be undone.',
                          onConfirm: () => {
                            localStorage.removeItem('defectai_activities');
                          },
                        })
                      }
                    >
                      Clear Activity Logs
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl border border-[#ef4444]/30 text-[#ef4444] text-xs hover:bg-[#ef4444]/10 transition-all"
                      onClick={() =>
                        setConfirmDialog({
                          message: 'This will permanently delete ALL data including users, tickets, and notifications. The page will reload.',
                          onConfirm: () => {
                            ['defectai_users', 'defectai_activities', 'defectai_notifications', 'defectai_tickets'].forEach((k) =>
                              localStorage.removeItem(k)
                            );
                            window.location.reload();
                          },
                        })
                      }
                    >
                      Reset All Data
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── APPEARANCE ── */}
            {activeTab === 'appearance' && (
              <>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Theme</p>
                  <Field label="Color Scheme" hint="Dashboard theme mode">
                    <div className="flex items-center gap-2">
                      {['dark', 'darker'].map((t) => (
                        <button
                          key={t}
                          onClick={() => update('appearance', 'theme', t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                            settings.appearance.theme === t
                              ? 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]'
                              : 'border-white/10 text-[#9ca3af] hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Compact Mode" hint="Tighter spacing throughout the UI">
                    <Toggle
                      checked={settings.appearance.compactMode}
                      onChange={(v) => update('appearance', 'compactMode', v)}
                    />
                  </Field>
                </SectionCard>
                <SectionCard>
                  <p className="text-[11px] text-[#22c55e] font-semibold tracking-widest uppercase pt-4 pb-2">Accent Color</p>
                  <div className="py-4 flex items-center gap-3 flex-wrap">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => update('appearance', 'accentColor', c)}
                        className="w-8 h-8 rounded-full transition-all hover:scale-110 relative"
                        style={{ background: c, boxShadow: `0 0 10px ${c}60` }}
                      >
                        {settings.appearance.accentColor === c && (
                          <span className="absolute inset-0 flex items-center justify-center text-white">
                            <CheckIcon />
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-[11px] text-[#6b7280]">Custom:</span>
                      <input
                        type="color"
                        value={settings.appearance.accentColor}
                        onChange={(e) => update('appearance', 'accentColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  </div>
                  {/* Live preview using selected accent */}
                  <div className="pb-4">
                    <p className="text-xs text-[#6b7280] mb-2">Live preview</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div
                        className="px-4 py-2 rounded-lg text-black text-sm font-semibold transition-all duration-300"
                        style={{ background: settings.appearance.accentColor, boxShadow: `0 0 12px ${settings.appearance.accentColor}50` }}
                      >
                        Button
                      </div>
                      <div
                        className="w-6 h-6 rounded-full transition-all duration-300"
                        style={{ background: settings.appearance.accentColor, boxShadow: `0 0 8px ${settings.appearance.accentColor}60` }}
                      />
                      <span className="text-sm font-medium transition-all duration-300" style={{ color: settings.appearance.accentColor }}>
                        Active Link
                      </span>
                      <div
                        className="px-3 py-1 rounded-lg border text-xs font-medium transition-all duration-300"
                        style={{ borderColor: `${settings.appearance.accentColor}40`, color: settings.appearance.accentColor, background: `${settings.appearance.accentColor}10` }}
                      >
                        Badge
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating save toast */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#22c55e] text-black text-sm font-semibold shadow-[0_8px_30px_rgba(34,197,94,0.4)] z-50"
            >
              <CheckIcon /> Settings saved successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog />
    </div>
  );
}

// ── Security status row ───────────────────────────────────────
function SecurityStatus({ label, active, good }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${good ? 'bg-[#22c55e]' : active ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`} />
      <span className="text-xs text-[#9ca3af]">{label}</span>
      <span className={`text-[10px] ml-auto ${good ? 'text-[#22c55e]' : active ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
        {good ? 'Good' : active ? 'Warning' : 'Disabled'}
      </span>
    </div>
  );
}

// ── Date format preview helper ────────────────────────────────
function formatDatePreview(date, format, timezone) {
  try {
    const opts = { timeZone: timezone || 'UTC' };
    const d = new Intl.DateTimeFormat('en-US', { ...opts, day: '2-digit' }).format(date);
    const m = new Intl.DateTimeFormat('en-US', { ...opts, month: '2-digit' }).format(date);
    const y = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric' }).format(date);
    const mon = new Intl.DateTimeFormat('en-US', { ...opts, month: 'short' }).format(date);
    const day = new Intl.DateTimeFormat('en-US', { ...opts, day: 'numeric' }).format(date);

    switch (format) {
      case 'MM/DD/YYYY': return `${m}/${d}/${y}`;
      case 'DD/MM/YYYY': return `${d}/${m}/${y}`;
      case 'YYYY-MM-DD': return `${y}-${m}-${d}`;
      case 'MMM D, YYYY': return `${mon} ${day}, ${y}`;
      default: return date.toLocaleDateString();
    }
  } catch {
    return date.toLocaleDateString();
  }
}
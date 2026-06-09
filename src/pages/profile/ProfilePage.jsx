import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, updateCurrentUser, addActivity } from '../../services/adminStorage';
import { useAuth } from '../../context/AuthContext';

// ── Icons ─────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: <UserIcon /> },
  { id: 'password', label: 'Password', icon: <LockIcon /> },
  { id: 'activity', label: 'Activity', icon: <ShieldIcon /> },
];

const InputField = ({ label, type = 'text', value, onChange, placeholder, hint, readOnly, rightEl }) => (
  <div className="mb-5">
    <label className="block text-xs font-medium text-[#9ca3af] mb-1.5 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none transition-colors ${
          readOnly
            ? 'border-white/[0.05] text-[#6b7280] cursor-not-allowed'
            : 'border-white/[0.10] focus:border-[#22c55e]/40'
        }`}
      />
      {rightEl && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    {hint && <p className="text-xs text-[#4b5563] mt-1">{hint}</p>}
  </div>
);

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const stored = getCurrentUser() || {};

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved]         = useState('');

  // Profile fields — fall back between adminStorage user (fullName) and authContext user (name)
  const [form, setForm] = useState({
    fullName: stored.fullName || stored.name || authUser?.name || 'Admin',
    email:    stored.email    || authUser?.email || '',
    phone:    stored.phone    || '',
    jobTitle: stored.jobTitle || 'Administrator',
    company:  stored.company  || 'DefectAI',
    bio:      stored.bio      || '',
    avatar:   stored.avatar   || '',
  });

  // Password fields
  const [pw, setPw]     = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState('');

  // Activity
  const activities = (JSON.parse(localStorage.getItem('defectai_activities') || '[]')).slice(0, 20);

  const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';

  const avatarInputRef = useRef(null);
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    const updatedUser = { ...stored, ...form };
    updateCurrentUser(form);
    addActivity({ action: 'profile_updated', user: form.fullName, role: 'ADMIN', details: 'Profile information updated' });
    setSaved('profile');
    setTimeout(() => setSaved(''), 2200);
  };

  const savePassword = () => {
    setPwError('');
    if (!pw.current) return setPwError('Enter your current password.');
    if (pw.next.length < 8) return setPwError('New password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return setPwError('New passwords do not match.');
    // In localStorage auth we just update the user record
    const allUsers = JSON.parse(localStorage.getItem('defectai_users') || '[]');
    const idx = allUsers.findIndex(u => u.email?.toLowerCase() === form.email?.toLowerCase());
    if (idx !== -1) {
      if (allUsers[idx].password !== pw.current) return setPwError('Current password is incorrect.');
      allUsers[idx].password = pw.next;
      localStorage.setItem('defectai_users', JSON.stringify(allUsers));
    }
    addActivity({ action: 'password_changed', user: form.fullName, role: 'ADMIN', details: 'Password was changed.' });
    setPw({ current: '', next: '', confirm: '' });
    setSaved('password');
    setTimeout(() => setSaved(''), 2200);
  };

  const actionColors = {
    profile_updated: '#22c55e',
    password_changed: '#f59e0b',
    login: '#14b8a6',
    logout: '#6366f1',
    user_created: '#22c55e',
    user_deleted: '#ef4444',
    default: '#9ca3af',
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
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Profile hero */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-6 flex items-center gap-5">
          {/* Avatar */}
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#14b8a6] flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] overflow-hidden cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              {form.avatar ? (
                <img src={form.avatar} alt="" className="w-full h-full object-cover" />
              ) : initials(form.fullName)}
            </div>
            <div
              className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <CameraIcon />
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white">{form.fullName}</h2>
            <p className="text-sm text-[#6b7280]">{form.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[10px] font-semibold tracking-wide uppercase">
                ADMIN
              </span>
              <span className="text-[11px] text-[#4b5563]">{form.jobTitle}</span>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-4 text-center">
            {[
              { label: 'Team Members', value: (JSON.parse(localStorage.getItem('defectai_users') || '[]')).length },
              { label: 'Actions', value: activities.length },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-[#6b7280]">{s.label}</p>
              </div>
            ))}
          </div>
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
                <motion.div layoutId="profile-tab"
                  className="absolute inset-0 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{t.icon}</span>
              <span className="relative z-10 hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-6">
                <div className="grid sm:grid-cols-2 gap-x-6">
                  <InputField label="Full Name" value={form.fullName}
                    onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="John Smith" />
                  <InputField label="Email Address" value={form.email} readOnly
                    hint="Contact support to change your email" />
                  <InputField label="Phone" value={form.phone}
                    onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555 000 0000" />
                  <InputField label="Job Title" value={form.jobTitle}
                    onChange={(e) => setForm(p => ({ ...p, jobTitle: e.target.value }))} placeholder="Administrator" />
                  <InputField label="Company" value={form.company}
                    onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Corp" />
                </div>
                <div className="mb-5">
                  <label className="block text-xs font-medium text-[#9ca3af] mb-1.5 uppercase tracking-wide">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    placeholder="A short bio about yourself…"
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#22c55e]/40 resize-none"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={saveProfile}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    saved === 'profile'
                      ? 'bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e]'
                      : 'bg-[#22c55e] text-black hover:bg-[#22c55e]/90 shadow-[0_0_16px_rgba(34,197,94,0.3)]'
                  }`}
                >
                  {saved === 'profile' ? <><CheckIcon /> Saved!</> : <><SaveIcon /> Save Profile</>}
                </motion.button>
              </div>
            )}

            {/* ── PASSWORD TAB ── */}
            {activeTab === 'password' && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-6 max-w-md">
                <p className="text-sm text-[#6b7280] mb-6">
                  Use a strong password with at least 8 characters including letters and numbers.
                </p>

                {[
                  { key: 'current', label: 'Current Password' },
                  { key: 'next',    label: 'New Password' },
                  { key: 'confirm', label: 'Confirm New Password' },
                ].map(({ key, label }) => (
                  <InputField
                    key={key}
                    label={label}
                    type={showPw[key] ? 'text' : 'password'}
                    value={pw[key]}
                    onChange={(e) => setPw(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="••••••••"
                    rightEl={
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                        className="text-[#4b5563] hover:text-[#9ca3af] transition-colors">
                        <EyeIcon open={showPw[key]} />
                      </button>
                    }
                  />
                ))}

                {pwError && (
                  <p className="text-xs text-[#ef4444] mb-4 -mt-2 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {pwError}
                  </p>
                )}

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={savePassword}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    saved === 'password'
                      ? 'bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e]'
                      : 'bg-[#22c55e] text-black hover:bg-[#22c55e]/90 shadow-[0_0_16px_rgba(34,197,94,0.3)]'
                  }`}
                >
                  {saved === 'password' ? <><CheckIcon /> Password Updated!</> : <><LockIcon /> Update Password</>}
                </motion.button>
              </div>
            )}

            {/* ── ACTIVITY TAB ── */}
            {activeTab === 'activity' && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                {activities.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-[#6b7280] text-sm">No activity recorded yet.</p>
                    <p className="text-[#4b5563] text-xs mt-1">Actions you take will appear here.</p>
                  </div>
                ) : (
                  activities.map((a, i) => (
                    <motion.div
                      key={a.id || i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-2 shrink-0"
                        style={{
                          backgroundColor: actionColors[a.action] || actionColors.default,
                          boxShadow: `0 0 6px ${actionColors[a.action] || actionColors.default}60`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium capitalize">
                          {a.action?.replace(/_/g, ' ')}
                        </p>
                        {a.details && (
                          <p className="text-xs text-[#6b7280] mt-0.5">{a.details}</p>
                        )}
                      </div>
                      <span className="text-[11px] text-[#4b5563] shrink-0 mt-0.5">{timeAgo(a.timestamp)}</span>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
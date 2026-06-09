// ─── DefectAI Admin Profile Page ─────────────────────────────────────────────
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';
import { getCurrentUser, updateCurrentUser, addActivity } from '../services/adminStorage';
import { GlassCard, PageHeader, PrimaryButton, GhostButton, Input, Badge, Avatar } from '../components/ui.jsx';

export default function ProfilePage() {
  const { refresh } = useAdmin();
  const currentUser = getCurrentUser();
  const fileRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
  });
  const [formErrors, setFormErrors] = useState({});

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateCurrentUser({ avatar: ev.target.result });
      refresh();
      showToast('Profile photo updated');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email';
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    setLoading(true);
    updateCurrentUser({ fullName: form.fullName, email: form.email });
    addActivity({ action: 'profile_updated', user: form.fullName, role: currentUser?.role || 'admin', details: 'Profile information updated' });
    refresh();
    setLoading(false);
    setEditMode(false);
    showToast('Profile updated successfully');
  };

  const handleChangePassword = () => {
    const errors = {};
    if (!pwForm.current) errors.current = 'Current password is required';
    else if (pwForm.current !== currentUser?.password) errors.current = 'Current password is incorrect';
    if (!pwForm.newPw) errors.newPw = 'New password is required';
    else if (pwForm.newPw.length < 8) errors.newPw = 'Min. 8 characters';
    if (pwForm.newPw !== pwForm.confirm) errors.confirm = 'Passwords do not match';
    if (Object.keys(errors).length) { setPwErrors(errors); return; }

    setLoading(true);
    updateCurrentUser({ password: pwForm.newPw });
    addActivity({ action: 'password_changed', user: currentUser?.fullName || 'Admin', role: currentUser?.role || 'admin', details: 'Password changed successfully' });
    refresh();
    setLoading(false);
    setChangingPw(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
    showToast('Password changed successfully');
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const user = getCurrentUser();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
            toast.type === 'error'
              ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]'
              : 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]'
          }`}
        >
          {toast.msg}
        </motion.div>
      )}

      <PageHeader title="My Profile" subtitle="Manage your account information" />

      {/* Profile Card */}
      <GlassCard delay={0} className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#22c55e] to-[#14b8a6] flex items-center justify-center text-3xl font-bold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (user?.fullName || 'A').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{user?.fullName}</h2>
            <p className="text-[#6b7280] text-sm">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <Badge label={user?.role || 'admin'} color="green" />
              <Badge label={user?.status || 'active'} color="green" />
            </div>
          </div>

          <PrimaryButton onClick={() => { setEditMode(true); setFormErrors({}); }} size="sm">
            Edit Profile
          </PrimaryButton>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
          {[
            { label: 'Member Since', value: formatDate(user?.createdAt) },
            { label: 'Last Login', value: formatDate(user?.lastLogin) },
            { label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Admin' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-[#4b5563] uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Edit Profile Form */}
      {editMode && (
        <GlassCard delay={0.1} className="p-6 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Edit Information</h3>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              error={formErrors.fullName}
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={formErrors.email}
            />
            <div className="flex gap-3 pt-2">
              <PrimaryButton onClick={handleSaveProfile} loading={loading}>Save Changes</PrimaryButton>
              <GhostButton onClick={() => setEditMode(false)}>Cancel</GhostButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Change Password */}
      <GlassCard delay={0.2} className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Password & Security</h3>
            <p className="text-xs text-[#6b7280] mt-0.5">Keep your account secure</p>
          </div>
          {!changingPw && (
            <GhostButton onClick={() => { setChangingPw(true); setPwErrors({}); }} size="sm">
              Change Password
            </GhostButton>
          )}
        </div>

        {changingPw ? (
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              error={pwErrors.current}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={pwForm.newPw}
              onChange={(e) => setPwForm((p) => ({ ...p, newPw: e.target.value }))}
              error={pwErrors.newPw}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              error={pwErrors.confirm}
            />
            <div className="flex gap-3 pt-2">
              <PrimaryButton onClick={handleChangePassword} loading={loading}>Update Password</PrimaryButton>
              <GhostButton onClick={() => setChangingPw(false)}>Cancel</GhostButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#111827]/50 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Password protected</p>
              <p className="text-[11px] text-[#4b5563]">Last changed: {formatDate(user?.updatedAt)}</p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
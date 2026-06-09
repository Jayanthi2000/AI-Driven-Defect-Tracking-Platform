// ─── DefectAI Team Management ─────────────────────────────────────────────────
// Fix #1  — handleFieldChange clears that field's error on every keystroke
// Fix #3  — CreateUserModal is 520px wide, 2-column fields, footer buttons
// Fix #7  — ValidatedInput shows #f87171 errors, readable on dark background
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import { GlobalLayout } from '../../components/ui/GlobalLayout';
import { ValidatedInput } from '../../components/ui/ui';
import {
  PageHeader,
  StatCard,
  GlassCard,
  Modal,
  EmptyState,
  PrimaryButton,
  GhostButton,
  Select,
  Avatar,
  Badge,
} from '../../components/ui/ui';

// ─── Field-level validator ────────────────────────────────────────────────────
const validateField = (name, value, form) => {
  switch (name) {
    case 'fullName':
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email';
      return '';
    case 'password':
      if (!form.isEditing) {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[A-Z])/.test(value)) return 'Include at least one uppercase letter';
        if (!/(?=.*[0-9])/.test(value)) return 'Include at least one number';
      }
      return '';
    case 'confirmPassword':
      if (!form.isEditing && value !== form.password) return 'Passwords do not match';
      return '';
    case 'role':
      if (!value) return 'Role is required';
      return '';
    default:
      return '';
  }
};

const validateAll = (form) => {
  const fields = ['fullName', 'email', 'role'];
  if (!form.isEditing) fields.push('password', 'confirmPassword');
  const errors = {};
  fields.forEach((f) => {
    const msg = validateField(f, form[f], form);
    if (msg) errors[f] = msg;
  });
  return errors;
};

const passwordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f59e0b' },
    { label: 'Good',   color: '#22c55e' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...map[score] };
};

const EMPTY_FORM = {
  fullName: '', email: '', password: '', confirmPassword: '', role: 'developer',
};

// ─── Fix #3: CreateUserModal ──────────────────────────────────────────────────
// Wider (520px), 2-column field layout, clear footer row with action buttons.
function CreateUserModal({ open, onClose, onSubmit, form, errors, onChange, loading }) {
  if (!open) return null;
  const strength = passwordStrength(form.password);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel — Fix #3: 520px, not the cramped default */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            className="relative z-10 w-full"
            style={{ maxWidth: 520 }}
          >
            <div
              className="rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ background: '#080e1f' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-semibold text-white">Create New User</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    Fill in the details to add a team member
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Body — Fix #3: generous padding, grouped 2-column layout */}
              <div className="px-7 py-6 space-y-5">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ValidatedInput
                    label="Full Name"
                    placeholder="Jane Smith"
                    value={form.fullName}
                    onChange={(e) => onChange('fullName', e.target.value)}
                    error={errors.fullName}
                    required
                  />
                  <ValidatedInput
                    label="Email Address"
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </div>

                {/* Row 2: Password + Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ValidatedInput
                    label="Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => onChange('password', e.target.value)}
                    error={errors.password}
                    required
                  />
                  <ValidatedInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />
                </div>

                {/* Password strength bar */}
                {form.password && (
                  <div className="flex items-center gap-3 -mt-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : '#1f2937' }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <span className="text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                )}

                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-semibold tracking-widest uppercase"
                    style={{ color: '#9ca3af' }}
                  >
                    Role <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => onChange('role', e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none
                      bg-white/[0.04] border border-white/[0.10] focus:border-[#22c55e]/50
                      appearance-none cursor-pointer"
                  >
                    <option value="developer" className="bg-[#080e1f]">Developer</option>
                    <option value="tester"    className="bg-[#080e1f]">Tester</option>
                  </select>
                  {/* Fix #7: role error visible */}
                  {errors.role && (
                    <p className="flex items-center gap-1.5 text-xs" style={{ color: '#f87171' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-white/[0.06]">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.10)', color: '#9ca3af' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-black text-sm font-semibold transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: '#22c55e',
                    boxShadow: '0 0 16px rgba(34,197,94,0.3)',
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Edit User Modal (unchanged layout, uses ValidatedInput for Fix #7) ───────
function EditUserModal({ open, onClose, onSubmit, form, errors, onChange, loading }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            className="relative z-10 w-full"
            style={{ maxWidth: 480 }}
          >
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: '#080e1f' }}>
              <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-white/[0.06]">
                <h2 className="text-base font-semibold text-white">Edit User</h2>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-white transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="px-7 py-6 space-y-5">
                <ValidatedInput label="Full Name" placeholder="Jane Smith" value={form.fullName}
                  onChange={(e) => onChange('fullName', e.target.value)} error={errors.fullName} required />
                <ValidatedInput label="Email Address" type="email" placeholder="jane@company.com"
                  value={form.email} onChange={(e) => onChange('email', e.target.value)} error={errors.email} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#9ca3af' }}>Role</label>
                  <select value={form.role} onChange={(e) => onChange('role', e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none bg-white/[0.04] border border-white/[0.10] focus:border-[#22c55e]/50 appearance-none cursor-pointer">
                    <option value="developer" className="bg-[#080e1f]">Developer</option>
                    <option value="tester" className="bg-[#080e1f]">Tester</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-white/[0.06]">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm border border-white/[0.10] text-[#9ca3af] hover:text-white transition-all">Cancel</button>
                <button onClick={onSubmit} disabled={loading}
                  className="px-5 py-2 rounded-xl text-black text-sm font-semibold disabled:opacity-50"
                  style={{ background: '#22c55e', boxShadow: '0 0 16px rgba(34,197,94,0.3)' }}>
                  {loading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TeamManagement() {
  const { users = [], createUser, updateUser, deleteUser, toggleUserStatus } = useAdmin();
  const location = useLocation();

  const [search, setSearch]               = useState('');
  const [roleFilter, setRoleFilter]       = useState('all');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editUser, setEditUser]           = useState(null);
  const [viewUser, setViewUser]           = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [errors, setErrors]               = useState({});
  const [loading, setLoading]             = useState(false);
  const [toast, setToast]                 = useState(null);

  useEffect(() => {
    if (location.state?.openCreate) {
      setForm({ ...EMPTY_FORM, role: location.state.openCreate });
      setCreateModalOpen(true);
    }
  }, [location.state]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fix #1: clear the touched field's error immediately on every keystroke ──
  const handleFieldChange = useCallback((name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      setErrors((prevErrors) => {
        const updated = {
          ...prevErrors,
          [name]: validateField(name, value, next), // re-validate this field
        };
        // Also re-validate confirmPassword whenever password changes
        if (name === 'password') {
          updated.confirmPassword = validateField('confirmPassword', next.confirmPassword, next);
        }
        return updated;
      });

      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const safeUsers = users || [];
    return safeUsers.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || ( u.name || u.fullName || "")?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchRole   = roleFilter   === 'all' || u.role   === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setCreateModalOpen(true);
  };

  const openEdit = (user) => {
    setForm({ fullName: user.name || user.fullName || '', email: user.email, password: '', confirmPassword: '', role: user.role, isEditing: true });
    setErrors({});
    setEditUser(user);
  };

  const handleSubmitCreate = async () => {
    const errs = validateAll(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const result = createUser(form);
    setLoading(false);
    if (result.error) { setErrors({ email: result.error }); return; }
    setCreateModalOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
    showToast(`${form.role === 'developer' ? 'Developer' : 'Tester'} "${form.fullName}" created successfully`);
  };

  const handleSubmitEdit = async () => {
    const errs = validateAll({ ...form, isEditing: true });
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    updateUser(editUser.id, { fullName: form.fullName, email: form.email, role: form.role });
    setLoading(false);
    setEditUser(null);
    showToast('User updated successfully');
  };

  const handleDelete = () => {
    deleteUser(deleteConfirm.id);
    setDeleteConfirm(null);
    showToast('User deleted', 'error');
  };

  const handleToggle = (user) => {
    toggleUserStatus(user.id);
    showToast(`User ${user.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <GlobalLayout>
      <div className="max-w-screen-xl mx-auto">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
                toast.type === 'error'
                  ? 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]'
                  : 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]'
              }`}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <PageHeader
          title="Team Management"
          subtitle={`${users.length} total users · ${users.filter((u) => u.role === 'developer').length} developers · ${users.filter((u) => u.role === 'tester').length} testers`}
          action={<PrimaryButton onClick={openCreate}>+ Add User</PrimaryButton>}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search by name or email…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0f1c]/60 border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#22c55e]/40 transition-all"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0a0f1c]/60 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#22c55e]/40 transition-all">
            <option value="all">All Roles</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a0f1c]/60 border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#22c55e]/40 transition-all">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="👥"
            title={users.length === 0 ? 'No users yet' : 'No results found'}
            description={users.length === 0 ? 'Create your first team member to get started' : 'Try adjusting your search or filters'}
            action={users.length === 0 && <PrimaryButton onClick={openCreate}>Create First User</PrimaryButton>}
          />
        ) : (
          <div className="rounded-xl border border-white/[0.08] bg-[#0a0f1c]/60 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['User', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name || user.fullName} src={user.avatar} role={user.role} size="sm" />
                          <span className="text-sm font-medium text-white whitespace-nowrap">{user.name || user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-sm text-[#9ca3af]">{user.email}</span></td>
                      <td className="px-4 py-3"><Badge label={user.role} color={user.role === 'developer' ? 'green' : 'teal'} /></td>
                      <td className="px-4 py-3"><Badge label={user.status} color={user.status === 'active' ? 'green' : 'red'} /></td>
                      <td className="px-4 py-3"><span className="text-xs text-[#6b7280] whitespace-nowrap">{formatDate(user.createdAt)}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewUser(user)} title="View"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#14b8a6] hover:bg-[#14b8a6]/10 transition-all">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button onClick={() => openEdit(user)} title="Edit"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#22c55e] hover:bg-[#22c55e]/10 transition-all">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                            </svg>
                          </button>
                          <button onClick={() => handleToggle(user)} title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                              user.status === 'active'
                                ? 'text-[#6b7280] hover:text-[#f59e0b] hover:bg-[#f59e0b]/10'
                                : 'text-[#6b7280] hover:text-[#22c55e] hover:bg-[#22c55e]/10'
                            }`}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {user.status === 'active'
                                ? <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>
                                : <polyline points="20 6 9 17 4 12"/>}
                            </svg>
                          </button>
                          <button onClick={() => setDeleteConfirm(user)} title="Delete"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-[#4b5563]">Showing {filtered.length} of {users.length} users</span>
            </div>
          </div>
        )}

        {/* Create Modal — Fix #1 #3 #7 */}
        <CreateUserModal
          open={createModalOpen}
          onClose={() => { setCreateModalOpen(false); setErrors({}); }}
          onSubmit={handleSubmitCreate}
          form={form}
          errors={errors}
          onChange={handleFieldChange}
          loading={loading}
        />

        {/* Edit Modal */}
        <EditUserModal
          open={!!editUser}
          onClose={() => { setEditUser(null); setErrors({}); }}
          onSubmit={handleSubmitEdit}
          form={form}
          errors={errors}
          onChange={handleFieldChange}
          loading={loading}
        />

        {/* View Modal */}
        <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={viewUser.name || viewUser.fullName} src={viewUser.avatar} role={viewUser.role} size="lg" />
                <div>
                  <p className="text-lg font-semibold text-white">{viewUser.name || viewUser.fullName}</p>
                  <p className="text-sm text-[#6b7280]">{viewUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Role',       value: <Badge label={viewUser.role}   color={viewUser.role === 'developer' ? 'green' : 'teal'} /> },
                  { label: 'Status',     value: <Badge label={viewUser.status} color={viewUser.status === 'active' ? 'green' : 'red'}   /> },
                  { label: 'Created',    value: formatDate(viewUser.createdAt) },
                  { label: 'Last Login', value: viewUser.lastLogin ? formatDate(viewUser.lastLogin) : 'Never' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#111827]/50 rounded-lg p-3">
                    <p className="text-[10px] text-[#4b5563] uppercase tracking-wider mb-1">{label}</p>
                    <div className="text-sm text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirm */}
        <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete User">
          {deleteConfirm && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#ef4444]/5 border border-[#ef4444]/10">
                <p className="text-sm text-[#9ca3af]">
                  Are you sure you want to delete{' '}
                  <span className="text-white font-semibold">{deleteConfirm.name || deleteConfirm.fullName}</span>?
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <GhostButton variant="danger" onClick={handleDelete}>Delete User</GhostButton>
                <GhostButton onClick={() => setDeleteConfirm(null)}>Cancel</GhostButton>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </GlobalLayout>
  );
}
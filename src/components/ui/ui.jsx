// ─── Shared Admin UI Components ───────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export { default as ValidatedInput } from "./ValidatedInput";

// ─── Animated Counter Hook ────────────────────────────────────────────────────
export const useCounter = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon, color = '#22c55e', delay = 0, badge }) => {
  const count = useCounter(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-xl border border-white/8 bg-[#0a0f1c]/60 backdrop-blur-sm p-5 hover:border-white/15 transition-all duration-300 group"
    >
      {/* Glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6b7280] font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-white tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {count.toLocaleString()}
          </p>
          {badge && (
            <span className="mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border" style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}>
              {badge}
            </span>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 12px ${color}20` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Glass Card ────────────────────────────────────────────────────────────────
export const GlassCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`rounded-xl border border-white/8 bg-[#0a0f1c]/60 backdrop-blur-sm ${className}`}
  >
    {children}
  </motion.div>
);

// ─── Page Header ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-[#6b7280] mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── Primary Button ────────────────────────────────────────────────────────────
export const PrimaryButton = ({ children, onClick, disabled, type = 'button', size = 'md', loading }) => {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${sizeClass} font-semibold rounded-lg bg-[#22c55e] text-black hover:bg-[#16a34a] active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(34,197,94,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="12" />
        </svg>
      )}
      {children}
    </button>
  );
};

// ─── Ghost Button ──────────────────────────────────────────────────────────────
export const GhostButton = ({ children, onClick, type = 'button', size = 'md', variant = 'default' }) => {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  const variantClass = variant === 'danger'
    ? 'text-[#ef4444] border-[#ef4444]/20 hover:bg-[#ef4444]/10 hover:border-[#ef4444]/40'
    : 'text-[#9ca3af] border-white/10 hover:text-white hover:bg-white/5 hover:border-white/20';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${sizeClass} font-medium rounded-lg border transition-all duration-200 active:scale-95 ${variantClass}`}
    >
      {children}
    </button>
  );
};

// ─── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color }) => {
  const colors = {
    green: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
    teal: 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20',
    red: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    yellow: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    gray: 'bg-[#374151]/50 text-[#9ca3af] border-white/10',
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${colors[color] || colors.gray}`}>
      {label}
    </span>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">{label}</label>}
    <input
      {...props}
      className={`w-full bg-[#111827] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:ring-1 transition-all ${
        error ? 'border-[#ef4444]/50 focus:ring-[#ef4444]/30' : 'border-white/10 focus:border-[#22c55e]/50 focus:ring-[#22c55e]/20'
      }`}
    />
    {error && <p className="text-xs text-[#ef4444]">{error}</p>}
  </div>
);

// ─── Select ────────────────────────────────────────────────────────────────────
export const Select = ({ label, error, children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">{label}</label>}
    <select
      {...props}
      className={`w-full bg-[#111827] border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 transition-all appearance-none ${
        error ? 'border-[#ef4444]/50 focus:ring-[#ef4444]/30' : 'border-white/10 focus:border-[#22c55e]/50 focus:ring-[#22c55e]/20'
      }`}
    >
      {children}
    </select>
    {error && <p className="text-xs text-[#ef4444]">{error}</p>}
  </div>
);

// ─── Toggle ────────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      {description && <p className="text-xs text-[#6b7280] mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-[#1f2937]'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`}
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/8 flex items-center justify-center text-2xl mb-4">
      {icon}
    </div>
    <p className="text-white font-semibold">{title}</p>
    {description && <p className="text-sm text-[#6b7280] mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ─── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ name, src, size = 'md', role }) => {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-20 h-20 text-2xl' };
  const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const roleGrad = role === 'developer' ? 'from-[#22c55e] to-[#14b8a6]' : role === 'tester' ? 'from-[#14b8a6] to-[#0891b2]' : 'from-[#22c55e] to-[#14b8a6]';

  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br ${roleGrad} flex items-center justify-center text-black font-bold shrink-0 overflow-hidden shadow-[0_0_10px_rgba(34,197,94,0.2)]`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = 'max-w-md' }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${width} rounded-2xl border border-white/10 bg-[#0a0f1c] shadow-2xl overflow-hidden`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-white hover:bg-white/5 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


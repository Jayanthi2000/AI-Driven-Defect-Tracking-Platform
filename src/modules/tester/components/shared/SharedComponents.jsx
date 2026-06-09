// SharedComponents.jsx - reusable UI building blocks
import { motion } from 'framer-motion';
import { STATUS_COLORS, SEVERITY_COLORS, PRIORITY_COLORS } from '../../services/bugWorkflowService';

export function GlassCard({ children, className = '', hover = false }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, borderColor: 'rgba(16,185,129,0.3)' } : {}}
      className={`bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ label, value, icon: Icon, color = 'emerald', trend, subtitle }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: 'text-blue-400' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: 'text-yellow-400' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: 'text-red-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: 'text-purple-400' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: 'text-cyan-400' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: 'text-orange-400' },
    gray: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: 'text-gray-400' },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(16,185,129,0.3)' }}
      transition={{ duration: 0.2 }}
      className={`bg-white/[0.03] border ${c.border} rounded-2xl p-4 backdrop-blur-sm hover:bg-white/[0.05] transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2 rounded-xl ${c.bg} border ${c.border}`}>
            <Icon size={18} className={c.icon} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <span className={`text-xs ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}% this week
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.OPEN;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const c = SEVERITY_COLORS[severity] || SEVERITY_COLORS.LOW;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1 h-1 rounded-full ${c.dot}`} />
      {severity}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const c = PRIORITY_COLORS[priority] || PRIORITY_COLORS.LOW;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text}`}>
      {priority}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <Icon size={28} className="text-emerald-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <div className={`${s} border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin`} />
  );
}

export function GreenButton({ children, onClick, disabled, className = '', type = 'button', size = 'md' }) {
  const sz = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-sm';
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${sz} font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, onClick, className = '', size = 'md' }) {
  const sz = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${sz} font-medium rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
      <input
        className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
      <textarea
        className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
      <select
        className={`w-full bg-[#111] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function TimeAgo({ date }) {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return <span className="text-gray-500 text-xs">just now</span>;
  if (mins < 60) return <span className="text-gray-500 text-xs">{mins}m ago</span>;
  if (hrs < 24) return <span className="text-gray-500 text-xs">{hrs}h ago</span>;
  if (days < 7) return <span className="text-gray-500 text-xs">{days}d ago</span>;
  return <span className="text-gray-500 text-xs">{new Date(date).toLocaleDateString()}</span>;
}
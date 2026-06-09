// BugTable.jsx
import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { timeAgo, getPriorityColor, getStatusColor, getSeverityColor } from '../utils/bugHelpers';

const Badge = ({ value, color }) => (
  <span
    className="px-2 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap"
    style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
  >
    {value?.replace(/_/g, ' ')}
  </span>
);

const BugTable = ({
  bugs = [],
  onBugClick,
  sort,
  onSort,
  page,
  totalPages,
  onPageChange,
  selectedBugs = [],
  onSelectBug,
  onSelectAll,
}) => {
  const columns = [
    { key: 'title',     label: 'Title',    sortable: true  },
    { key: 'status',    label: 'Status',   sortable: true  },
    { key: 'priority',  label: 'Priority', sortable: true  },
    { key: 'severity',  label: 'Severity', sortable: false },
    { key: 'module',    label: 'Module',   sortable: true  },
    { key: 'createdAt', label: 'Created',  sortable: true  },
  ];

  const allSelected = bugs.length > 0 && bugs.every(b => selectedBugs.includes(b.id));

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {onSelectBug && (
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onSelectAll?.()}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort?.(col.key)}
                      className="flex items-center gap-1 hover:text-white/70 transition-colors"
                    >
                      {col.label}
                      <ArrowUpDown className={`w-3 h-3 ${sort?.field === col.key ? 'text-emerald-400' : ''}`} />
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bugs.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectBug ? 1 : 0)} className="px-4 py-12 text-center text-white/30">
                  No bugs found
                </td>
              </tr>
            ) : bugs.map((bug, i) => (
              <tr
                key={bug.id}
                onClick={() => onBugClick?.(bug)}
                className="hover:bg-white/5 cursor-pointer transition-colors group"
                style={{ borderBottom: i < bugs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                {onSelectBug && (
                  <td className="px-4 py-3" onClick={e => { e.stopPropagation(); onSelectBug(bug.id); }}>
                    <input
                      type="checkbox"
                      checked={selectedBugs.includes(bug.id)}
                      onChange={() => onSelectBug(bug.id)}
                      className="w-4 h-4 rounded accent-emerald-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-white/70 group-hover:text-white transition-colors font-medium truncate">{bug.title}</p>
                  <p className="text-white/30 text-xs mt-0.5 truncate">{bug.id}</p>
                </td>
                <td className="px-4 py-3"><Badge value={bug.status}   color={getStatusColor(bug.status)}   /></td>
                <td className="px-4 py-3"><Badge value={bug.priority} color={getPriorityColor(bug.priority)} /></td>
                <td className="px-4 py-3"><Badge value={bug.severity} color={getSeverityColor(bug.severity)} /></td>
                <td className="px-4 py-3 text-white/50 text-xs">{bug.module || '—'}</td>
                <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{timeAgo(bug.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-white/30 text-xs">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugTable;

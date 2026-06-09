// MyBugsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, LayoutGrid, List, Columns, ChevronDown,
  Bug, ArrowUpDown, ChevronLeft, ChevronRight, X, SlidersHorizontal
} from 'lucide-react';
import {
  getCurrentUser, getDeveloperBugs, BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY, initializeDemoData
} from '../services/developerService';

const priorityColors = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' };
const statusColors = {
  ASSIGNED: '#6366f1', IN_PROGRESS: '#f59e0b', FIXED: '#10b981',
  READY_FOR_TESTING: '#3b82f6', COMPLETED: '#22c55e', REOPENED: '#ef4444',
};
const severityColors = { MINOR: '#22c55e', MAJOR: '#f97316', CRITICAL: '#ef4444', BLOCKER: '#dc2626' };

const Badge = ({ value, colors }) => (
  <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: `${colors[value]}20`, color: colors[value], border: `1px solid ${colors[value]}30` }}>
    {value?.replace('_', ' ')}
  </span>
);

const GlassCard = ({ children, className = '', onClick }) => (
  <div
    className={`rounded-2xl relative overflow-hidden ${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
  >
    {children}
  </div>
);

const kanbanColumns = [
  { status: BUG_STATUS.ASSIGNED, label: 'Assigned', color: '#6366f1' },
  { status: BUG_STATUS.IN_PROGRESS, label: 'In Progress', color: '#f59e0b' },
  { status: BUG_STATUS.FIXED, label: 'Fixed', color: '#10b981' },
  { status: BUG_STATUS.READY_FOR_TESTING, label: 'Ready For Testing', color: '#3b82f6' },
];

const MyBugsPage = () => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', severity: '', module: '' });
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBugs, setSelectedBugs] = useState([]);
  const PER_PAGE = 10;

  useEffect(() => {
    initializeDemoData();
    const user = getCurrentUser();
    if (user) setBugs(getDeveloperBugs(user.id));
  }, []);

  const modules = useMemo(() => [...new Set(bugs.map(b => b.module).filter(Boolean))], [bugs]);

  const filtered = useMemo(() => {
    let result = [...bugs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => b.title?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q) || b.module?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter(b => b.status === filters.status);
    if (filters.priority) result = result.filter(b => b.priority === filters.priority);
    if (filters.severity) result = result.filter(b => b.severity === filters.severity);
    if (filters.module) result = result.filter(b => b.module === filters.module);
    result.sort((a, b) => {
      const aVal = a[sort.field] || '';
      const bVal = b[sort.field] || '';
      return sort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return result;
  }, [bugs, search, filters, sort]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSort = (field) => {
    setSort(s => s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'asc' });
    setPage(1);
  };

  const clearFilters = () => { setFilters({ status: '', priority: '', severity: '', module: '' }); setSearch(''); setPage(1); };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d}d ago`;
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Table View
  const TableView = () => (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: '#', field: null, w: '40px' },
                { label: 'Title', field: 'title', w: '' },
                { label: 'Status', field: 'status', w: '150px' },
                { label: 'Priority', field: 'priority', w: '110px' },
                { label: 'Severity', field: 'severity', w: '110px' },
                { label: 'Module', field: 'module', w: '120px' },
                { label: 'Updated', field: 'updatedAt', w: '90px' },
              ].map(col => (
                <th
                  key={col.label}
                  className="px-4 py-3 text-left text-white/40 text-xs font-medium"
                  style={{ width: col.w }}
                >
                  {col.field ? (
                    <button onClick={() => toggleSort(col.field)} className="flex items-center gap-1 hover:text-white/70 transition-colors">
                      {col.label} <ArrowUpDown className="w-3 h-3" />
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-white/30 text-sm">
                  <Bug className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No bugs found
                </td>
              </tr>
            ) : (
              paginated.map((bug, i) => (
                <motion.tr
                  key={bug.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/developer/bug-details/${bug.id}`)}
                  className="cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
                >
                  <td className="px-4 py-3 text-white/30 text-xs">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors truncate max-w-xs">{bug.title}</p>
                    <p className="text-white/30 text-xs">{bug.environment}</p>
                  </td>
                  <td className="px-4 py-3"><Badge value={bug.status} colors={statusColors} /></td>
                  <td className="px-4 py-3"><Badge value={bug.priority} colors={priorityColors} /></td>
                  <td className="px-4 py-3"><Badge value={bug.severity} colors={severityColors} /></td>
                  <td className="px-4 py-3 text-white/50 text-xs">{bug.module}</td>
                  <td className="px-4 py-3 text-white/30 text-xs">{timeAgo(bug.updatedAt)}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );

  // Card View
  const CardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {paginated.length === 0 ? (
        <div className="col-span-full py-12 text-center text-white/30">
          <Bug className="w-8 h-8 mx-auto mb-2 opacity-30" />
          No bugs found
        </div>
      ) : (
        paginated.map((bug, i) => (
          <motion.div
            key={bug.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard
              className="p-4 hover:border-white/15 transition-all duration-200 group"
              onClick={() => navigate(`/developer/bug-details/${bug.id}`)}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${statusColors[bug.status]}15`, border: `1px solid ${statusColors[bug.status]}25` }}>
                  <Bug className="w-3.5 h-3.5" style={{ color: statusColors[bug.status] }} />
                </div>
                <Badge value={bug.status} colors={statusColors} />
              </div>
              <h4 className="text-white/80 text-sm font-medium mb-2 line-clamp-2 group-hover:text-white transition-colors">{bug.title}</h4>
              <p className="text-white/30 text-xs mb-3 line-clamp-2">{bug.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge value={bug.priority} colors={priorityColors} />
                <Badge value={bug.severity} colors={severityColors} />
              </div>
              <div className="flex items-center justify-between text-xs text-white/30">
                <span>{bug.module}</span>
                <span>{timeAgo(bug.updatedAt)}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))
      )}
    </div>
  );

  // Kanban View
  const KanbanView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kanbanColumns.map((col) => {
        const colBugs = filtered.filter(b => b.status === col.status);
        return (
          <div key={col.status}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
              <span className="text-white/60 text-sm font-medium">{col.label}</span>
              <span className="ml-auto text-white/30 text-xs bg-white/5 px-2 py-0.5 rounded-full">{colBugs.length}</span>
            </div>
            <div className="space-y-2">
              {colBugs.length === 0 ? (
                <div
                  className="rounded-xl p-4 text-center text-white/20 text-xs border-2 border-dashed border-white/10"
                >
                  No bugs
                </div>
              ) : (
                colBugs.map((bug, i) => (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <GlassCard
                      className="p-3 hover:border-white/15 transition-all"
                      onClick={() => navigate(`/developer/bug-details/${bug.id}`)}
                    >
                      <p className="text-white/80 text-xs font-medium mb-2 line-clamp-2">{bug.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge value={bug.priority} colors={priorityColors} />
                        <span className="text-white/30 text-xs">{bug.module}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">My Bugs</h2>
          <p className="text-white/40 text-sm">{filtered.length} bug{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { id: 'table', icon: List },
            { id: 'card', icon: LayoutGrid },
            { id: 'kanban', icon: Columns },
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`p-2 rounded-xl transition-all duration-200 ${view === id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search bugs..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white/80 placeholder-white/20 outline-none bg-white/5 border border-white/10 focus:border-emerald-500/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 border ${showFilters || activeFilterCount > 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'text-white/50 hover:text-white border-white/10 hover:border-white/20 bg-white/5'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilterCount > 0 && <span className="bg-emerald-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            {(search || activeFilterCount > 0) && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-sm transition-colors border border-white/10">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/10">
                  {[
                    { key: 'status', label: 'Status', options: Object.values(BUG_STATUS) },
                    { key: 'priority', label: 'Priority', options: Object.values(BUG_PRIORITY) },
                    { key: 'severity', label: 'Severity', options: Object.values(BUG_SEVERITY) },
                    { key: 'module', label: 'Module', options: modules },
                  ].map(({ key, label, options }) => (
                    <div key={key}>
                      <label className="text-white/30 text-xs mb-1 block">{label}</label>
                      <select
                        value={filters[key]}
                        onChange={e => { setFilters(f => ({ ...f, [key]: e.target.value })); setPage(1); }}
                        className="w-full px-3 py-2 rounded-xl text-sm text-white/70 bg-white/5 border border-white/10 focus:border-emerald-500/40 outline-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <option value="" style={{ background: '#111' }}>All</option>
                        {options.map(o => <option key={o} value={o} style={{ background: '#111' }}>{o.replace('_', ' ')}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Bug Views */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {view === 'table' && <TableView />}
        {view === 'card' && <CardView />}
        {view === 'kanban' && <KanbanView />}
      </motion.div>

      {/* Pagination */}
      {view !== 'kanban' && totalPages > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs transition-all duration-200 ${page === p ? 'bg-emerald-500 text-white' : 'text-white/40 hover:text-white hover:bg-white/5 border border-white/10'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyBugsPage;
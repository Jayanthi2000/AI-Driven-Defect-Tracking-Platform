// MyBugsPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Grid, List, Kanban, Plus, ChevronLeft,
  ChevronRight, Bug, ArrowUpDown, X, Calendar, SlidersHorizontal
} from 'lucide-react';
import { getCurrentUser, getBugsByReporter, getUsers } from '../../services/testerService';
import {
  GlassCard, StatusBadge, SeverityBadge, PriorityBadge,
  TimeAgo, GreenButton, EmptyState, PageHeader
} from '../shared/SharedComponents';

const STATUSES = ['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'FIXED', 'READY_FOR_TESTING', 'TESTER_REVIEW', 'APPROVED', 'CLOSED', 'REJECTED', 'REOPENED'];
const KANBAN_COLUMNS = [
  { status: 'OPEN', label: 'Open', color: 'border-blue-500/30 bg-blue-500/5' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-yellow-500/30 bg-yellow-500/5' },
  { status: 'READY_FOR_TESTING', label: 'Ready for Test', color: 'border-cyan-500/30 bg-cyan-500/5' },
  { status: 'APPROVED', label: 'Approved', color: 'border-emerald-500/30 bg-emerald-500/5' },
  { status: 'CLOSED', label: 'Closed', color: 'border-gray-500/30 bg-gray-500/5' },
];

const PAGE_SIZE = 10;

export default function MyBugsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [view, setView] = useState('card');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      setBugs(getBugsByReporter(user.id));
      setUsers(getUsers());
    }
  }, []);

  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unassigned';

  const filtered = useMemo(() => {
    let result = [...bugs];
    if (search) result = result.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.module?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'ALL') result = result.filter(b => b.status === statusFilter);
    if (severityFilter !== 'ALL') result = result.filter(b => b.severity === severityFilter);
    if (priorityFilter !== 'ALL') result = result.filter(b => b.priority === priorityFilter);
    result.sort((a, b) => {
      let av = a[sortBy] || '';
      let bv = b[sortBy] || '';
      if (sortDir === 'asc') return av < bv ? -1 : av > bv ? 1 : 0;
      return av > bv ? -1 : av < bv ? 1 : 0;
    });
    return result;
  }, [bugs, search, statusFilter, severityFilter, priorityFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
    setPage(1);
  };

  const clearFilters = () => {
    setStatusFilter('ALL'); setSeverityFilter('ALL'); setPriorityFilter('ALL'); setSearch(''); setPage(1);
  };

  const activeFilterCount = [statusFilter !== 'ALL', severityFilter !== 'ALL', priorityFilter !== 'ALL'].filter(Boolean).length;

  // Card View
  const CardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {paginated.map((bug, i) => (
        <motion.div
          key={bug.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <button
            onClick={() => navigate(`/tester/bug-details/${bug.id}`)}
            className="w-full text-left bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.05] hover:border-emerald-500/20 transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">{bug.title}</p>
              <SeverityBadge severity={bug.severity} />
            </div>
            <p className="text-xs text-gray-600 font-mono mb-2">{bug.id}</p>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <StatusBadge status={bug.status} />
              <PriorityBadge priority={bug.priority} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-600">
              <span className="bg-white/5 px-1.5 py-0.5 rounded">{bug.module}</span>
              <TimeAgo date={bug.createdAt} />
            </div>
            {bug.assignedDeveloperId && (
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-purple-400">{getUserName(bug.assignedDeveloperId).charAt(0)}</span>
                </div>
                <span className="text-[10px] text-gray-500">{getUserName(bug.assignedDeveloperId)}</span>
              </div>
            )}
          </button>
        </motion.div>
      ))}
    </div>
  );

  // Table View
  const TableView = () => (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {[
                { label: 'Bug ID', field: 'id' },
                { label: 'Title', field: 'title' },
                { label: 'Status', field: 'status' },
                { label: 'Severity', field: 'severity' },
                { label: 'Priority', field: 'priority' },
                { label: 'Module', field: 'module' },
                { label: 'Assigned To', field: null },
                { label: 'Created', field: 'createdAt' },
              ].map(col => (
                <th
                  key={col.label}
                  className={`text-left text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap ${col.field ? 'cursor-pointer hover:text-white' : ''}`}
                  onClick={() => col.field && handleSort(col.field)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.field && sortBy === col.field && (
                      <ArrowUpDown size={10} className="text-emerald-400" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((bug, i) => (
              <motion.tr
                key={bug.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => navigate(`/tester/bug-details/${bug.id}`)}
                className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-all"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{bug.id.split('-').slice(0, 2).join('-')}</td>
                <td className="px-4 py-3 text-white font-medium max-w-48">
                  <span className="truncate block">{bug.title}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={bug.status} /></td>
                <td className="px-4 py-3"><SeverityBadge severity={bug.severity} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={bug.priority} /></td>
                <td className="px-4 py-3 text-xs text-gray-400">{bug.module}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{getUserName(bug.assignedDeveloperId)}</td>
                <td className="px-4 py-3"><TimeAgo date={bug.createdAt} /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );

  // Kanban View
  const KanbanView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {KANBAN_COLUMNS.map(col => {
        const colBugs = filtered.filter(b => b.status === col.status);
        return (
          <div key={col.status} className={`rounded-2xl border p-3 min-h-32 ${col.color}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white">{col.label}</span>
              <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">{colBugs.length}</span>
            </div>
            <div className="space-y-2">
              {colBugs.slice(0, 6).map(bug => (
                <button
                  key={bug.id}
                  onClick={() => navigate(`/tester/bug-details/${bug.id}`)}
                  className="w-full text-left bg-[#0a0a0a]/60 border border-white/10 rounded-xl p-2.5 hover:border-white/20 transition-all"
                >
                  <p className="text-[11px] font-medium text-white line-clamp-2">{bug.title}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <SeverityBadge severity={bug.severity} />
                    <TimeAgo date={bug.createdAt} />
                  </div>
                </button>
              ))}
              {colBugs.length > 6 && (
                <p className="text-[10px] text-gray-600 text-center">+{colBugs.length - 6} more</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Bugs"
        subtitle={`${filtered.length} bug${filtered.length !== 1 ? 's' : ''} found`}
        action={<GreenButton onClick={() => navigate('/tester/report-bug')} size="sm"><Plus size={14} className="inline mr-1" />Report Bug</GreenButton>}
      />

      {/* Toolbar */}
      <GlassCard className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-48 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search bugs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          {/* Status Quick Filter */}
          <div className="flex gap-1.5 overflow-x-auto">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'CLOSED'].map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap border transition-all ${
                  statusFilter === s
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'text-gray-500 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-emerald-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}

          {/* View toggle */}
          <div className="flex gap-1 ml-auto bg-white/5 border border-white/10 rounded-xl p-1">
            {[{ v: 'card', icon: Grid }, { v: 'table', icon: List }, { v: 'kanban', icon: Kanban }].map(({ v, icon: Icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`p-1.5 rounded-lg transition-all ${view === v ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-white'}`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/10">
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>)}
                </select>
                <select
                  value={severityFilter}
                  onChange={e => { setSeverityFilter(e.target.value); setPage(1); }}
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="ALL">All Severities</option>
                  {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select
                  value={priorityFilter}
                  onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="ALL">All Priorities</option>
                  {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => <option key={p}>{p}</option>)}
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="createdAt">Sort: Created</option>
                  <option value="updatedAt">Sort: Updated</option>
                  <option value="title">Sort: Title</option>
                  <option value="severity">Sort: Severity</option>
                  <option value="priority">Sort: Priority</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bug}
          title="No bugs found"
          description={search || activeFilterCount > 0 ? "Try adjusting your search or filters" : "You haven't reported any bugs yet"}
          action={
            !search && !activeFilterCount ?
              <GreenButton onClick={() => navigate('/tester/report-bug')}>
                <Plus size={14} className="inline mr-1" /> Report First Bug
              </GreenButton> : null
          }
        />
      ) : (
        <>
          {view === 'card' && <CardView />}
          {view === 'table' && <TableView />}
          {view === 'kanban' && <KanbanView />}

          {/* Pagination */}
          {view !== 'kanban' && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = page <= 3 ? i + 1 : page + i - 2;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs border transition-all ${
                        p === page
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BUGS_DATA } from "../data/mock/bugsData";
import {
  Plus, Search, Filter, Grid, List, X, ChevronDown, ChevronRight,
  Bug, Clock, CheckCircle2, AlertTriangle, ArrowUpDown,
} from "lucide-react";

const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Open", "In Progress", "Testing", "Resolved", "Closed"];
const PRIORITIES = ["P1", "P2", "P3", "P4"];
const CATEGORIES = ["Authentication", "Dashboard", "Frontend", "Backend", "Payments", "API", "UI/UX", "Notifications", "Analytics", "Performance", "Security"];

const SEV_COLORS = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  High: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};
const STATUS_COLORS = {
  "Open": "bg-red-500/10 text-red-400",
  "In Progress": "bg-blue-500/10 text-blue-400",
  "Testing": "bg-amber-500/10 text-amber-400",
  "Resolved": "bg-emerald-500/10 text-emerald-400",
  "Closed": "bg-slate-500/10 text-slate-400",
};
const PRI_COLORS = { P1: "text-red-400", P2: "text-orange-400", P3: "text-amber-400", P4: "text-slate-400" };

const ITEMS_PER_PAGE = 8;

function Badge({ children, className }) {
  return <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${className}`}>{children}</span>;
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-sm text-slate-300 px-3 py-2 pr-8 focus:outline-none focus:border-emerald-500/30 cursor-pointer hover:border-white/20 transition-colors"
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}

function BugRow({ bug, onDelete }) {
  const navigate = useNavigate();
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group cursor-pointer"
      onClick={() => navigate(`/dashboard/bug/${bug.id}`)}
    >
      <td className="px-4 py-3.5">
        <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{bug.id}</span>
      </td>
      <td className="px-4 py-3.5 max-w-xs">
        <p className="text-sm text-slate-200 group-hover:text-white transition-colors truncate font-medium">{bug.title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{bug.category}</p>
      </td>
      <td className="px-4 py-3.5">
        <Badge className={SEV_COLORS[bug.severity]}>{bug.severity}</Badge>
      </td>
      <td className="px-4 py-3.5">
        <Badge className={STATUS_COLORS[bug.status]}>{bug.status}</Badge>
      </td>
      <td className="px-4 py-3.5">
        <span className={`text-xs font-bold ${PRI_COLORS[bug.priority]}`}>{bug.priority}</span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[10px] font-bold text-black">
            {bug.assignedTo?.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <span className="text-xs text-slate-400">{bug.assignedTo}</span>
        </div>
      </td>
      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/dashboard/bug/${bug.id}`}
            className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.05]">
            View
          </Link>
          <Link to={`/dashboard/bug/${bug.id}`}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-500/10">
            Edit
          </Link>
          <button onClick={() => onDelete(bug.id)}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10">
            Delete
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

function BugCard({ bug, onDelete }) {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4 hover:border-emerald-500/20 transition-all cursor-pointer group"
      onClick={() => navigate(`/dashboard/bug/${bug.id}`)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{bug.id}</span>
        <div className="flex gap-1.5">
          <Badge className={SEV_COLORS[bug.severity]}>{bug.severity}</Badge>
          <span className={`text-xs font-bold ${PRI_COLORS[bug.priority]}`}>{bug.priority}</span>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors mb-1 line-clamp-2">{bug.title}</h3>
      <p className="text-[11px] text-slate-500 mb-3">{bug.category}</p>
      <div className="flex items-center justify-between">
        <Badge className={STATUS_COLORS[bug.status]}>{bug.status}</Badge>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[9px] font-bold text-black">
            {bug.assignedTo?.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <span className="text-[11px] text-slate-500">{bug.assignedTo?.split(" ")[0]}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BugsPage() {
  const [bugs, setBugs] = useState(BUGS_DATA);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", severity: "", priority: "", category: "" });
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [showFilters, setShowFilters] = useState(false);

  const handleDelete = (id) => {
    setBugs(prev => prev.filter(b => b.id !== id));
  };

  const filtered = useMemo(() => {
    let result = bugs.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
      const matchStatus = !filters.status || b.status === filters.status;
      const matchSev = !filters.severity || b.severity === filters.severity;
      const matchPri = !filters.priority || b.priority === filters.priority;
      const matchCat = !filters.category || b.category === filters.category;
      return matchSearch && matchStatus && matchSev && matchPri && matchCat;
    });
    result.sort((a, b) => {
      if (sortBy === "severity") {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.severity] - order[b.severity];
      }
      if (sortBy === "priority") return a.priority.localeCompare(b.priority);
      return a.id.localeCompare(b.id);
    });
    return result;
  }, [bugs, search, filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  const statusCount = (s) => bugs.filter(b => b.status === s).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Bug Management</h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} bugs found</p>
        </div>
        <Link to="/dashboard/create-bug"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors w-fit">
          <Plus size={16} /> Create Bug
        </Link>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", count: statusCount("Open"), icon: Bug, color: "text-red-400" },
          { label: "In Progress", count: statusCount("In Progress"), icon: Clock, color: "text-blue-400" },
          { label: "Testing", count: statusCount("Testing"), icon: AlertTriangle, color: "text-amber-400" },
          { label: "Resolved", count: statusCount("Resolved") + statusCount("Closed"), icon: CheckCircle2, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111318] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
            <s.icon size={16} className={s.color} />
            <div>
              <p className="text-xl font-bold text-white">{s.count}</p>
              <p className="text-[11px] text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search bugs by title, ID, or category..."
              className="w-full bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-sm text-slate-200 pl-9 pr-4 py-2.5 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(p => !p)}
              className={`flex items-center gap-2 border rounded-xl text-sm px-3 py-2.5 transition-colors ${showFilters || activeFiltersCount > 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white"}`}
            >
              <Filter size={14} />
              {activeFiltersCount > 0 && <span className="bg-emerald-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
              Filters
            </button>
            <div className="flex border border-white/[0.08] rounded-xl overflow-hidden">
              <button onClick={() => setView("table")} className={`px-3 py-2.5 transition-colors ${view === "table" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"}`}><List size={15} /></button>
              <button onClick={() => setView("grid")} className={`px-3 py-2.5 transition-colors ${view === "grid" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:text-slate-300"}`}><Grid size={15} /></button>
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-[#1a1f2e] border border-white/[0.08] rounded-xl text-xs text-slate-400 px-3 py-2.5 focus:outline-none cursor-pointer hover:border-white/20 transition-colors">
              <option value="id">Sort: ID</option>
              <option value="severity">Sort: Severity</option>
              <option value="priority">Sort: Priority</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/[0.06] overflow-hidden">
              <FilterSelect label="All Status" value={filters.status} onChange={v => { setFilters(p => ({ ...p, status: v })); setPage(1); }} options={STATUSES} />
              <FilterSelect label="All Severity" value={filters.severity} onChange={v => { setFilters(p => ({ ...p, severity: v })); setPage(1); }} options={SEVERITIES} />
              <FilterSelect label="All Priority" value={filters.priority} onChange={v => { setFilters(p => ({ ...p, priority: v })); setPage(1); }} options={PRIORITIES} />
              <FilterSelect label="All Category" value={filters.category} onChange={v => { setFilters(p => ({ ...p, category: v })); setPage(1); }} options={CATEGORIES} />
              {activeFiltersCount > 0 && (
                <button onClick={() => { setFilters({ status: "", severity: "", priority: "", category: "" }); setSearch(""); setPage(1); }}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 transition-colors">
                  <X size={12} /> Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bug list */}
      {view === "table" ? (
        <div className="bg-[#111318] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["ID", "Title", "Severity", "Status", "Priority", "Assigned To", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-16 text-slate-500 text-sm">No bugs match your filters</td></tr>
                  ) : (
                    paginated.map(bug => <BugRow key={bug.id} bug={bug} onDelete={handleDelete} />)
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {paginated.length === 0 ? (
              <div className="col-span-full text-center py-16 text-slate-500 text-sm">No bugs match your filters</div>
            ) : (
              paginated.map(bug => <BugCard key={bug.id} bug={bug} onDelete={handleDelete} />)
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-500 hover:text-white border border-transparent hover:border-white/[0.08]"}`}>
                {p}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

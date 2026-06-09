import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Bug, User, Workflow, FileText, Bell, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

const TYPE_CONFIG = {
  bug:          { icon: Bug,      color: "text-red-400",     bg: "bg-red-500/10",      label: "Bug",         path: (item) => "/dashboard/bugs" },
  user:         { icon: User,     color: "text-emerald-400", bg: "bg-emerald-500/10",  label: "User",        path: () => "/dashboard/team" },
  workflow:     { icon: Workflow, color: "text-violet-400",  bg: "bg-violet-500/10",   label: "Workflow",    path: () => "/dashboard/workflow" },
  report:       { icon: FileText, color: "text-amber-400",   bg: "bg-amber-500/10",    label: "Report",      path: () => "/dashboard/reports" },
  notification: { icon: Bell,    color: "text-cyan-400",    bg: "bg-cyan-500/10",     label: "Notification",path: () => "/dashboard/notifications" },
};

function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-emerald-500/25 text-emerald-300 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlobalSearch() {
  const { query, results, isOpen, recentSearches, search, open, close, addRecentSearch } = useSearch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, open, close]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const handleSelect = (item) => {
    addRecentSearch(query || item.name);
    const cfg = TYPE_CONFIG[item.type];
    if (cfg) navigate(cfg.path(item));
    close();
  };

  const handleRecentClick = (term) => {
    search(term);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[12%] z-50 w-full max-w-xl -translate-x-1/2 px-4"
          >
            <div className="rounded-2xl border border-white/[0.1] bg-[#0D1117]/95 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
                <Search size={16} className="text-slate-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Search bugs, users, workflows, reports…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />
                <div className="flex items-center gap-2">
                  <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">ESC</kbd>
                  {query && (
                    <button onClick={() => search("")} className="text-slate-500 hover:text-white transition">
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {!query && (
                  <div className="p-3">
                    <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Recent Searches</p>
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white transition"
                      >
                        <Clock size={13} className="text-slate-600" />
                        {term}
                      </button>
                    ))}
                    <div className="mt-3 border-t border-white/[0.05] pt-3 px-2">
                      <p className="text-[10px] text-slate-600">Press <kbd className="border border-white/10 bg-white/[0.04] rounded px-1 font-mono">Ctrl+K</kbd> to toggle search</p>
                    </div>
                  </div>
                )}
                {query && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search size={28} className="text-slate-700 mb-3" />
                    <p className="text-sm text-slate-500">No results for <span className="text-white">"{query}"</span></p>
                    <p className="text-xs text-slate-600 mt-1">Try searching for bugs, users, or workflows</p>
                  </div>
                )}
                {query && results.length > 0 && (
                  <div className="p-2">
                    {["bug", "user", "workflow", "report", "notification"].map((type) => {
                      const items = results.filter(r => r.type === type);
                      if (!items.length) return null;
                      const cfg = TYPE_CONFIG[type];
                      const Icon = cfg.icon;
                      return (
                        <div key={type} className="mb-1">
                          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{cfg.label}s</p>
                          {items.map((item, i) => (
                            <button
                              key={i}
                              onClick={() => handleSelect(item)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/[0.05] transition group"
                            >
                              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                                <Icon size={13} className={cfg.color} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-200 truncate">
                                  <Highlight text={item.name || item.title || ""} query={query} />
                                </p>
                                {item.severity && <p className="text-[11px] text-slate-500">{item.severity} • {item.status}</p>}
                                {item.role && <p className="text-[11px] text-slate-500">{item.role}</p>}
                              </div>
                              <ArrowRight size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition" />
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

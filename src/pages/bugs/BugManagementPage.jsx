import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStore } from '../../data/store';

const S = {
  card: {
    background: 'rgba(10,15,28,0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
  },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.03em',
  },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 3 },
};

const SEVERITY_MAP = {
  critical: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  high:     { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  medium:   { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  low:      { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
};
const STATUS_MAP = {
  resolved:     { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  'in-progress':{ bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  open:         { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.25)' },
};
const PRIORITY_MAP = {
  P0: { color: '#f87171' }, P1: { color: '#fbbf24' },
  P2: { color: '#60a5fa' }, P3: { color: '#94a3b8' },
};

const Badge = ({ label, map }) => {
  const s = map[label] || { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.2)' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border || 'transparent'}`,
      textTransform: 'capitalize', letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>{label}</span>
  );
};

const Avatar = ({ initials }) => (
  <div style={{
    width: 26, height: 26, borderRadius: 8,
    background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(20,184,166,0.2))',
    border: '1px solid rgba(34,197,94,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, color: '#22c55e', flexShrink: 0,
  }}>{initials}</div>
);

export default function BugManagementPage() {
  const bugs = getStore('bugs') || [];
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('table'); // 'table' | 'card'
  const [sortBy, setSortBy] = useState('created');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return bugs.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q) || b.assignee?.toLowerCase().includes(q);
      const matchSev = severityFilter === 'all' || b.severity === severityFilter;
      const matchStat = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchSev && matchStat;
    }).sort((a, b) => {
      if (sortBy === 'severity') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return a.id.localeCompare(b.id);
    });
  }, [bugs, search, severityFilter, statusFilter, sortBy]);

  const stats = [
    { label: 'Total', value: bugs.length, color: '#94a3b8' },
    { label: 'Open', value: bugs.filter(b => b.status === 'open').length, color: '#fbbf24' },
    { label: 'In Progress', value: bugs.filter(b => b.status === 'in-progress').length, color: '#60a5fa' },
    { label: 'Resolved', value: bugs.filter(b => b.status === 'resolved').length, color: '#34d399' },
    { label: 'Critical', value: bugs.filter(b => b.severity === 'critical').length, color: '#f87171' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={S.pageHeader}>
        <div>
          <h1 style={S.sectionTitle}>Bug Management</h1>
          <p style={S.subtitle}>{filtered.length} bugs shown · {bugs.length} total</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 18px', borderRadius: 10,
          background: '#22c55e', color: 'black',
          fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
          boxShadow: '0 0 16px rgba(34,197,94,0.35)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Report Bug
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {stats.map(s => (
          <motion.div key={s.label} whileHover={{ y: -2 }} style={{ ...S.card, padding: '14px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ ...S.card, padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, title, or assignee…"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
              fontSize: 13, color: '#f1f5f9', outline: 'none',
            }}
          />
        </div>

        {/* Severity filter */}
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '9px 14px', fontSize: 13, color: '#94a3b8',
          outline: 'none', cursor: 'pointer',
        }}>
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '9px 14px', fontSize: 13, color: '#94a3b8',
          outline: 'none', cursor: 'pointer',
        }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '9px 14px', fontSize: 13, color: '#94a3b8',
          outline: 'none', cursor: 'pointer',
        }}>
          <option value="created">Sort: ID</option>
          <option value="severity">Sort: Severity</option>
          <option value="status">Sort: Status</option>
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3 }}>
          {[['table','☰'],['card','⊞']].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 12px', borderRadius: 7, fontSize: 13, border: 'none', cursor: 'pointer',
              background: view === v ? 'rgba(34,197,94,0.15)' : 'transparent',
              color: view === v ? '#22c55e' : '#64748b',
              fontWeight: view === v ? 600 : 400,
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ ...S.card, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['ID', 'Title', 'Severity', 'Priority', 'Status', 'Assignee', 'Tags'].map(h => (
                    <th key={h} style={{
                      padding: '13px 16px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, color: '#475569',
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((bug, i) => (
                    <motion.tr key={bug.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelected(selected === bug.id ? null : bug.id)}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#22c55e' }}>{bug.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#e2e8f0', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bug.title}</td>
                      <td style={{ padding: '12px 16px' }}><Badge label={bug.severity} map={SEVERITY_MAP} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: PRIORITY_MAP[bug.priority]?.color || '#94a3b8' }}>{bug.priority}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}><Badge label={bug.status} map={STATUS_MAP} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        {bug.assignee
                          ? <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <Avatar initials={bug.assignee.split(' ').map(n => n[0]).join('')} />
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>{bug.assignee.split(' ')[0]}</span>
                            </div>
                          : <span style={{ fontSize: 12, color: '#334155' }}>Unassigned</span>
                        }
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {bug.tags?.slice(0, 2).map(tag => (
                            <span key={tag} style={{
                              fontSize: 10, padding: '1px 7px', borderRadius: 4,
                              background: 'rgba(255,255,255,0.05)', color: '#64748b',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}>{tag}</span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Selected bug detail row */}
          <AnimatePresence>
            {selected && (() => {
              const bug = bugs.find(b => b.id === selected);
              if (!bug) return null;
              return (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ borderTop: '1px solid rgba(34,197,94,0.15)', background: 'rgba(34,197,94,0.02)', overflow: 'hidden' }}
                >
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#22c55e', marginRight: 12 }}>{bug.id}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{bug.title}</span>
                      </div>
                      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>✕</button>
                    </div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>{bug.description}</p>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {[
                        ['Severity', <Badge label={bug.severity} map={SEVERITY_MAP} />],
                        ['Status', <Badge label={bug.status} map={STATUS_MAP} />],
                        ['Priority', <span style={{ fontSize: 12, fontWeight: 700, color: PRIORITY_MAP[bug.priority]?.color }}>{bug.priority}</span>],
                        ['Created', <span style={{ fontSize: 12, color: '#64748b' }}>{bug.created}</span>],
                        ['Updated', <span style={{ fontSize: 12, color: '#64748b' }}>{bug.updated}</span>],
                      ].map(([label, el]) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, color: '#334155', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
                          {el}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <p style={{ color: '#475569', fontSize: 14 }}>No bugs match your filters</p>
            </div>
          )}

          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#334155' }}>Showing {filtered.length} of {bugs.length}</span>
          </div>
        </motion.div>
      )}

      {/* Card View */}
      {view === 'card' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map((bug, i) => (
            <motion.div key={bug.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              style={{ ...S.card, padding: 20, cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#22c55e' }}>{bug.id}</span>
                <Badge label={bug.severity} map={SEVERITY_MAP} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.4 }}>{bug.title}</p>
              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {bug.description}
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {bug.tags?.map(tag => (
                  <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.05)' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label={bug.status} map={STATUS_MAP} />
                {bug.assignee && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar initials={bug.assignee.split(' ').map(n => n[0]).join('')} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{bug.assignee.split(' ')[0]}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

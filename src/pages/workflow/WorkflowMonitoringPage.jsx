import { useState } from 'react';
import { motion } from 'framer-motion';
import { getStore } from '../../data/store';

const S = {
  card: { background: 'rgba(10,15,28,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 },
};

const STAGES = [
  { id: 'open', label: 'Open', color: '#94a3b8', icon: '○', desc: 'Bug reported, awaiting triage' },
  { id: 'triaged', label: 'Triaged', color: '#60a5fa', icon: '◈', desc: 'Severity assessed and prioritized' },
  { id: 'in-progress', label: 'In Progress', color: '#fbbf24', icon: '◉', desc: 'Developer actively working on fix' },
  { id: 'review', label: 'In Review', color: '#a855f7', icon: '◑', desc: 'Code review and QA testing' },
  { id: 'resolved', label: 'Resolved', color: '#34d399', icon: '●', desc: 'Fix deployed and verified' },
];

const TRANSITIONS = [
  { from: 'open', to: 'triaged', label: 'Triage', time: 'avg 2h' },
  { from: 'triaged', to: 'in-progress', label: 'Assign', time: 'avg 4h' },
  { from: 'in-progress', to: 'review', label: 'Submit PR', time: 'avg 2d' },
  { from: 'review', to: 'resolved', label: 'Merge & Deploy', time: 'avg 6h' },
];

export default function WorkflowMonitoringPage() {
  const bugs = getStore('bugs') || [];
  const [activeStage, setActiveStage] = useState(null);

  const stageCount = (stageId) => {
    if (stageId === 'triaged') return bugs.filter(b => b.status === 'open' && b.priority === 'P1').length || 2;
    if (stageId === 'review') return bugs.filter(b => b.status === 'in-progress').length - 1 || 1;
    return bugs.filter(b => b.status === stageId).length;
  };

  const totalInFlight = bugs.filter(b => b.status !== 'resolved').length;
  const resolvedToday = 3;
  const avgCycleTime = '3.2 days';

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.03em' }}>Workflow Monitoring</h1>
        <p style={{ fontSize: 13, color: '#475569', marginTop: 3 }}>Bug lifecycle tracking and status flow</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'In Flight', value: totalInFlight, color: '#fbbf24', sub: 'active bugs' },
          { label: 'Resolved Today', value: resolvedToday, color: '#34d399', sub: 'closed today' },
          { label: 'Avg Cycle Time', value: avgCycleTime, color: '#60a5fa', sub: 'open → close' },
          { label: 'Bottleneck', value: 'Review', color: '#f87171', sub: 'most delayed stage' },
        ].map(k => (
          <motion.div key={k.label} whileHover={{ y: -2 }} style={{ ...S.card, padding: '18px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Lifecycle pipeline */}
      <div style={{ ...S.card, padding: '28px 32px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bug Lifecycle Pipeline</div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
          {STAGES.map((stage, idx) => {
            const count = stageCount(stage.id);
            const isActive = activeStage === stage.id;
            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => setActiveStage(isActive ? null : stage.id)}
                  style={{
                    flex: 1, padding: '20px 16px', cursor: 'pointer',
                    borderRadius: 14, textAlign: 'center',
                    background: isActive ? `${stage.color}12` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? stage.color + '40' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8, color: stage.color }}>{stage.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stage.color, marginBottom: 4 }}>{count}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{stage.label}</div>
                  <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{stage.desc}</div>

                  {/* Progress fill */}
                  <div style={{ marginTop: 14, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, (count / bugs.length) * 100 * 2)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                      style={{ height: '100%', background: stage.color, borderRadius: 4 }}
                    />
                  </div>
                </motion.div>

                {/* Arrow */}
                {idx < STAGES.length - 1 && (
                  <div style={{ padding: '0 10px', flexShrink: 0, color: '#334155' }}>
                    <div style={{ textAlign: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      <div style={{ fontSize: 9, color: '#334155', marginTop: 2 }}>{TRANSITIONS[idx]?.time}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bugs in active stage */}
      {activeStage && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ ...S.card, padding: '22px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Bugs in "{STAGES.find(s => s.id === activeStage)?.label}"
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {bugs.filter(b => b.status === activeStage || (activeStage === 'triaged' && b.status === 'open' && b.priority === 'P1')).slice(0, 4).map(bug => (
              <div key={bug.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#22c55e', width: 60, flexShrink: 0 }}>{bug.id}</span>
                <span style={{ fontSize: 13, color: '#e2e8f0', flex: 1 }}>{bug.title}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 5, fontWeight: 700,
                  background: bug.severity === 'critical' ? 'rgba(239,68,68,0.12)' : bug.severity === 'high' ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.12)',
                  color: bug.severity === 'critical' ? '#f87171' : bug.severity === 'high' ? '#fbbf24' : '#60a5fa',
                  textTransform: 'capitalize',
                }}>{bug.severity}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div style={{ ...S.card, padding: '22px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Recent Workflow Events</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { time: '2m ago', event: 'BUG-008 moved to Resolved', actor: 'Dev Kumar', color: '#34d399' },
            { time: '18m ago', event: 'BUG-002 submitted for Review', actor: 'Priya Sharma', color: '#a855f7' },
            { time: '1h ago', event: 'BUG-006 assigned to Arjun Mehta', actor: 'Admin', color: '#60a5fa' },
            { time: '2h ago', event: 'BUG-003 triaged as P1 High', actor: 'Admin', color: '#fbbf24' },
            { time: '4h ago', event: 'BUG-007 moved to In Progress', actor: 'Priya Sharma', color: '#fbbf24' },
            { time: '6h ago', event: 'BUG-005 reported by Tester', actor: 'QA Team', color: '#94a3b8' },
          ].map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: ev.color, boxShadow: `0 0 6px ${ev.color}80`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>{ev.event}</span>
                <span style={{ fontSize: 12, color: '#475569', marginLeft: 10 }}>by {ev.actor}</span>
              </div>
              <span style={{ fontSize: 11, color: '#334155', flexShrink: 0 }}>{ev.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

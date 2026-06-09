import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStore } from '../../data/store';
import { aiInsights, duplicateBugs, bugTrendData, severityDistribution, aiActivityTimeline } from '../../data/aiData';
import SeverityPredictionPanel from '../../components/ai/SeverityPredictionPanel';
import RootCausePanel from '../../components/ai/RootCausePanel';
import ConfidenceScorePanel from '../../components/ai/ConfidenceScorePanel';
import SimilarBugDetection from '../../components/ai/SimilarBugDetection';
import RecommendationPanel from '../../components/ai/RecommendationPanel';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:        'rgba(8,12,24,0.85)',
  bgCard:    'rgba(13,18,32,0.9)',
  bgHover:   'rgba(18,25,44,0.95)',
  border:    'rgba(255,255,255,0.07)',
  borderLit: 'rgba(255,255,255,0.12)',
  text:      '#e8edf5',
  muted:     '#4a5568',
  subtle:    '#64748b',
};

const SEV = {
  critical: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', label: 'CRITICAL', dot: '#ef4444' },
  high:     { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.25)',  label: 'HIGH',     dot: '#f97316' },
  medium:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)',  label: 'MEDIUM',   dot: '#3b82f6' },
  low:      { color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)',  label: 'LOW',      dot: '#10b981' },
};

const CARD = {
  background: T.bgCard,
  backdropFilter: 'blur(24px)',
  border: `1px solid ${T.border}`,
  borderRadius: 14,
};

// ─── Enhanced insights data ───────────────────────────────────────────────────
const INSIGHTS = [
  {
    id: 1,
    severity: 'critical',
    confidence: 94,
    title: 'Memory Leak Pattern Detected',
    summary: 'BUG-006 shows classic memory leak signatures. WebSocket connections not closed after component unmount, causing heap to grow ~18MB per session.',
    rootCause: {
      primary: 'Missing cleanup in useEffect hook — no return function to close WebSocket on unmount.',
      chain: [
        { step: 'useEffect mounts WebSocket connection', type: 'origin' },
        { step: 'Component unmounts without cleanup', type: 'propagation' },
        { step: 'Event listeners remain active in memory', type: 'propagation' },
        { step: 'Heap grows ~18MB per user session', type: 'impact' },
      ],
      codeFile: 'src/components/dashboard/RealtimeStatusGrid.jsx',
      codeLine: 47,
      codeSnippet: `useEffect(() => {\n  const ws = new WebSocket(WS_URL);\n  ws.onmessage = handleMessage;\n  // ❌ Missing: return () => ws.close();\n}, []);`,
    },
    similarBugs: [
      { id: 'BUG-006', title: 'Dashboard freezes after 30min', similarity: 97, status: 'open' },
      { id: 'BUG-001', title: 'Notifications not clearing', similarity: 82, status: 'in-progress' },
      { id: 'BUG-018', title: 'Socket reconnect loop', similarity: 71, status: 'closed' },
    ],
    recommendations: [
      { priority: 1, type: 'fix', title: 'Add useEffect cleanup', description: 'Return ws.close() inside the useEffect to teardown on unmount.', effort: 'low', impact: 'high', autoFixable: true },
      { priority: 2, type: 'pattern', title: 'Implement connection pooling', description: 'Reuse existing WebSocket connections instead of spawning new ones per component.', effort: 'medium', impact: 'high', autoFixable: false },
      { priority: 3, type: 'monitor', title: 'Add heap monitoring', description: 'Integrate performance.memory checks to alert when heap exceeds threshold.', effort: 'low', impact: 'medium', autoFixable: false },
    ],
    affectedBugs: ['BUG-006', 'BUG-001'],
    category: 'Performance',
    color: '#f87171',
    detectedAt: '12 min ago',
    severityPrediction: {
      predicted: 'critical',
      previous: 'high',
      wasUpgraded: true,
      factors: [
        { label: 'Memory growth rate', weight: 38, value: 'High' },
        { label: 'User session impact', weight: 29, value: '18% sessions' },
        { label: 'Reproduction rate', weight: 22, value: '100%' },
        { label: 'Data loss risk', weight: 11, value: 'None' },
      ],
    },
  },
  {
    id: 2,
    severity: 'high',
    confidence: 87,
    title: 'Auth Token Expiry Misconfiguration',
    summary: 'JWT token lifetime is 15 minutes due to incorrect server config. Users are getting logged out unexpectedly during normal workflows.',
    rootCause: {
      primary: 'Environment variable JWT_EXPIRY set to "15m" in production — should be "24h".',
      chain: [
        { step: 'JWT_EXPIRY env var misconfigured in .env.production', type: 'origin' },
        { step: 'Tokens expire after 15 min instead of 24h', type: 'propagation' },
        { step: 'Refresh logic not triggered before expiry window', type: 'propagation' },
        { step: 'Users get silently logged out mid-session', type: 'impact' },
      ],
      codeFile: 'server/config/auth.config.js',
      codeLine: 12,
      codeSnippet: `module.exports = {\n  jwtExpiry: process.env.JWT_EXPIRY || '24h',\n  // Prod .env has: JWT_EXPIRY=15m  ❌\n};`,
    },
    similarBugs: [
      { id: 'BUG-001', title: 'Session expired error on dashboard', similarity: 95, status: 'open' },
      { id: 'BUG-009', title: 'Redirect loop on token refresh', similarity: 68, status: 'open' },
    ],
    recommendations: [
      { priority: 1, type: 'fix', title: 'Correct JWT_EXPIRY env var', description: 'Set JWT_EXPIRY=24h in all production environment configs and redeploy.', effort: 'low', impact: 'high', autoFixable: false },
      { priority: 2, type: 'pattern', title: 'Implement proactive token refresh', description: 'Refresh tokens 5 minutes before expiry using a silent background check.', effort: 'medium', impact: 'high', autoFixable: false },
      { priority: 3, type: 'monitor', title: 'Alert on abnormal logout rates', description: 'Track session termination events; alert if rate exceeds 2% per hour.', effort: 'low', impact: 'medium', autoFixable: false },
    ],
    affectedBugs: ['BUG-001'],
    category: 'Security',
    color: '#fb923c',
    detectedAt: '1 hr ago',
    severityPrediction: {
      predicted: 'high',
      previous: 'medium',
      wasUpgraded: true,
      factors: [
        { label: 'User impact breadth', weight: 42, value: 'All users' },
        { label: 'Security implication', weight: 31, value: 'Session theft risk' },
        { label: 'Frequency', weight: 18, value: 'Every session' },
        { label: 'Data exposure', weight: 9, value: 'Minimal' },
      ],
    },
  },
  {
    id: 3,
    severity: 'medium',
    confidence: 76,
    title: 'Chart Re-render Loop on Resize',
    summary: 'Recharts components trigger expensive full re-renders on every resize event. No debouncing applied — up to 60+ renders per second detected.',
    rootCause: {
      primary: 'No ResizeObserver debounce — resize events fire at 60fps causing expensive DOM operations.',
      chain: [
        { step: 'Window resize triggers ResizeObserver callback', type: 'origin' },
        { step: 'Component state updates on every pixel change', type: 'propagation' },
        { step: 'Full chart re-render including data recalculation', type: 'propagation' },
        { step: 'UI stutter and dropped frames on resize', type: 'impact' },
      ],
      codeFile: 'src/components/charts/AreaAnalyticsChart.jsx',
      codeLine: 23,
      codeSnippet: `useEffect(() => {\n  const obs = new ResizeObserver(() => {\n    setDimensions(getDims()); // ❌ No debounce\n  });\n  obs.observe(containerRef.current);\n}, []);`,
    },
    similarBugs: [
      { id: 'BUG-002', title: 'Dashboard laggy on window resize', similarity: 93, status: 'open' },
      { id: 'BUG-014', title: 'Charts blank after sidebar toggle', similarity: 74, status: 'in-progress' },
    ],
    recommendations: [
      { priority: 1, type: 'fix', title: 'Debounce resize handler', description: 'Wrap the ResizeObserver callback in a 200ms debounce to reduce render frequency.', effort: 'low', impact: 'high', autoFixable: true },
      { priority: 2, type: 'pattern', title: 'Memoize chart data props', description: 'Use useMemo on data transformations to prevent recalculation on unrelated re-renders.', effort: 'low', impact: 'medium', autoFixable: false },
    ],
    affectedBugs: ['BUG-002'],
    category: 'UI',
    color: '#60a5fa',
    detectedAt: '3 hr ago',
    severityPrediction: {
      predicted: 'medium',
      previous: 'medium',
      wasUpgraded: false,
      factors: [
        { label: 'Frame drop severity', weight: 35, value: 'Moderate' },
        { label: 'User scope', weight: 28, value: 'Desktop only' },
        { label: 'Workaround available', weight: 22, value: 'Yes (avoid resize)' },
        { label: 'Data integrity risk', weight: 15, value: 'None' },
      ],
    },
  },
  {
    id: 4,
    severity: 'low',
    confidence: 91,
    title: 'PDF Export Blank Page Injection',
    summary: 'PDF generation inserts blank pages between sections due to improper page break CSS being applied globally rather than conditionally.',
    rootCause: {
      primary: 'CSS page-break-before: always applied globally instead of conditionally at section boundaries.',
      chain: [
        { step: 'Global CSS applies page-break-before: always', type: 'origin' },
        { step: 'Every div triggers a page break in print mode', type: 'propagation' },
        { step: 'Blank pages inserted between report sections', type: 'impact' },
      ],
      codeFile: 'src/styles/globals.css',
      codeLine: 218,
      codeSnippet: `/* ❌ Applied to all elements */\n.report-section {\n  page-break-before: always;\n}\n/* ✅ Should be: .report-section + .report-section */`,
    },
    similarBugs: [
      { id: 'BUG-003', title: 'Extra blank pages in PDF report', similarity: 99, status: 'open' },
      { id: 'BUG-007', title: 'Print view adds empty sheets', similarity: 61, status: 'closed' },
    ],
    recommendations: [
      { priority: 1, type: 'fix', title: 'Scope page-break CSS correctly', description: 'Change selector to .report-section + .report-section to only break between sibling sections.', effort: 'low', impact: 'high', autoFixable: true },
      { priority: 2, type: 'pattern', title: 'Add print preview in CI', description: 'Add automated screenshot test for PDF output to catch regressions.', effort: 'medium', impact: 'medium', autoFixable: false },
    ],
    affectedBugs: ['BUG-003'],
    category: 'Export',
    color: '#34d399',
    detectedAt: '6 hr ago',
    severityPrediction: {
      predicted: 'low',
      previous: 'medium',
      wasUpgraded: false,
      factors: [
        { label: 'Workflow disruption', weight: 40, value: 'Low' },
        { label: 'User scope', weight: 30, value: 'Export users' },
        { label: 'Data loss risk', weight: 20, value: 'None' },
        { label: 'Fix complexity', weight: 10, value: 'Trivial' },
      ],
    },
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const getSevStyle = (sev) => SEV[sev] || SEV.low;

// ─── Sub-components ───────────────────────────────────────────────────────────
const SeverityBadge = ({ severity, size = 'sm' }) => {
  const s = getSevStyle(severity);
  const pad = size === 'lg' ? '4px 12px' : '2px 8px';
  const fs = size === 'lg' ? 11 : 10;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: pad, borderRadius: 6, fontSize: fs, fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: '0.06em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

const InsightCard = ({ insight, isSelected, onClick }) => {
  const s = getSevStyle(insight.severity);
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.99 }}
      style={{
        width: '100%', textAlign: 'left', padding: '14px 16px', cursor: 'pointer',
        background: isSelected ? s.bg : T.bgCard,
        border: `1px solid ${isSelected ? s.border : T.border}`,
        borderRadius: 12, transition: 'all 0.18s ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: s.color, borderRadius: '12px 0 0 12px',
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <SeverityBadge severity={insight.severity} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{insight.confidence}%</span>
          <div style={{ width: 32, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${insight.confidence}%`, height: '100%', background: s.color, borderRadius: 4 }} />
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 6, lineHeight: 1.35 }}>{insight.title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 10, padding: '1px 7px', borderRadius: 4,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
          color: T.subtle,
        }}>{insight.category}</span>
        <span style={{ fontSize: 10, color: T.muted }}>{insight.detectedAt}</span>
      </div>
    </motion.button>
  );
};

const KpiCard = ({ label, value, color, icon, sublabel }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: `0 8px 32px ${color}15` }}
    style={{ ...CARD, padding: '18px 20px', transition: 'box-shadow 0.2s' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: `${color}14`, border: `1px solid ${color}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>{icon}</div>
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{label}</div>
    {sublabel && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{sublabel}</div>}
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIAnalysisPage() {
  const bugs = getStore('bugs') || [];
  const [selected, setSelected] = useState(1);
  const [activeTab, setActiveTab] = useState('severity'); // severity | rootcause | confidence | similar | recommendations
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  const active = INSIGHTS.find(i => i.id === selected);
  const totalAnalyzed = bugs.length || 24;
  const avgConfidence = Math.round(INSIGHTS.reduce((s, i) => s + i.confidence, 0) / INSIGHTS.length);
  const criticalCount = INSIGHTS.filter(i => i.severity === 'critical').length;
  const autoFixable = INSIGHTS.reduce((s, i) => s + i.recommendations.filter(r => r.autoFixable).length, 0);

  const runAnalysis = useCallback(async () => {
    setIsRunningAnalysis(true);
    setAnalysisComplete(false);
    await new Promise(r => setTimeout(r, 2200));
    setIsRunningAnalysis(false);
    setAnalysisComplete(true);
  }, []);

  const TABS = [
    { id: 'severity',        label: 'Severity Prediction', icon: '⚡' },
    { id: 'rootcause',       label: 'Root Cause',          icon: '🔬' },
    { id: 'confidence',      label: 'Confidence Score',    icon: '🎯' },
    { id: 'similar',         label: 'Similar Bugs',        icon: '🔗' },
    { id: 'recommendations', label: 'Recommendations',     icon: '💡' },
  ];

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 4px' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 13,
            background: 'linear-gradient(135deg, rgba(168,85,247,0.22), rgba(34,197,94,0.1))',
            border: '1px solid rgba(168,85,247,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L15 22H9l-.3-7C6.7 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 21, fontWeight: 800, color: T.text, letterSpacing: '-0.035em', lineHeight: 1 }}>AI Analysis</h1>
            <p style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
              DefectAI Engine · {totalAnalyzed} bugs analyzed ·{' '}
              <span style={{ color: '#22c55e' }}>Model v2.4</span>
            </p>
          </div>
        </div>

        <motion.button
          onClick={runAnalysis}
          disabled={isRunningAnalysis}
          whileHover={!isRunningAnalysis ? { scale: 1.02, boxShadow: '0 0 20px rgba(168,85,247,0.35)' } : {}}
          whileTap={!isRunningAnalysis ? { scale: 0.98 } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 10, border: 'none', cursor: isRunningAnalysis ? 'not-allowed' : 'pointer',
            background: isRunningAnalysis ? 'rgba(168,85,247,0.12)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
            color: isRunningAnalysis ? '#a855f7' : '#fff',
            fontSize: 13, fontWeight: 700,
            transition: 'all 0.2s',
          }}
        >
          {isRunningAnalysis ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #a855f7', borderTopColor: 'transparent', borderRadius: '50%' }} />
              Analyzing…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Run Analysis
            </>
          )}
        </motion.button>
      </div>

      {/* ── KPI Bar ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        <KpiCard label="AI Insights" value={INSIGHTS.length}   color="#a855f7" icon="🔍" sublabel="This scan" />
        <KpiCard label="Avg Confidence" value={`${avgConfidence}%`} color="#22c55e" icon="🎯" sublabel="Across all insights" />
        <KpiCard label="Critical Issues" value={criticalCount} color="#f87171" icon="🚨" sublabel="Need immediate action" />
        <KpiCard label="Auto-Fixable" value={autoFixable}    color="#fbbf24" icon="⚡" sublabel="One-click resolutions" />
      </div>

      {/* ── Main Layout ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 14, alignItems: 'start' }}>

        {/* ── Insight List ─────────────────────────────────────────────── */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
            {INSIGHTS.length} Insights Found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {INSIGHTS.map(ins => (
              <InsightCard
                key={ins.id}
                insight={ins}
                isSelected={selected === ins.id}
                onClick={() => setSelected(ins.id)}
              />
            ))}
          </div>

          {/* Activity feed */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 2 }}>
              Recent AI Activity
            </div>
            <div style={{ ...CARD, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {aiActivityTimeline.slice(0, 4).map(ev => (
                <div key={ev.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                    background: ev.type === 'severity_upgraded' ? 'rgba(248,113,113,0.12)' :
                               ev.type === 'duplicate_detected' ? 'rgba(96,165,250,0.12)' :
                               ev.type === 'trend_alert' ? 'rgba(251,146,60,0.12)' : 'rgba(52,211,153,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                  }}>
                    {ev.type === 'severity_upgraded' ? '⬆' : ev.type === 'duplicate_detected' ? '🔗' : ev.type === 'trend_alert' ? '📈' : '💡'}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{ev.message}</div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detail Panel ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {/* Issue Header */}
              <div style={{ ...CARD, padding: '20px 24px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <SeverityBadge severity={active.severity} size="lg" />
                    <span style={{
                      fontSize: 10, padding: '3px 9px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.04)', color: T.subtle,
                      border: `1px solid ${T.border}`, letterSpacing: '0.04em',
                    }}>{active.category}</span>
                    {active.severityPrediction.wasUpgraded && (
                      <span style={{
                        fontSize: 10, padding: '3px 9px', borderRadius: 6,
                        background: 'rgba(168,85,247,0.1)', color: '#c084fc',
                        border: '1px solid rgba(168,85,247,0.25)', letterSpacing: '0.04em',
                      }}>⬆ AI Upgraded</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {active.affectedBugs.map(bid => (
                      <span key={bid} style={{
                        fontFamily: 'monospace', fontSize: 11, color: '#22c55e',
                        padding: '2px 8px', borderRadius: 5,
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                      }}>{bid}</span>
                    ))}
                  </div>
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: T.text, marginBottom: 8, letterSpacing: '-0.025em', lineHeight: 1.25 }}>
                  {active.title}
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, margin: 0 }}>{active.summary}</p>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                      padding: '7px 14px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: activeTab === tab.id
                        ? `linear-gradient(135deg, ${active.color}22, ${active.color}10)`
                        : 'rgba(255,255,255,0.03)',
                      color: activeTab === tab.id ? active.color : T.muted,
                      fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500,
                      borderBottom: activeTab === tab.id ? `2px solid ${active.color}` : '2px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === 'severity' && (
                    <SeverityPredictionPanel prediction={active.severityPrediction} color={active.color} />
                  )}
                  {activeTab === 'rootcause' && (
                    <RootCausePanel rootCause={active.rootCause} color={active.color} />
                  )}
                  {activeTab === 'confidence' && (
                    <ConfidenceScorePanel confidence={active.confidence} color={active.color} insight={active} />
                  )}
                  {activeTab === 'similar' && (
                    <SimilarBugDetection bugs={active.similarBugs} color={active.color} />
                  )}
                  {activeTab === 'recommendations' && (
                    <RecommendationPanel recommendations={active.recommendations} color={active.color} />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
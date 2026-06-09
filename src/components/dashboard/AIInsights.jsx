import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, AlertTriangle, Brain, Target, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const predictionData = [
  { day: 'Mon', actual: 12, predicted: 11, risk: 20 },
  { day: 'Tue', actual: 18, predicted: 16, risk: 35 },
  { day: 'Wed', actual: 14, predicted: 15, risk: 28 },
  { day: 'Thu', actual: 22, predicted: 20, risk: 45 },
  { day: 'Fri', actual: 16, predicted: 18, risk: 32 },
  { day: 'Sat', actual: null, predicted: 21, risk: 50 },
  { day: 'Sun', actual: null, predicted: 19, risk: 42 },
];

const recommendations = [
  { id: 1, type: 'risk', priority: 'critical', title: 'Memory leak risk in auth service', description: 'Based on current error rate trends, there is an 87% probability of auth service degradation within 48 hours.', confidence: 87, action: 'Review WebSocket handlers', tags: ['auth', 'memory', 'performance'] },
  { id: 2, type: 'optimization', priority: 'high', title: 'Sprint capacity underutilized', description: 'Team velocity data suggests 23% unused capacity in Sprint 18. Recommend pulling forward P2 backlog items.', confidence: 91, action: 'Reassign backlog items', tags: ['sprint', 'planning'] },
  { id: 3, type: 'pattern', priority: 'medium', title: 'Bug clustering detected in auth module', description: '67% of critical bugs originate from the authentication module. Recommend dedicated code review session.', confidence: 78, action: 'Schedule code review', tags: ['auth', 'quality'] },
  { id: 4, type: 'positive', priority: 'info', title: 'Team productivity at 6-month high', description: 'Dev Kumar and Ravi Nair show exceptional output patterns. Current sprint trajectory is 96% to goal.', confidence: 94, action: 'Maintain current pace', tags: ['productivity', 'team'] },
];

const aiMetrics = [
  { label: 'Model Accuracy', value: 91, color: 'var(--green)' },
  { label: 'Prediction Confidence', value: 87, color: 'var(--accent)' },
  { label: 'Risk Detection Rate', value: 94, color: 'var(--purple)' },
  { label: 'False Positive Rate', value: 6, color: 'var(--amber)', inverted: true },
];

const typeIcon = { risk: AlertTriangle, optimization: Target, pattern: Brain, positive: Sparkles };
const typeColor = { risk: 'var(--red)', optimization: 'var(--accent)', pattern: 'var(--purple)', positive: 'var(--green)' };
const priorityBadge = { critical: 'badge-red', high: 'badge-amber', medium: 'badge-blue', info: 'badge-green' };

function ConfidenceMeter({ value, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Confidence</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{value}%</span>
      </div>
      <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 2, boxShadow: `0 0 8px ${color}80` }} />
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => p.value !== null && (
        <div key={p.dataKey} style={{ fontSize: 13, color: p.color, display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AIInsights() {
  const [activeRec, setActiveRec] = useState(null);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* AI Status Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))',
          border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
        }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--purple), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-glow 2s infinite' }}>
          <Brain size={18} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Nexus AI Engine Active</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Analyzing 847 data points · Last updated 2 minutes ago · Model v2.4.1</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }} />
          All systems nominal
        </div>
      </motion.div>

      {/* AI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {aiMetrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="glass-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{m.label}</div>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 700, color: m.color, marginBottom: 10 }}>{m.value}%</div>
            <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${m.inverted ? (100 - m.value) : m.value}%` }} transition={{ duration: 1.2, delay: 0.4 }}
                style={{ height: '100%', background: m.color, borderRadius: 2 }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Prediction Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="font-display" style={{ fontWeight: 600, fontSize: 14 }}>Bug Count Prediction</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Actual vs AI predicted — 7 day forecast</div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {[['Actual', 'var(--accent)'], ['Predicted', 'var(--purple)'], ['Risk Index', 'var(--red)']].map(([name, color]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ width: 24, height: 2, background: color, display: 'inline-block', borderRadius: 1 }} />
                {name}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={predictionData}>
              <defs>
                <linearGradient id="pa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="var(--accent)" fill="url(#pa)" strokeWidth={2} connectNulls={false} />
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke="var(--purple)" fill="url(#pp)" strokeWidth={2} strokeDasharray="5 4" />
              <Line type="monotone" dataKey="risk" name="Risk Index" stroke="var(--red)" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Matrix */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="font-display" style={{ fontWeight: 600, fontSize: 14 }}>Risk Matrix</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current threat assessment</div>
          </div>
          {[
            { area: 'Auth Service', risk: 87, color: 'var(--red)' },
            { area: 'Data Pipeline', risk: 52, color: 'var(--amber)' },
            { area: 'API Gateway', risk: 34, color: 'var(--accent)' },
            { area: 'Frontend', risk: 18, color: 'var(--green)' },
            { area: 'Database', risk: 25, color: 'var(--green)' },
          ].map((item, i) => (
            <motion.div key={item.area} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
              style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.area}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.risk}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.risk}%` }} transition={{ duration: 1, delay: 0.6 + i * 0.07 }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${item.color}60, ${item.color})`, borderRadius: 3 }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="font-display" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>AI Recommendations</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {recommendations.map((rec, i) => {
            const Icon = typeIcon[rec.type];
            const color = typeColor[rec.type];
            return (
              <motion.div key={rec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.07 }}
                className="glass-card" style={{ padding: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onClick={() => setActiveRec(activeRec === rec.id ? null : rec.id)}
                whileHover={{ scale: 1.01 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span className={`badge ${priorityBadge[rec.priority]}`}>{rec.priority}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35 }}>{rec.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{rec.description}</div>
                <ConfidenceMeter value={rec.confidence} color={color} />
                {activeRec === rec.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Recommended Action</div>
                    <div style={{ fontSize: 13, color: color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ChevronRight size={14} /> {rec.action}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                      {rec.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
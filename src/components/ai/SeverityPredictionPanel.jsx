import { motion } from 'framer-motion';

const CARD = {
  background: 'rgba(13,18,32,0.9)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
};

const SEV_ICONS = {
  critical: { icon: '🚨', color: '#f87171' },
  high:     { icon: '🔴', color: '#fb923c' },
  medium:   { icon: '🟡', color: '#60a5fa' },
  low:      { icon: '🟢', color: '#34d399' },
};

const SEV_ORDER = ['critical', 'high', 'medium', 'low'];

export default function SeverityPredictionPanel({
  prediction = {},
  color = '#a855f7'
}) {
  const {
  predicted = 'low',
  previous = 'low',
  wasUpgraded = false,
  factors = []
} = prediction;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Prediction result */}
      <div style={{ ...CARD, padding: '22px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 16 }}>
          Severity Prediction
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
          {/* Previous */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>REPORTED AS</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 16 }}>{SEV_ICONS[previous]?.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize' }}>{previous}</span>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            {wasUpgraded && (
              <span style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, letterSpacing: '0.06em' }}>AI UPGRADED</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%' }}>
              <div style={{ flex: 1, height: 2, background: wasUpgraded ? `linear-gradient(90deg, rgba(255,255,255,0.1), ${color})` : 'rgba(255,255,255,0.08)' }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={wasUpgraded ? color : '#475569'} strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>

          {/* Predicted */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>AI PREDICTS</div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
                background: `${color}14`, border: `1px solid ${color}35`,
                boxShadow: wasUpgraded ? `0 0 18px ${color}20` : 'none',
              }}
            >
              <span style={{ fontSize: 18 }}>{SEV_ICONS[predicted]?.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color, textTransform: 'capitalize' }}>{predicted}</span>
            </motion.div>
          </div>
        </div>

        {/* Severity scale */}
        <div>
          <div style={{ fontSize: 10, color: '#475569', marginBottom: 10 }}>SEVERITY SCALE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {SEV_ORDER.map((sev, i) => {
              const s = SEV_ICONS[sev];
              const isActive = sev === predicted;
              const isPrev = sev === previous;
              return (
                <div key={sev} style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    padding: '8px 4px', borderRadius: 8, textAlign: 'center',
                    background: isActive ? `${s.color}14` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? s.color + '35' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: 14, marginBottom: 3 }}>{s.icon}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: isActive ? s.color : '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {sev}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: s.color, fontWeight: 700, whiteSpace: 'nowrap' }}>AI ▼</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 16 }}>
          Prediction Factors
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {factors.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{f.label}</span>
                  <span style={{ fontSize: 11, color: '#64748b', padding: '1px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {f.value}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{f.weight}%</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.weight}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}77)`, borderRadius: 4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
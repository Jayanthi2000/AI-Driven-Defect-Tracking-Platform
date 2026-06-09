import React from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle.jsx'

const AI_CARDS = [
  {
    icon: Brain,
    title: 'Intelligent Pattern Recognition',
    description: 'Our transformer-based model analyzes historical defect data to detect recurring patterns before they escalate into production incidents.',
    metric: '94.8% accuracy',
    color: 'emerald',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Risk Scoring',
    description: 'Every code commit gets a real-time defect risk score based on complexity, author history, test coverage, and dependency changes.',
    metric: '3.2× fewer regressions',
    color: 'violet',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    description: 'Continuous monitoring of error rates, latency spikes, and log anomalies — automatically correlated with recent deployments.',
    metric: 'Detects in <90 seconds',
    color: 'amber',
  },
]

const COLOR_MAP = {
  emerald: {
    icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    metric: 'text-emerald-400',
    glow: 'hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]',
  },
  violet: {
    icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    metric: 'text-violet-400',
    glow: 'hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    metric: 'text-amber-400',
    glow: 'hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]',
  },
}

export default function AIInsightsSection() {
  return (
    <section id="ai-insights" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div aria-hidden="true" className="glow-orb w-[500px] h-[500px] bg-emerald-500/5 -right-20 top-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <SectionTitle
              badge="AI Engine"
              badgeVariant="emerald"
              title="Defect intelligence that"
              highlight="actually understands code"
              subtitle="Built on the latest advances in LLMs and static analysis — DefectAI doesn't just track bugs, it understands them at a semantic level."
              align="left"
              className="mb-10"
            />

            <div className="space-y-4">
              {AI_CARDS.map(({ icon: Icon, title, description, metric, color }, i) => {
                const styles = COLOR_MAP[color]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`glass-card p-5 flex gap-4 transition-all duration-300 ${styles.glow}`}
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-white text-sm">{title}</h3>
                        <span className={`text-xs font-display font-bold whitespace-nowrap ${styles.metric}`}>{metric}</span>
                      </div>
                      <p className="text-slate-500 font-body text-sm leading-relaxed mt-1">{description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right — AI console mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-charcoal-800/40">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono-custom text-slate-400">DefectAI Analysis Engine — Live</span>
                <span className="ml-auto badge-emerald text-[10px] py-0.5 px-2 flex items-center gap-1">
                  <Sparkles size={10} />
                  Active
                </span>
              </div>

              {/* Console content */}
              <div className="p-5 font-mono-custom text-sm space-y-3">
                {[
                  { label: '→ Analyzing commit', value: 'feat/auth-refresh-token', color: 'text-slate-300' },
                  { label: '→ Lines changed:', value: '+342 / -178', color: 'text-slate-300' },
                  { label: '→ Complexity delta:', value: '+18% (HIGH)', color: 'text-amber-400' },
                  { label: '→ Test coverage:', value: '61% (below threshold)', color: 'text-red-400' },
                  { label: '→ Risk score:', value: '87/100 — CRITICAL', color: 'text-red-400' },
                  { label: '', value: '', color: '' },
                  { label: '✦ AI Diagnosis:', value: 'Token invalidation race condition detected', color: 'text-emerald-400' },
                  { label: '✦ Affected paths:', value: 'src/auth/refresh.ts:L248-L266', color: 'text-emerald-300' },
                  { label: '✦ Suggested fix:', value: 'Add mutex lock + exponential backoff', color: 'text-emerald-300' },
                  { label: '✦ Similar bugs fixed:', value: '14 resolved in last 6 months', color: 'text-violet-400' },
                ].map(({ label, value, color }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-baseline gap-2"
                  >
                    {label && <span className="text-slate-600 text-xs whitespace-nowrap">{label}</span>}
                    <span className={`text-xs ${color}`}>{value}</span>
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-slate-600 text-xs">→</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    className="w-2 h-4 bg-emerald-400 rounded-sm"
                  />
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between bg-charcoal-800/20">
                <span className="text-xs text-slate-500 font-body">Analysis complete — 3 actions suggested</span>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 font-display font-semibold flex items-center gap-1 transition-colors">
                  View full report <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

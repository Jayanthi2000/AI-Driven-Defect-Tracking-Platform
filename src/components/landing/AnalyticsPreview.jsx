import React from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, BarChart3, Activity } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle.jsx'

const BAR_DATA = [
  { label: 'Mon', bugs: 42, resolved: 38 },
  { label: 'Tue', bugs: 58, resolved: 51 },
  { label: 'Wed', bugs: 35, resolved: 35 },
  { label: 'Thu', bugs: 72, resolved: 60 },
  { label: 'Fri', bugs: 49, resolved: 47 },
  { label: 'Sat', bugs: 18, resolved: 18 },
  { label: 'Sun', bugs: 24, resolved: 20 },
]

const maxBugs = Math.max(...BAR_DATA.map(d => d.bugs))

const STAT_CARDS = [
  {
    icon: TrendingDown,
    label: 'Avg Resolution Time',
    value: '2.4 hrs',
    change: '↓ 31% vs last month',
    positive: true,
    color: 'emerald',
  },
  {
    icon: Activity,
    label: 'Bug Velocity',
    value: '12.6/day',
    change: '↓ 18% from peak',
    positive: true,
    color: 'violet',
  },
  {
    icon: TrendingUp,
    label: 'Team Throughput',
    value: '94.2%',
    change: '↑ 7% this sprint',
    positive: true,
    color: 'amber',
  },
  {
    icon: BarChart3,
    label: 'AI Prediction Accuracy',
    value: '99.2%',
    change: '↑ 2.1% this quarter',
    positive: true,
    color: 'emerald',
  },
]

const COLOR_MAP = {
  emerald: {
    icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15',
    value: 'text-emerald-400',
    change: 'text-emerald-500',
  },
  violet: {
    icon: 'text-violet-400 bg-violet-500/10 border-violet-500/15',
    value: 'text-violet-400',
    change: 'text-violet-500',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/15',
    value: 'text-amber-400',
    change: 'text-amber-500',
  },
}

export default function AnalyticsPreview() {
  return (
    <section id="analytics" className="section-padding relative overflow-hidden">
      <div aria-hidden="true" className="glow-orb w-[500px] h-[500px] bg-amber-500/4 -right-20 bottom-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Analytics"
          badgeVariant="amber"
          title="Visibility into every aspect of"
          highlight="your defect pipeline"
          subtitle="Real-time dashboards and historical trend analysis give engineering leaders the data they need to make informed quality decisions."
          className="mb-16"
        />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Chart card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white">Weekly Bug Activity</h3>
                <p className="text-slate-500 text-sm font-body mt-0.5">Reported vs Resolved — current sprint</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-body">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />Reported
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />Resolved
                </span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end justify-between gap-2 h-[180px] sm:h-[220px]">
              {BAR_DATA.map(({ label, bugs, resolved }, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex gap-1 items-end w-full justify-center" style={{ height: '180px' }}>
                    {/* Reported bar */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: `${(bugs / maxBugs) * 100}%`,
                        transformOrigin: 'bottom',
                      }}
                      className="flex-1 bg-amber-500/30 hover:bg-amber-500/50 rounded-t-md transition-colors duration-200 cursor-pointer"
                    />
                    {/* Resolved bar */}
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        height: `${(resolved / maxBugs) * 100}%`,
                        transformOrigin: 'bottom',
                      }}
                      className="flex-1 bg-emerald-500/40 hover:bg-emerald-500/60 rounded-t-md transition-colors duration-200 cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-body">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
            {STAT_CARDS.map(({ icon: Icon, label, value, change, color }, i) => {
              const styles = COLOR_MAP[color]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card glass-card-hover p-5 flex flex-col gap-3"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${styles.icon}`}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-body mb-1">{label}</div>
                    <div className={`font-display font-bold text-2xl ${styles.value}`}>{value}</div>
                    <div className={`text-[11px] font-body mt-1 ${styles.change}`}>{change}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

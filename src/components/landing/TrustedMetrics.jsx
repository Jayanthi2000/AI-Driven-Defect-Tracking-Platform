import React from 'react'
import { motion } from 'framer-motion'

const METRICS = [
  { value: '10×', label: 'Faster bug resolution', color: 'gradient-text-emerald' },
  { value: '68%', label: 'Reduction in defect backlog', color: 'gradient-text-violet' },
  { value: '99.9%', label: 'Platform uptime SLA', color: 'gradient-text-emerald' },
  { value: '2,400+', label: 'Engineering teams trust us', color: 'gradient-text-amber' },
]

const LOGOS = [
  'Nexora Labs', 'Axiom Sys', 'PulseTech', 'StackEdge', 'Velora', 'Brightbit',
]

export default function TrustedMetricsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="divider mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {METRICS.map(({ value, label, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card glass-card-hover p-6 text-center"
            >
              <div className={`font-display font-bold text-4xl ${color}`}>{value}</div>
              <div className="text-slate-400 font-body text-sm mt-2 leading-snug">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trusted by logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-slate-600 text-xs font-body uppercase tracking-widest mb-7">
            Trusted by leading engineering teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {LOGOS.map((logo, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="font-display font-semibold text-slate-600 text-sm tracking-wide hover:text-slate-400 transition-colors duration-200 cursor-default"
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

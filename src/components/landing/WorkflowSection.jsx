import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Brain, GitMerge, CheckCircle2, ArrowDown } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle.jsx'

const STEPS = [
  {
    icon: Plus,
    step: '01',
    title: 'Report & Capture',
    description: 'Developers, testers, or automated monitors submit defects via web UI, API, browser extension, or CI/CD integration.',
    color: 'emerald',
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI Triage & Prioritize',
    description: 'The DefectAI engine analyzes the report, assigns a severity score, identifies root cause candidates, and routes to the right owner.',
    color: 'violet',
  },
  {
    icon: GitMerge,
    step: '03',
    title: 'Investigate & Fix',
    description: 'The assigned developer receives full context, AI-suggested fixes, related historical bugs, and linked code locations.',
    color: 'amber',
  },
  {
    icon: CheckCircle2,
    step: '04',
    title: 'Verify & Close',
    description: 'QA validates the fix against automated test suites, AI confirms the defect signature is no longer present, and the ticket closes.',
    color: 'emerald',
  },
]

const COLOR_MAP = {
  emerald: {
    icon: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/20',
    step: 'text-emerald-500/40',
    line: 'from-emerald-500/20',
  },
  violet: {
    icon: 'text-violet-400 bg-violet-500/12 border-violet-500/20',
    step: 'text-violet-500/40',
    line: 'from-violet-500/20',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/12 border-amber-500/20',
    step: 'text-amber-500/40',
    line: 'from-amber-500/20',
  },
}

export default function WorkflowSection() {
  return (
    <section id="workflow" className="section-padding relative overflow-hidden">
      <div aria-hidden="true" className="glow-orb w-[450px] h-[450px] bg-violet-500/5 -left-20 top-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="How It Works"
          badgeVariant="violet"
          title="From bug report to resolution in"
          highlight="four intelligent steps"
          subtitle="DefectAI handles the cognitive overhead of defect management so your team can focus on writing great code."
          className="mb-16"
        />

        <div className="relative max-w-3xl mx-auto">
          {STEPS.map(({ icon: Icon, step, title, description, color }, i) => {
            const styles = COLOR_MAP[color]
            const isLast = i === STEPS.length - 1
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex gap-6 items-start mb-2">
                  {/* Icon column */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${styles.icon}`}>
                      <Icon size={21} />
                    </div>
                    {!isLast && (
                      <div className={`w-px h-12 mt-2 bg-gradient-to-b ${styles.line} to-transparent`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8 flex-1">
                    <div className={`font-display font-bold text-4xl ${styles.step} leading-none mb-1`}>{step}</div>
                    <h3 className="font-display font-bold text-white text-xl mb-2">{title}</h3>
                    <p className="text-slate-400 font-body text-[0.9375rem] leading-relaxed">{description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Brain, GitBranch, BarChart3, Shield, Users, Bell, Code2 } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle.jsx'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Defect Triage',
    description: 'Machine learning models automatically classify, prioritize, and route every bug to the right developer in milliseconds.',
    badge: 'Core AI',
    badgeVariant: 'emerald',
    accent: 'emerald',
  },
  {
    icon: Zap,
    title: 'Instant Root Cause Analysis',
    description: 'DefectAI scans your codebase and logs to pinpoint the exact line of code responsible for each reported defect.',
    badge: 'AI-Powered',
    badgeVariant: 'emerald',
    accent: 'emerald',
  },
  {
    icon: GitBranch,
    title: 'Git & CI/CD Integration',
    description: 'Native integrations with GitHub, GitLab, Bitbucket, Jenkins, and CircleCI for seamless developer workflows.',
    badge: 'Integrations',
    badgeVariant: 'violet',
    accent: 'violet',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Comprehensive dashboards with defect velocity, resolution trends, team performance metrics, and predictive forecasts.',
    badge: 'Insights',
    badgeVariant: 'amber',
    accent: 'amber',
  },
  {
    icon: Bell,
    title: 'Smart Alerting',
    description: 'Context-aware notifications that alert the right people at the right time — without flooding inboxes with noise.',
    badge: 'Productivity',
    badgeVariant: 'violet',
    accent: 'violet',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Real-time commenting, assignment workflows, and sprint integration to keep developers and testers aligned.',
    badge: 'Collaboration',
    badgeVariant: 'emerald',
    accent: 'emerald',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC2 Type II compliant with SSO, RBAC, audit logs, and data residency controls for regulated industries.',
    badge: 'Security',
    badgeVariant: 'amber',
    accent: 'amber',
  },
  {
    icon: Code2,
    title: 'Fix Suggestions',
    description: 'AI-generated code suggestions and patches that developers can review and apply directly from the bug detail view.',
    badge: 'AI-Powered',
    badgeVariant: 'emerald',
    accent: 'emerald',
  },
]

const accentMap = {
  emerald: {
    icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15',
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]',
    border: 'group-hover:border-emerald-500/25',
  },
  violet: {
    icon: 'text-violet-400 bg-violet-500/10 border-violet-500/15',
    glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]',
    border: 'group-hover:border-violet-500/25',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/15',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.08)]',
    border: 'group-hover:border-amber-500/25',
  },
}

export default function FeaturesGrid() {
  return (
    <section id="features" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Platform Features"
          badgeVariant="emerald"
          title="Everything your team needs to"
          highlight="ship defect-free software"
          subtitle="DefectAI combines cutting-edge AI with an elegant developer experience to make quality software the default — not the exception."
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, badge, badgeVariant, accent }, i) => {
            const styles = accentMap[accent]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`group glass-card p-6 flex flex-col gap-4 transition-all duration-300 cursor-default ${styles.border} ${styles.glow}`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                  <Icon size={19} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`badge-${badgeVariant} self-start`}>{badge}</span>
                  <h3 className="font-display font-semibold text-white text-[1rem] leading-snug">{title}</h3>
                  <p className="text-slate-500 font-body text-sm leading-relaxed">{description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

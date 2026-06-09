import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import GradientButton from '../ui/GradientButton.jsx'

export default function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass-card p-12 sm:p-16 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div aria-hidden="true" className="glow-orb w-[600px] h-[600px] bg-emerald-500/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

          <div className="relative z-10">
            <span className="badge-emerald mb-6 inline-flex items-center gap-1.5">
              <Zap size={12} />
              Start free — no credit card required
            </span>

            <h2 className="font-display font-bold text-[2.25rem] sm:text-5xl leading-[1.12] text-white mb-6 max-w-3xl mx-auto text-balance">
              Ready to ship{' '}
              <span className="gradient-text-emerald">defect-free software</span>{' '}
              at scale?
            </h2>

            <p className="text-slate-400 font-body text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 2,400+ engineering teams who reduced their bug backlog by 68% in the first 30 days using DefectAI's intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <GradientButton variant="emerald" size="lg">
                  Start your free trial
                  <ArrowRight size={18} />
                </GradientButton>
              </Link>
              <Link to="/login">
                <GradientButton variant="outline" size="lg">
                  Sign in to your account
                </GradientButton>
              </Link>
            </div>

            <p className="mt-6 text-slate-600 text-xs font-body">
              14-day free trial · No credit card · Cancel anytime · SOC2 compliant
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

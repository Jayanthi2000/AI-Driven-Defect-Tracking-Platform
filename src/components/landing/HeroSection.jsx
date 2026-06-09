import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  AlertCircle,
  GitBranch,
  CheckCircle2,
  Clock,
  ChevronRight,
  Brain,
  BarChart3,
  Users,
  Star,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const BUGS = [
  {
    id: 'BUG-2341',
    title: 'Auth token refresh fails on timeout',
    module: 'auth',
    severity: 'critical',
    ai: '98%',
    time: '2m ago',
    assignee: 'AR',
    status: 'open',
    pulse: true,
  },
  {
    id: 'BUG-2339',
    title: 'Dashboard chart renders empty on mobile',
    module: 'frontend',
    severity: 'high',
    ai: '91%',
    time: '14m ago',
    assignee: 'ME',
    status: 'in_progress',
    pulse: false,
  },
  {
    id: 'BUG-2337',
    title: 'Pagination breaks with >1 000 records',
    module: 'backend',
    severity: 'medium',
    ai: '84%',
    time: '1h ago',
    assignee: 'SL',
    status: 'review',
    pulse: false,
  },
  {
    id: 'BUG-2334',
    title: 'CSV export encoding error for unicode',
    module: 'data',
    severity: 'low',
    ai: '76%',
    time: '3h ago',
    assignee: 'KP',
    status: 'resolved',
    pulse: false,
  },
]

const STATS = [
  {
    label: 'Open bugs',
    value: '148',
    delta: '−12%',
    up: false,
    color: '#ef4444',
  },
  {
    label: 'In progress',
    value: '43',
    delta: '+8%',
    up: true,
    color: '#f59e0b',
  },
  {
    label: 'Resolved',
    value: '891',
    delta: '+24%',
    up: true,
    color: '#10b981',
  },
  {
    label: 'AI accuracy',
    value: '99.2%',
    delta: 'Precision',
    up: true,
    color: '#8b5cf6',
  },
]

const FEATURES = [
  {
    icon: Brain,
    label: 'AI triage',
    desc: 'Auto-prioritise on severity & impact',
  },
  {
    icon: GitBranch,
    label: 'Git-aware',
    desc: 'Link bugs to commits & PRs instantly',
  },
  {
    icon: BarChart3,
    label: 'Real-time analytics',
    desc: 'Sprint health at a glance',
  },
  {
    icon: Shield,
    label: 'Role-based access',
    desc: 'Admin · Dev · QA out of the box',
  },
]

const SEVERITY = {
  critical: {
    label: 'Critical',
    bg: 'rgba(239,68,68,0.12)',
    text: '#f87171',
    dot: '#ef4444',
  },
  high: {
    label: 'High',
    bg: 'rgba(245,158,11,0.12)',
    text: '#fbbf24',
    dot: '#f59e0b',
  },
  medium: {
    label: 'Medium',
    bg: 'rgba(139,92,246,0.12)',
    text: '#a78bfa',
    dot: '#8b5cf6',
  },
  low: {
    label: 'Low',
    bg: 'rgba(16,185,129,0.12)',
    text: '#34d399',
    dot: '#10b981',
  },
}

const STATUS_ICON = {
  open: {
    icon: AlertCircle,
    color: '#ef4444',
  },
  in_progress: {
    icon: Clock,
    color: '#f59e0b',
  },
  review: {
    icon: GitBranch,
    color: '#8b5cf6',
  },
  resolved: {
    icon: CheckCircle2,
    color: '#10b981',
  },
}

const AVATARS = [
  { initials: 'EK', bg: '#10b981' },
  { initials: 'MR', bg: '#8b5cf6' },
  { initials: 'SR', bg: '#f59e0b' },
  { initials: 'AR', bg: '#3b82f6' },
  { initials: 'KL', bg: '#ef4444' },
]

/* ─────────────────────────────────────────────
   NOISE TEXTURE
───────────────────────────────────────────── */

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`

/* ─────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────── */

function AiBadge({ score }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.03em',
        background: 'rgba(16,185,129,0.1)',
        color: '#34d399',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 6,
        padding: '2px 7px',
      }}
    >
      <Sparkles size={10} />
      {score} match
    </span>
  )
}

function SeverityPill({ sev }) {
  const s = SEVERITY[sev]

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '2px 6px',
        borderRadius: 5,
        background: s.bg,
        color: s.text,
      }}
    >
      {s.label}
    </span>
  )
}

function Avatar({ initials, bg, size = 28 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        color: '#000',
        flexShrink: 0,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {initials}
    </div>
  )
}

function PulseDot({ color }) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: 8,
        height: 8,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
          opacity: 0.6,
          animation: 'defect-ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
        }}
      />

      <span
        style={{
          position: 'relative',
          borderRadius: '50%',
          width: 8,
          height: 8,
          background: color,
        }}
      />
    </span>
  )
}

/* ─────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────── */

function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0)

  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true

          const num = parseFloat(to.replace(/[^0-9.]/g, ''))
          const dur = 1400
          const start = performance.now()

          const tick = (now) => {
            const t = Math.min((now - start) / dur, 1)
            const ease = 1 - Math.pow(1 - t, 3)

            setVal(Math.round(ease * num * 10) / 10)

            if (t < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [to])

  const display = to.includes('.')
    ? val.toFixed(1)
    : Math.round(val).toLocaleString()

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

/* ─────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────── */

export default function HeroSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const cardY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const headY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [hoveredBug, setHoveredBug] = useState(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes defect-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes defect-shimmer {
          0% {
            background-position: -400px 0;
          }

          100% {
            background-position: 400px 0;
          }
        }

        @keyframes defect-scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translateY(420px);
            opacity: 0;
          }
        }

        @keyframes defect-glow-pulse {
          0%, 100% {
            opacity: 0.5;
          }

          50% {
            opacity: 1;
          }
        }

        .defect-hero *,
        .defect-hero *::before,
        .defect-hero *::after {
          box-sizing: border-box;
        }

        .defect-hero {
          font-family: 'Space Grotesk', sans-serif;
        }

        .defect-display {
          font-family: 'Syne', sans-serif;
        }

        .defect-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .defect-scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(16,185,129,0.0) 20%,
            rgba(16,185,129,0.6) 50%,
            rgba(16,185,129,0.0) 80%,
            transparent 100%
          );

          animation: defect-scan 4s linear infinite;
          pointer-events: none;
        }

        .defect-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.04) 50%,
            rgba(255,255,255,0) 100%
          );

          background-size: 400px 100%;
          animation: defect-shimmer 3s linear infinite;
        }

        .defect-bug-row {
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease;

          cursor: pointer;
        }

        .defect-bug-row:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(16,185,129,0.25) !important;
          transform: translateX(3px);
        }

        .defect-stat-card {
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .defect-stat-card:hover {
          border-color: rgba(255,255,255,0.15) !important;
          background: rgba(255,255,255,0.05) !important;
        }

        .defect-cta-primary {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          padding: 0 28px;
          height: 52px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

          text-decoration: none;

          box-shadow: 0 0 0 0 rgba(16,185,129,0.4);
        }

        .defect-cta-primary:hover {
          transform: translateY(-2px) scale(1.01);

          box-shadow:
            0 12px 32px rgba(16,185,129,0.35),
            0 0 0 3px rgba(16,185,129,0.15);
        }

        .defect-cta-secondary {
          position: relative;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 500;
          padding: 0 24px;
          height: 52px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75);
          text-decoration: none;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .defect-cta-secondary:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.22);
          color: #fff;
        }

        .defect-feature-card {
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .defect-feature-card:hover {
          border-color: rgba(16,185,129,0.3) !important;
          background: rgba(16,185,129,0.04) !important;
        }

        @media (max-width: 1024px) {
          .defect-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .defect-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .defect-sidebar {
            display: none !important;
          }

          .defect-features-grid {
            grid-template-columns: 1fr !important;
          }

          .defect-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .defect-dashboard {
            overflow-x: auto;
          }
        }

        @media (max-width: 640px) {
          .defect-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section
        ref={containerRef}
        className="defect-hero"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 96,
          paddingBottom: 80,
          overflow: 'hidden',
          background: '#080A0E',
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '55%',
              transform: 'translate(-50%,-50%)',
              width: 900,
              height: 900,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)',
              animation: 'defect-glow-pulse 6s ease-in-out infinite',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 600,
              height: 600,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: -60,
              left: -80,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
              `,
              backgroundSize: '56px 56px',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: NOISE,
              backgroundSize: '200px 200px',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: 1160,
            width: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 28 }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.22)',
                borderRadius: 100,
                padding: '6px 16px 6px 8px',
                fontSize: 13,
                fontWeight: 500,
                color: '#34d399',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(16,185,129,0.15)',
                  borderRadius: 100,
                  padding: '2px 9px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#6ee7b7',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <Sparkles size={10} />
                New
              </span>

              AI-Powered Defect Intelligence v2.0 is live

              <ChevronRight
                size={14}
                style={{ color: '#10b981' }}
              />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="defect-display"
            style={{
              y: headY,
              opacity: fade,
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              textAlign: 'center',
              letterSpacing: '-0.025em',
              color: '#fff',
              maxWidth: 860,
              margin: 0,
            }}
          >
            Track bugs smarter with{' '}
            <span
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #34d399 0%, #10b981 40%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI-driven
            </span>{' '}
            analysis
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            style={{
              marginTop: 24,
              fontSize: 18,
              lineHeight: 1.7,
              color: 'rgba(148,163,184,0.9)',
              textAlign: 'center',
              maxWidth: 580,
            }}
          >
            DefectAI automatically triages, prioritizes, and suggests
            fixes using advanced machine learning — so your team ships
            quality software faster.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            style={{
              marginTop: 36,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Link
              to="/register"
              className="defect-cta-primary"
            >
              Start for free
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="defect-cta-secondary"
            >
              View live demo

              <span
                style={{
                  fontSize: 11,
                  color: 'rgba(148,163,184,0.6)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '2px 7px',
                }}
              >
                No CC
              </span>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.46 }}
            style={{
              marginTop: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  style={{
                    marginLeft: i === 0 ? 0 : -10,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: a.bg,
                    border: '2px solid #080A0E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#000',
                    fontFamily: "'Space Grotesk',sans-serif",
                    zIndex: 5 - i,
                    position: 'relative',
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    style={{
                      color: '#f59e0b',
                      fill: '#f59e0b',
                    }}
                  />
                ))}
              </div>

              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(148,163,184,0.7)',
                }}
              >
                Trusted by{' '}
                <strong
                  style={{
                    color: 'rgba(203,213,225,0.9)',
                    fontWeight: 600,
                  }}
                >
                  2,400+
                </strong>{' '}
                engineering teams
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
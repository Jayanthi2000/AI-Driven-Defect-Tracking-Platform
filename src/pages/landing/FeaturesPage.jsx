import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";

// ── Icons ──────────────────────────────────────────────────────────────────
const BugIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M9.172 5.172a4 4 0 015.656 0M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.343 6.343L3 3m18 0l-3.343 3.343M6.343 17.657L3 21m18 0l-3.343-3.343" />
  </svg>
);
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

// ── Animation Helpers ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Noise / Grid overlay (pure CSS, no canvas) ─────────────────────────────
const GridOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `
        linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }}
  />
);

// ── Glow orb ──────────────────────────────────────────────────────────────
const Orb = ({ className }) => (
  <div
    className={`pointer-events-none absolute rounded-full blur-[120px] opacity-25 ${className}`}
  />
);

// ── Feature data ──────────────────────────────────────────────────────────
const features = [
  {
    icon: <BugIcon />,
    title: "AI Bug Detection",
    desc: "Neural pattern recognition surfaces bugs before users encounter them. Zero false-positive noise.",
    accent: "emerald",
    badge: "Core",
    detail: ["Automated root-cause analysis", "Cross-stack tracing", "Priority scoring"],
  },
  {
    icon: <SparklesIcon />,
    title: "Smart Suggestions",
    desc: "Context-aware fix recommendations drawn from millions of resolved issues across the ecosystem.",
    accent: "violet",
    badge: "AI",
    detail: ["One-click patch previews", "Historical pattern matching", "Confidence scoring"],
  },
  {
    icon: <UsersIcon />,
    title: "Team Collaboration",
    desc: "Real-time presence, threaded discussions, and async workflows that keep teams in sync.",
    accent: "sky",
    badge: "Collab",
    detail: ["Live cursors & presence", "Mention & assign flows", "Audit trail"],
  },
  {
    icon: <ActivityIcon />,
    title: "Real-time Monitoring",
    desc: "Sub-second ingestion pipeline. Watch your production environment breathe — live.",
    accent: "emerald",
    badge: "Live",
    detail: ["<50 ms alert latency", "Multi-region dashboards", "PagerDuty & Slack"],
  },
  {
    icon: <ChartIcon />,
    title: "Bug Analytics",
    desc: "Turn defect data into product intelligence. Understand velocity, MTTR, and engineer impact.",
    accent: "violet",
    badge: "Insights",
    detail: ["DORA metrics built-in", "Custom KPI dashboards", "CSV / API export"],
  },
  {
    icon: <ChatIcon />,
    title: "AI Chat Assistant",
    desc: "Ask anything about your codebase, bugs, or metrics. Get answers — not docs links.",
    accent: "sky",
    badge: "GPT-4o",
    detail: ["Natural language queries", "Code context aware", "24 / 7 availability"],
  },
];

const accentMap = {
  emerald: {
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    glow: "shadow-emerald-500/10",
    icon: "bg-emerald-500/10 text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    check: "text-emerald-400",
    gradient: "from-emerald-500/20",
  },
  violet: {
    border: "border-violet-500/30 hover:border-violet-400/60",
    glow: "shadow-violet-500/10",
    icon: "bg-violet-500/10 text-violet-400",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    check: "text-violet-400",
    gradient: "from-violet-500/20",
  },
  sky: {
    border: "border-sky-500/30 hover:border-sky-400/60",
    glow: "shadow-sky-500/10",
    icon: "bg-sky-500/10 text-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    check: "text-sky-400",
    gradient: "from-sky-500/20",
  },
};

// ── Stats ─────────────────────────────────────────────────────────────────
const stats = [
  { value: "99.97%", label: "Bug detection accuracy", sub: "across 140M+ events/day" },
  { value: "4.2×", label: "Faster MTTR", sub: "vs. industry average" },
  { value: "12 ms", label: "Median alert latency", sub: "p99 under 80 ms" },
  { value: "50k+", label: "Engineering teams", sub: "across 90 countries" },
];

// ── Workflow steps ────────────────────────────────────────────────────────
const workflowSteps = [
  { num: "01", title: "Ingest", desc: "Events stream in from SDKs, CI/CD hooks, or our universal collector." },
  { num: "02", title: "Classify", desc: "Transformer models cluster, deduplicate, and score every defect." },
  { num: "03", title: "Suggest", desc: "LLM-powered recommendations land in your IDE or Slack — with full context." },
  { num: "04", title: "Resolve", desc: "One-click patch, automated PR, or assign — your team's choice." },
];

// ══════════════════════════════════════════════════════════════════════════
export default function DefectAIFeaturesPage() {
  const [activeCard, setActiveCard] = useState(null);
  const [count, setCount] = useState({ bugs: 0, teams: 0, latency: 0 });

  // Simple counter animation for stats
  useEffect(() => {
    const targets = { bugs: 9997, teams: 50000, latency: 12 };
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount({
        bugs: Math.round(ease * targets.bugs),
        teams: Math.round(ease * targets.teams),
        latency: Math.round(ease * targets.latency),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => requestAnimationFrame(tick), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050810] text-white overflow-hidden font-sans">
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .glass-strong {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
        .text-gradient-em {
          background: linear-gradient(135deg, #34d399 0%, #a78bfa 60%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-title {
          background: linear-gradient(160deg, #f8fafc 30%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .noise {
          position: relative;
        }
        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
          z-index: 0;
        }
        .card-glow:hover {
          box-shadow: 0 0 40px -10px rgba(52,211,153,0.2), 0 0 80px -30px rgba(167,139,250,0.15);
        }
        .workflow-line {
          background: linear-gradient(180deg, rgba(52,211,153,0.6) 0%, rgba(167,139,250,0.6) 100%);
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid rgba(52,211,153,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 5s ease-in-out infinite; }
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .scan-line {
          animation: scan-line 4s linear infinite;
        }
      `}</style>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative noise pt-28 pb-24 overflow-hidden">
        <GridOverlay />
        <Orb className="w-[700px] h-[700px] bg-emerald-500 -top-48 -left-48" />
        <Orb className="w-[600px] h-[600px] bg-violet-600 -top-32 -right-32" />
        <Orb className="w-[400px] h-[400px] bg-sky-500 bottom-0 left-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 glass border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8 text-sm text-emerald-300"
          >
            <span className="relative pulse-ring w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Powered by GPT-4o · Launching DefectAI 2.0
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[1.04] tracking-tight mb-6"
          >
            <span className="text-gradient-title">Squash every bug</span>
            <br />
            <span className="text-gradient-em">before users do.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl leading-relaxed mb-10"
          >
            DefectAI fuses real-time monitoring with large language models to detect, explain, and
            suggest fixes for bugs — automatically, at scale, and with surgical precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-br from-emerald-400 to-emerald-600 text-[#050810] shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.03]">
              Start for free
              <ArrowRightIcon />
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm glass border border-white/10 text-slate-300 hover:border-white/25 hover:text-white transition-all duration-300">
              View live demo
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.p
            variants={fadeIn}
            custom={5}
            initial="hidden"
            animate="visible"
            className="mt-8 text-xs text-slate-600 tracking-wide uppercase"
          >
            Trusted by engineers at&nbsp;
            {["Stripe", "Vercel", "Linear", "Notion", "Figma", "Supabase"].map((co, i) => (
              <span key={co} className="text-slate-500 font-medium">
                {co}{i < 5 ? " · " : ""}
              </span>
            ))}
          </motion.p>
        </div>

        {/* Hero terminal card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto mt-20 px-6 float"
        >
          <div className="glass-strong border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-4 text-xs text-slate-500 font-mono">defectai — live monitor</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                3 active streams
              </span>
            </div>
            {/* Content */}
            <div className="relative p-6 font-mono text-sm overflow-hidden">
              {/* Scan line */}
              <div className="scan-line absolute left-0 right-0 h-px bg-emerald-400/20 pointer-events-none" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "NullPointerException", file: "auth/session.ts:142", sev: "CRITICAL", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
                  { label: "Memory Leak Detected", file: "workers/cache.js:89", sev: "HIGH", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
                  { label: "Race Condition", file: "db/queries.ts:307", sev: "MEDIUM", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-lg border p-3.5 ${item.bg}`}>
                    <div className={`text-xs font-semibold mb-1 ${item.color}`}>{item.sev}</div>
                    <div className="text-white/90 text-xs leading-snug mb-2">{item.label}</div>
                    <div className="text-slate-500 text-[11px]">{item.file}</div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-400">
                      <SparklesIcon />
                      <span>Fix suggested</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                <span className="text-emerald-500">▶</span>
                <span>AI model classified 2,847 events in the last 60 s · 0 false positives</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <AnimatedSection>
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent" />
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.06]">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  custom={i}
                  className="glass p-8 lg:p-10 text-center group hover:bg-white/[0.04] transition-colors duration-300"
                >
                  <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-em mb-1.5">
                    {s.value}
                  </div>
                  <div className="text-white/80 font-medium text-sm mb-1">{s.label}</div>
                  <div className="text-slate-600 text-xs">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════ FEATURES GRID ═══════════════════════ */}
      <AnimatedSection>
        <section className="relative py-24 overflow-hidden">
          <GridOverlay />
          <Orb className="w-[500px] h-[500px] bg-violet-700 top-0 right-0" />

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            {/* Section header */}
            <div className="text-center mb-16">
              <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                Capabilities
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-title leading-tight mb-5">
                Everything your team<br />needs to ship confidently
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="max-w-xl mx-auto text-slate-400 text-lg">
                Six AI-native modules, one unified platform. No duct tape required.
              </motion.p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const a = accentMap[f.accent];
                return (
                  <motion.div
                    key={f.title}
                    variants={fadeUp}
                    custom={i}
                    onMouseEnter={() => setActiveCard(i)}
                    onMouseLeave={() => setActiveCard(null)}
                    className={`relative group glass card-glow border ${a.border} rounded-2xl p-6 cursor-default transition-all duration-500 overflow-hidden`}
                  >
                    {/* Top gradient shine */}
                    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${a.gradient} to-transparent opacity-60`} />

                    {/* Background bloom on hover */}
                    <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${a.gradient} to-transparent blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      {/* Icon + badge row */}
                      <div className="flex items-start justify-between mb-5">
                        <div className={`p-2.5 rounded-xl ${a.icon} border border-white/[0.06]`}>
                          {f.icon}
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${a.badge}`}>
                          {f.badge}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-white mb-2.5">{f.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-5">{f.desc}</p>

                      {/* Detail list */}
                      <ul className="space-y-1.5">
                        {f.detail.map((d) => (
                          <li key={d} className="flex items-center gap-2 text-xs text-slate-400">
                            <span className={`${a.check} flex-shrink-0`}><CheckIcon /></span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════ AI WORKFLOW ═══════════════════════ */}
      <AnimatedSection>
        <section className="relative py-24 overflow-hidden">
          <Orb className="w-[600px] h-[600px] bg-emerald-600 bottom-0 left-0" />

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left copy */}
              <div>
                <motion.p variants={fadeUp} className="text-violet-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
                  AI Workflow
                </motion.p>
                <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl font-bold text-gradient-title leading-tight mb-6">
                  From noise to fix<br />in four steps.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2} className="text-slate-400 text-lg leading-relaxed mb-10">
                  DefectAI's pipeline was designed by engineers who've been on-call at 3 AM. Every
                  step removes friction so you can sleep soundly.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="space-y-1">
                  {[
                    { icon: <ShieldIcon />, text: "SOC 2 Type II certified" },
                    { icon: <ZapIcon />, text: "Processes 140M+ events per day" },
                  ].map((b) => (
                    <div key={b.text} className="flex items-center gap-3 text-sm text-slate-300 py-2">
                      <span className="text-emerald-400">{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: steps */}
              <div className="relative">
                {/* Connector line */}
                <div className="absolute left-8 top-8 bottom-8 w-px workflow-line opacity-30" />

                <div className="space-y-4">
                  {workflowSteps.map((step, i) => (
                    <motion.div
                      key={step.num}
                      variants={fadeUp}
                      custom={i}
                      className="relative flex gap-6 glass border border-white/[0.06] rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 relative z-10">
                        <div className="w-10 h-10 rounded-xl glass-strong border border-emerald-500/30 flex items-center justify-center font-display font-bold text-sm text-emerald-400 group-hover:border-emerald-400/60 transition-colors">
                          {step.num}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-white text-base mb-1">{step.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════ BENTO HIGHLIGHT ═══════════════════════ */}
      <AnimatedSection>
        <section className="relative py-20 overflow-hidden">
          <GridOverlay />
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Wide card */}
              <motion.div
                variants={fadeUp}
                className="lg:col-span-3 relative glass border border-white/[0.07] rounded-2xl p-8 overflow-hidden group hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
                <div className="relative z-10">
                  <div className="text-emerald-400 mb-4"><ActivityIcon /></div>
                  <h3 className="font-display font-bold text-2xl text-white mb-3">Live anomaly detection</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                    Statistical baselines auto-calibrate to your traffic patterns. Sudden error spikes
                    trigger instant multi-channel alerts — no manual threshold tuning.
                  </p>
                  {/* Fake sparkline */}
                  <div className="flex items-end gap-1 h-12">
                    {[40, 55, 35, 60, 45, 70, 50, 80, 45, 65, 90, 55, 100, 60, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-emerald-600/60 to-emerald-400/40 transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Narrow cards */}
              <div className="lg:col-span-2 grid grid-cols-1 gap-5">
                {[
                  {
                    icon: <ChatIcon />,
                    title: "Ask DefectAI",
                    desc: "\"Why did checkout spike at 14:32?\" — get a root-cause answer in seconds.",
                    accent: "violet",
                  },
                  {
                    icon: <SparklesIcon />,
                    title: "Auto-assign",
                    desc: "ML ownership graph routes bugs to the engineer who last touched the affected code.",
                    accent: "sky",
                  },
                ].map((card, i) => {
                  const a = accentMap[card.accent];
                  return (
                    <motion.div
                      key={card.title}
                      variants={fadeUp}
                      custom={i + 1}
                      className={`glass border ${a.border} rounded-2xl p-6 group hover:bg-white/[0.03] transition-all duration-300 overflow-hidden relative`}
                    >
                      <div className={`${a.icon} w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-white/[0.06]`}>
                        {card.icon}
                      </div>
                      <h3 className="font-display font-semibold text-white text-lg mb-2">{card.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <AnimatedSection>
        <section className="relative py-32 overflow-hidden">
          <Orb className="w-[700px] h-[700px] bg-emerald-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Orb className="w-[400px] h-[400px] bg-violet-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              variants={fadeUp}
              className="glass-strong border border-white/[0.07] rounded-3xl p-12 sm:p-16 relative overflow-hidden"
            >
              {/* Top line gradient */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

              <motion.p variants={fadeUp} className="text-emerald-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Get started today
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-title leading-tight mb-6">
                Ship with confidence.<br />
                <span className="text-gradient-em">Resolve bugs in minutes.</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
                Join 50,000+ engineering teams using DefectAI to build more reliable software —
                free for up to 5 engineers, forever.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold bg-gradient-to-br from-emerald-400 to-emerald-600 text-[#050810] shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.03]">
                  Start free — no credit card
                  <ArrowRightIcon />
                  <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold glass border border-white/10 text-slate-300 hover:border-white/25 hover:text-white transition-all duration-300">
                  Book a demo
                </button>
              </motion.div>

              <motion.p variants={fadeUp} custom={4} className="mt-6 text-xs text-slate-600">
                SOC 2 Type II · GDPR compliant · 99.99% uptime SLA
              </motion.p>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════ FOOTER STRIP ═══════════════════════ */}
      <footer className="relative border-t border-white/[0.05] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-400 text-sm">DefectAI</span>
            <span>© 2025. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Docs", "Status", "Blog"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
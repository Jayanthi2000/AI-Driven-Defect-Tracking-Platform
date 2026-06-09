import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";



import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Brain,
  BarChart3,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Star,
  Layers,
  Terminal,
} from "lucide-react";

import Navbar from "../../components/landing/Navbar.jsx";
import Footer from "../../components/landing/Footer.jsx";

/* ───────────────── DATA ───────────────── */

const BUGS = [
  {
    id: "BUG-2341",
    title: "Auth token refresh fails on timeout",
    module: "auth",
    severity: "critical",
    ai: "98%",
    time: "2m ago",
    assignee: "AR",
    status: "open",
    pulse: true,
  },
  {
    id: "BUG-2339",
    title: "Dashboard chart renders empty on mobile",
    module: "frontend",
    severity: "high",
    ai: "91%",
    time: "14m ago",
    assignee: "ME",
    status: "in_progress",
    pulse: false,
  },
  {
    id: "BUG-2337",
    title: "Pagination breaks with >1,000 records",
    module: "backend",
    severity: "medium",
    ai: "84%",
    time: "1h ago",
    assignee: "SL",
    status: "review",
    pulse: false,
  },
  {
    id: "BUG-2334",
    title: "CSV export encoding error for unicode",
    module: "data",
    severity: "low",
    ai: "76%",
    time: "3h ago",
    assignee: "KP",
    status: "resolved",
    pulse: false,
  },
];

const STATS = [
  {
    label: "Bugs triaged",
    value: 148,
    suffix: "",
    delta: "−12%",
    color: "#ef4444",
  },
  {
    label: "In progress",
    value: 43,
    suffix: "",
    delta: "+8%",
    color: "#f59e0b",
  },
  {
    label: "Resolved",
    value: 891,
    suffix: "+",
    delta: "+24%",
    color: "#10b981",
  },
  {
    label: "AI accuracy",
    value: 99.2,
    suffix: "%",
    delta: "precision",
    color: "#8b5cf6",
  },
];

const FEATURES = [
  {
    icon: Brain,
    label: "AI Triage",
    desc: "Auto-prioritize every defect by severity and business impact.",
    color: "emerald",
  },
  {
    icon: GitBranch,
    label: "Git-aware",
    desc: "Link bugs to commits and PRs instantly.",
    color: "violet",
  },
  {
    icon: BarChart3,
    label: "Real-time Analytics",
    desc: "Sprint health and throughput visualized live.",
    color: "amber",
  },
  {
    icon: Shield,
    label: "Role-based Access",
    desc: "Admin, Developer, and QA flows included.",
    color: "blue",
  },
  {
    icon: Layers,
    label: "Multi-project",
    desc: "Manage unlimited repos and modules.",
    color: "emerald",
  },
  {
    icon: Terminal,
    label: "API + CLI",
    desc: "Integrate seamlessly with CI/CD.",
    color: "violet",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Fathima",
    role: "UI / Frontend",
    image: "/team/fathima.jpeg",
  },
  {
    name: "Jayanthi",
    role: "Backend",
    image: "/team/jayanthi.jpeg",
  },
  {
    name: "Madhu",
    role: "AI Module",
    image: "/team/Madhu.jpeg",
  },
  {
    name: "Malathi",
    role: "Testing",
    image: "/team/malathi.png",
  },
];

const SEVERITY = {
  critical: {
    label: "Critical",
    bg: "rgba(239,68,68,0.12)",
    text: "#f87171",
    dot: "#ef4444",
  },

  high: {
    label: "High",
    bg: "rgba(245,158,11,0.12)",
    text: "#fbbf24",
    dot: "#f59e0b",
  },

  medium: {
    label: "Medium",
    bg: "rgba(139,92,246,0.12)",
    text: "#a78bfa",
    dot: "#8b5cf6",
  },

  low: {
    label: "Low",
    bg: "rgba(16,185,129,0.12)",
    text: "#34d399",
    dot: "#10b981",
  },
};

const STATUS_ICON = {
  open: {
    icon: AlertCircle,
    color: "#ef4444",
  },

  in_progress: {
    icon: Clock,
    color: "#f59e0b",
  },

  review: {
    icon: GitBranch,
    color: "#8b5cf6",
  },

  resolved: {
    icon: CheckCircle2,
    color: "#10b981",
  },
};

const AVATARS = [
  { initials: "EK", bg: "#10b981" },
  { initials: "MR", bg: "#8b5cf6" },
  { initials: "SR", bg: "#f59e0b" },
  { initials: "AR", bg: "#3b82f6" },
  { initials: "KL", bg: "#ef4444" },
];

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

/* ───────────────── COUNTER ───────────────── */

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;

    const end = Number(to);

    const duration = 1200;

    const step = end / (duration / 16);

    const timer = setInterval(() => {
      start += step;

      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [to]);

  return (
    <span>
      {typeof to === "number" && String(to).includes(".")
        ? val.toFixed(1)
        : Math.round(val)}
      {suffix}
    </span>
  );
}

/* ───────────────── PULSE DOT ───────────────── */

function PulseDot({ color }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
      }}
    />
  );
}

/* ───────────────── DASHBOARD PREVIEW ───────────────── */

function DashboardPreview() {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        background: "rgba(13,15,20,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* top */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom:
            "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {["#ef4444", "#f59e0b", "#10b981"].map(
          (c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
              }}
            />
          )
        )}
      </div>

      {/* stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 1,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#0D0F14",
              padding: "14px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(148,163,184,0.5)",
              }}
            >
              {s.label}
            </div>

            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              <Counter
                to={s.value}
                suffix={s.suffix}
              />
            </div>
          </div>
        ))}
      </div>

      {/* bugs */}
      <div style={{ padding: 12 }}>
        {BUGS.map((bug, i) => {
          const sev = SEVERITY[bug.severity];

          const {
            icon: StatusIcon,
            color: statusColor,
          } = STATUS_ICON[bug.status];

          return (
            <div
              key={bug.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "10px",
                borderRadius: 10,
                marginBottom: 6,
                border:
                  hovered === i
                    ? "1px solid rgba(16,185,129,0.2)"
                    : "1px solid rgba(255,255,255,0.04)",
                background:
                  hovered === i
                    ? "rgba(16,185,129,0.03)"
                    : "rgba(255,255,255,0.01)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {bug.pulse ? (
                  <PulseDot color={sev.dot} />
                ) : (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: sev.dot,
                    }}
                  />
                )}

                <span
                  style={{
                    fontSize: 11,
                    color: "#10b981",
                  }}
                >
                  {bug.id}
                </span>

                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                  }}
                >
                  {bug.title}
                </span>

                <StatusIcon
                  size={12}
                  style={{ color: statusColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────── FEATURE CARD ───────────────── */

function FeatureCard({
  icon: Icon,
  label,
  desc,
  color,
  index,
}) {
  const colors = {
    emerald: {
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      text: "#34d399",
    },

    violet: {
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      text: "#a78bfa",
    },

    amber: {
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      text: "#fbbf24",
    },

    blue: {
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.2)",
      text: "#93c5fd",
    },
  };

  const c = colors[color] || colors.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
      }}
      style={{
        padding: 24,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: c.bg,
          border: `1px solid ${c.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={18} style={{ color: c.text }} />
      </div>

      <h3
        style={{
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {label}
      </h3>

      <p
        style={{
          fontSize: 13,
          color: "rgba(148,163,184,0.7)",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

/* ───────────────── TEAM COLLAB ───────────────── */

function TeamCollaborationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: 60,
        display: "flex",
        justifyContent: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      {TEAM_MEMBERS.map((member, index) => (
        <motion.div
          key={index}
          whileHover={{
            y: -6,
            scale: 1.05,
          }}
          transition={{ duration: 0.2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              border:
                "3px solid rgba(255,255,255,0.08)",
              background: "#111827",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.35)",
            }}
          >
            <img
              src={member.image}
              alt={member.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {member.name}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "rgba(148,163,184,0.65)",
              }}
            >
              {member.role}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ───────────────── MAIN PAGE ───────────────── */

export default function LandingPage() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 60]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080A0E",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        .hero-grid-bg{
          background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:60px 60px;
        }

        .cta-primary{
          background:linear-gradient(135deg,#10b981,#059669);
          color:#fff;
          padding:0 28px;
          height:52px;
          border-radius:14px;
          display:inline-flex;
          align-items:center;
          gap:8px;
          text-decoration:none;
          font-weight:600;
        }

        .cta-secondary{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.12);
          color:#fff;
          padding:0 24px;
          height:52px;
          border-radius:14px;
          display:inline-flex;
          align-items:center;
          gap:8px;
          text-decoration:none;
        }
      `}</style>

      {/* background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          className="hero-grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.6,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: NOISE,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      <Navbar />

      <main
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* HERO */}

        <section
          ref={containerRef}
          style={{
            padding: "100px 24px 80px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background:
                  "rgba(16,185,129,0.07)",
                border:
                  "1px solid rgba(16,185,129,0.2)",
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 13,
                color: "#34d399",
              }}
            >
              <Sparkles size={12} />
              AI-Powered Defect Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize:
                "clamp(2.4rem, 5.5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.07,
              textAlign: "center",
              maxWidth: 820,
              margin: "0 auto",
            }}
          >
            Track bugs smarter with{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(135deg,#34d399,#059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI-driven
            </span>{" "}
            analysis
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              marginTop: 24,
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(148,163,184,0.85)",
              textAlign: "center",
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            DefectAI automatically triages,
            prioritizes, and suggests fixes
            using machine learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/login"
              className="cta-primary"
            >
              Start for free
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="cta-secondary"
            >
              View live demo
            </Link>
          </motion.div>

          {/* avatars */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 32,
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {AVATARS.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: a.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>

          {/* dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              y: cardY,
              marginTop: 64,
            }}
          >
            <DashboardPreview />
          </motion.div>
        </section>

        {/* FEATURES */}

        <section
          style={{
            padding: "0 24px 100px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(260px,1fr))",
              gap: 12,
            }}
          >
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={i}
                {...f}
                index={i}
              />
            ))}
          </div>
        </section>

        

        {/* TEAM */}

        <section
          style={{
            padding: "0 24px 120px",
            maxWidth: 1000,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: 12,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Team Collaboration
          </h2>

          <p
            style={{
              color: "rgba(148,163,184,0.75)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Meet our contributors working across
            frontend, backend, AI, and testing.
          </p>

          <TeamCollaborationCard />
        </section>
      </main>

      <Footer />
    </div>
  );
}

import {
  Plus,
  Brain,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Create Bug",
    desc: "Log a new defect issue",
    icon: Plus,
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.15)",
    borderHover: "rgba(34,197,94,0.2)",
  },
  {
    title: "Run AI Scan",
    desc: "Analyze project defects",
    icon: Brain,
    accent: "#14b8a6",
    glow: "rgba(20,184,166,0.15)",
    borderHover: "rgba(20,184,166,0.2)",
  },
  {
    title: "Manage Team",
    desc: "Invite & manage members",
    icon: Users,
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.15)",
    borderHover: "rgba(99,102,241,0.2)",
  },
  {
    title: "Generate Report",
    desc: "Export analytics report",
    icon: FileText,
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
    borderHover: "rgba(245,158,11,0.2)",
  },
];

export default function QuickActions() {
  return (
    <div style={{
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.06)",
      background: "linear-gradient(145deg, rgba(14,14,22,0.8) 0%, rgba(10,10,16,0.7) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: 24,
      boxShadow: "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 40px rgba(0,0,0,0.3)",
    }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Quick Actions</h3>
        <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>Fast admin operations</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.025)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s",
                width: "100%",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = action.borderHover;
                e.currentTarget.style.background = `${action.glow}`;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.25)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  background: `${action.glow}`,
                  border: `1px solid ${action.borderHover}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: action.accent,
                  marginBottom: 12,
                  flexShrink: 0,
                }}>
                  <Icon size={16} />
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0, letterSpacing: "-0.01em" }}>
                  {action.title}
                </h4>
                <p style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>
                  {action.desc}
                </p>
              </div>
              <ArrowRight size={14} style={{ color: "#334155", flexShrink: 0, marginTop: 2, transition: "transform 0.18s, color 0.18s" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const projects = [
  {
    name: "Admin Dashboard",
    progress: 92,
    status: "On Track",
    accent: "#22c55e",
    icon: CheckCircle2,
  },
  {
    name: "AI Detection Engine",
    progress: 68,
    status: "In Progress",
    accent: "#14b8a6",
    icon: Clock3,
  },
  {
    name: "Mobile Optimization",
    progress: 41,
    status: "Pending",
    accent: "#f59e0b",
    icon: AlertTriangle,
  },
  {
    name: "Analytics Module",
    progress: 84,
    status: "Stable",
    accent: "#6366f1",
    icon: CheckCircle2,
  },
];

export default function ProjectProgress() {
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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", margin: 0, letterSpacing: "-0.02em" }}>
            Project Progress
          </h2>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Live sprint delivery tracking</p>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          padding: "4px 10px", borderRadius: 999,
          border: "1px solid rgba(34,197,94,0.2)",
          color: "#22c55e", background: "rgba(34,197,94,0.07)",
        }}>
          4 Active
        </span>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {projects.map((project, index) => {
          const Icon = project.icon;
          return (
            <div
              key={index}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
                padding: "14px 16px",
                transition: "border-color 0.18s, background 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${project.accent}25`;
                e.currentTarget.style.background = "rgba(255,255,255,0.035)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: 8,
                    background: `${project.accent}15`,
                    border: `1px solid ${project.accent}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={15} style={{ color: project.accent }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0, letterSpacing: "-0.01em" }}>
                      {project.name}
                    </h3>
                    <p style={{ fontSize: 11, color: project.accent, marginTop: 2 }}>{project.status}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    {project.progress}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${project.progress}%`,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${project.accent}, ${project.accent}cc)`,
                  boxShadow: `0 0 8px ${project.accent}50`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

function AdminTopBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        border: "1px solid rgba(34,197,94,0.12)",
        background: "linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(20,184,166,0.04) 50%, rgba(10,10,16,0.6) 100%)",
        backdropFilter: "blur(20px)",
        padding: "28px 32px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.4)",
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute",
        top: 0, right: 0,
        width: 350, height: 250,
        background: "radial-gradient(ellipse at top right, rgba(34,197,94,0.12) 0%, transparent 65%)",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />
      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        pointerEvents: "none",
        borderRadius: 20,
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            color: "#22c55e", textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: 999,
            border: "1px solid rgba(34,197,94,0.25)",
            background: "rgba(34,197,94,0.08)",
          }}>
            AI Defect Tracking Platform
          </span>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px rgba(34,197,94,0.8)",
            animation: "pulse-dot 2s infinite",
          }} />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{
              fontSize: 28, fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
            }}>
              Smart Administrative<br />
              <span style={{ color: "#22c55e" }}>Monitoring</span> Dashboard
            </h1>
            <p style={{ color: "#64748b", marginTop: 10, fontSize: 14, maxWidth: 480, lineHeight: 1.6 }}>
              Real-time AI-powered bug intelligence, developer allocation,
              analytics and enterprise-level monitoring.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "black",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(34,197,94,0.25)",
              transition: "all 0.18s",
              letterSpacing: "-0.01em",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 28px rgba(34,197,94,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(34,197,94,0.25)"}
            >
              Generate Report
            </button>
            <button style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8",
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#f1f5f9"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              View Logs
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,0.8); }
          50% { opacity: 0.6; box-shadow: 0 0 14px rgba(34,197,94,0.4); }
        }
      `}</style>
    </motion.div>
  );
}

export default AdminTopBanner;

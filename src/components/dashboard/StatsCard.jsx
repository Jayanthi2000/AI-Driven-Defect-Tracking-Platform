import { motion } from "framer-motion";

const ACCENT_MAP = {
  bugs: { color: "#ef4444", glow: "rgba(239,68,68,0.15)" },
  active: { color: "#22c55e", glow: "rgba(34,197,94,0.15)" },
  quality: { color: "#14b8a6", glow: "rgba(20,184,166,0.15)" },
  users: { color: "#6366f1", glow: "rgba(99,102,241,0.15)" },
};

export default function StatCard({ title, value, change, Icon, icon }) {
  const accent = ACCENT_MAP[icon] || { color: "#22c55e", glow: "rgba(34,197,94,0.15)" };
  const isPositive = change && !change.includes("-");

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(145deg, rgba(14,14,22,0.85) 0%, rgba(10,10,16,0.75) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "20px 22px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.3)",
        cursor: "default",
        transition: "border-color 0.2s, box-shadow 0.2s",
        minHeight: 130,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accent.color}25`;
        e.currentTarget.style.boxShadow = `0 0 0 1px ${accent.color}10, inset 0 1px 0 rgba(255,255,255,0.05), 0 16px 40px rgba(0,0,0,0.35)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.3)";
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute",
        top: 0, right: 0,
        width: 100, height: 80,
        background: `radial-gradient(ellipse at top right, ${accent.glow} 0%, transparent 65%)`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* Icon + trend */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38,
          borderRadius: 10,
          background: accent.glow,
          border: `1px solid ${accent.color}25`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {Icon && <Icon size={17} style={{ color: accent.color }} />}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600,
          color: isPositive ? "#22c55e" : "#ef4444",
          background: isPositive ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: isPositive ? "1px solid rgba(34,197,94,0.18)" : "1px solid rgba(239,68,68,0.18)",
          padding: "2px 7px",
          borderRadius: 999,
          letterSpacing: "0.01em",
        }}>
          {isPositive ? "↑" : "↓"} Live
        </span>
      </div>

      {/* Value */}
      <div style={{ fontSize: 28, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>

      {/* Title & change */}
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, letterSpacing: "-0.01em" }}>{title}</div>
      {change && (
        <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{change}</div>
      )}
    </motion.div>
  );
}

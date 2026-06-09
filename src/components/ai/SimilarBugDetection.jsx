import { motion } from "framer-motion";

export default function SimilarBugDetection({
  bugs = [],
  color = "#3b82f6",
}) {
  return (
    <div
      style={{
        background: "rgba(13,18,32,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <h3 style={{ color, marginBottom: 18 }}>
        Similar Bug Detection
      </h3>

      {bugs.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          No similar bugs found.
        </p>
      ) : (
        bugs.map((bug, index) => (
          <motion.div
            key={bug.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong style={{ color: "#fff" }}>
                {bug.id}
              </strong>

              <span
                style={{
                  color,
                  fontWeight: 700,
                }}
              >
                {bug.similarity}%
              </span>
            </div>

            <div style={{ color: "#cbd5e1" }}>
              {bug.title}
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "#64748b",
              }}
            >
              Status: {bug.status}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
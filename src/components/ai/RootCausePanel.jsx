import { motion } from "framer-motion";

export default function RootCausePanel({ rootCause, color = "#a855f7" }) {
  if (!rootCause) {
    return <div>No root cause data available</div>;
  }

  return (
    <div
      style={{
        background: "rgba(13,18,32,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 24,
      }}
    >
      <h3 style={{ color, marginBottom: 16 }}>Root Cause Analysis</h3>

      <div style={{ marginBottom: 20 }}>
        <strong style={{ color: "#fff" }}>Primary Cause</strong>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>
          {rootCause.primary}
        </p>
      </div>

      {rootCause.chain && (
        <div>
          <strong style={{ color: "#fff" }}>Cause Chain</strong>

          <div style={{ marginTop: 12 }}>
            {rootCause.chain.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  color: "#cbd5e1",
                }}
              >
                {item.step}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {rootCause.codeFile && (
        <div style={{ marginTop: 20 }}>
          <div style={{ color: "#64748b", fontSize: 12 }}>
            File: {rootCause.codeFile}
          </div>

          <div style={{ color: "#64748b", fontSize: 12 }}>
            Line: {rootCause.codeLine}
          </div>
        </div>
      )}

      {rootCause.codeSnippet && (
        <pre
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 10,
            overflow: "auto",
            background: "#0f172a",
            color: "#22c55e",
            fontSize: 12,
          }}
        >
          {rootCause.codeSnippet}
        </pre>
      )}
    </div>
  );
}
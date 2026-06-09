import { motion } from "framer-motion";

export default function ConfidenceScorePanel({
  confidence = 0,
  color = "#22c55e",
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
      <h3 style={{ color, marginBottom: 20 }}>
        AI Confidence Score
      </h3>

      <div
        style={{
          width: 180,
          height: 180,
          margin: "0 auto",
          borderRadius: "50%",
          border: `10px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color,
            }}
          >
            {confidence}%
          </div>
        </motion.div>
      </div>

      <p
        style={{
          marginTop: 20,
          textAlign: "center",
          color: "#94a3b8",
        }}
      >
        AI confidence level for this prediction.
      </p>
    </div>
  );
}
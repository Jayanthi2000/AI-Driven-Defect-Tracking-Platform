import { motion } from "framer-motion";

const ConfidenceMeter = ({ score, size = "md", showLabel = true }) => {
  const getColor = (score) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#8b5cf6";
    if (score >= 60) return "#f59e0b";
    return "#6b7280";
  };

  const color = getColor(score);
  const radius = size === "sm" ? 22 : 32;
  const stroke = size === "sm" ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold tabular-nums"
            style={{
              fontSize: size === "sm" ? "11px" : "14px",
              color,
            }}
          >
            {score}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-[10px] text-slate-500 tracking-widest uppercase">
          Confidence
        </span>
      )}
    </div>
  );
};

export default ConfidenceMeter;

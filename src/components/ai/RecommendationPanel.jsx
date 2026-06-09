import { motion } from "framer-motion";

const recommendations = [
  {
    id: 1,
    priority: "Urgent",
    title: "Fix JWT refresh race condition",
    description: "7 bugs share the same root cause. Resolving this will close BUG-087, BUG-088, BUG-093 and 4 others.",
    effort: "Medium",
    impact: "High",
    bugs: ["BUG-087", "BUG-088", "BUG-093"],
  },
  {
    id: 2,
    priority: "High",
    title: "Implement circuit breaker for payment API",
    description: "4 recurring timeout bugs can be prevented with exponential backoff and circuit breaker pattern.",
    effort: "Low",
    impact: "High",
    bugs: ["BUG-091", "BUG-104"],
  },
  {
    id: 3,
    priority: "Medium",
    title: "Global useEffect cleanup audit",
    description: "Memory leak pattern found across 3 components. Automated linting rule recommended.",
    effort: "Low",
    impact: "Medium",
    bugs: ["BUG-102", "BUG-098"],
  },
];

const priorityStyles = {
  Urgent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  High: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Medium: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

const effortColors = { Low: "text-emerald-400", Medium: "text-amber-400", High: "text-red-400" };
const impactColors = { High: "text-emerald-400", Medium: "text-amber-400", Low: "text-slate-400" };

const RecommendationPanel = () => {
  return (
    <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Smart Recommendations</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">AI-prioritized action items</p>
        </div>
        <span className="text-[10px] text-slate-500">{recommendations.length} items</span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-xs font-semibold text-white leading-snug flex-1">
                {rec.title}
              </h4>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${priorityStyles[rec.priority]}`}>
                {rec.priority}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {rec.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[10px]">
                <span>
                  <span className="text-slate-500">Effort: </span>
                  <span className={`font-semibold ${effortColors[rec.effort]}`}>{rec.effort}</span>
                </span>
                <span className="text-slate-700">·</span>
                <span>
                  <span className="text-slate-500">Impact: </span>
                  <span className={`font-semibold ${impactColors[rec.impact]}`}>{rec.impact}</span>
                </span>
              </div>
              <div className="flex gap-1">
                {rec.bugs.slice(0, 2).map((b) => (
                  <span
                    key={b}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.07]"
                  >
                    {b}
                  </span>
                ))}
                {rec.bugs.length > 2 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500 border border-white/[0.07]">
                    +{rec.bugs.length - 2}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;

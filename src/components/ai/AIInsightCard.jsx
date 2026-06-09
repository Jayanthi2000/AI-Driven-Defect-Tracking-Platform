import { motion } from "framer-motion";
import ConfidenceMeter from "./ConfidenceMeter";

const severityStyles = {
  Critical: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  High: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Medium: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  Low: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

const AIInsightCard = ({ insight, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4 hover:border-emerald-500/20 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityStyles[insight.severity]}`}>
              {insight.severity}
            </span>
            <span className="text-[10px] text-slate-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {insight.category}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-emerald-400 transition-colors duration-200">
            {insight.title}
          </h3>
        </div>
        <ConfidenceMeter score={insight.confidence} size="sm" showLabel={false} />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed">
        {insight.description}
      </p>

      {/* Suggested Fix */}
      <div className="bg-emerald-500/[0.05] border border-emerald-500/[0.12] rounded-xl p-3">
        <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider mb-1">
          AI Suggested Fix
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">{insight.suggestedFix}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
        <span className="text-[11px] text-slate-500">
          {insight.affectedBugs} bug{insight.affectedBugs !== 1 ? "s" : ""} affected
        </span>
        <span
          className={`text-[11px] font-medium ${
            insight.trendUp ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          {insight.trend} this week
        </span>
      </div>
    </motion.div>
  );
};

export default AIInsightCard;

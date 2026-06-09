import { motion } from "framer-motion";
import { aiActivityTimeline } from "../../data/aiData";

const iconMap = {
  copy: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
      <path d="M8 2L2 13h12L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
      <path d="M8 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11H6V9.5A4 4 0 018 2z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 13h4M7 15h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
      <path d="M2 2h5l7 7-5 5-7-7V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="5" cy="5" r="1" fill="currentColor" />
    </svg>
  ),
  trending: (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
      <path d="M2 12l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 5h3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const iconColors = {
  copy: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  alert: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  lightbulb: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  tag: "text-slate-400 bg-white/[0.05] border-white/[0.08]",
  trending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const AIActivityTimeline = () => {
  return (
    <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">AI Activity Timeline</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Latest AI engine actions</p>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-medium">Live</span>
        </span>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-white/[0.05]" />

        <div className="space-y-4">
          {aiActivityTimeline.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex items-start gap-4 pl-0"
            >
              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl border flex-shrink-0 ${iconColors[item.icon]}`}
              >
                {iconMap[item.icon]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-xs text-slate-200 leading-snug">{item.message}</p>
                <p className="text-[10px] text-slate-500 mt-1">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIActivityTimeline;

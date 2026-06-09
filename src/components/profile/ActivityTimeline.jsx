import { motion } from "framer-motion";
import { profileActivity } from "../../data/profileData";

const typeConfig = {
  resolved: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
  comment: { color: "text-violet-400 bg-violet-500/10 border-violet-500/20", dot: "bg-violet-400" },
  assignment: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  escalation: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  filed: { color: "text-slate-400 bg-white/[0.05] border-white/[0.08]", dot: "bg-slate-400" },
};

const ActivityTimeline = () => {
  return (
    <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-sm font-semibold text-white mb-5">Recent Activity</p>

      <div className="relative">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-white/[0.05]" />
        <div className="space-y-4">
          {profileActivity.map((item, i) => {
            const cfg = typeConfig[item.type] || typeConfig.filed;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                className="flex items-start gap-4"
              >
                {/* Dot */}
                <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-[#111318] flex-shrink-0 mt-0.5 ${cfg.dot}`} />

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-white">{item.action}</p>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;

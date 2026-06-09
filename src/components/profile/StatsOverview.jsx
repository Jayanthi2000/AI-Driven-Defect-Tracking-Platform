import { motion } from "framer-motion";
import { userProfile } from "../../data/profileData";

const { stats } = userProfile;

const statItems = [
  { label: "Assigned", value: stats.bugsAssigned, color: "text-amber-400" },
  { label: "Resolved", value: stats.bugsResolved, color: "text-emerald-400" },
  { label: "Open", value: stats.bugsOpen, color: "text-violet-400" },
  { label: "Comments", value: stats.commentsPosted, color: "text-slate-300" },
  { label: "Teams", value: stats.teamsCollaborated, color: "text-slate-300" },
  { label: "Avg Resolve", value: stats.avgResolutionTime, color: "text-emerald-400" },
];

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {statItems.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
          className="bg-[#111318] border border-white/[0.06] rounded-2xl p-4 text-center"
        >
          <p className={`text-xl font-bold mb-1 ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;

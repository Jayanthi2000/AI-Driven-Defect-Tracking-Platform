import { motion } from "framer-motion";
import { userProfile } from "../../data/profileData";

const colors = [
  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "bg-white/[0.05] text-slate-300 border-white/[0.08]",
];

const UserBadge = () => {
  return (
    <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3">
        Skills & Expertise
      </p>
      <div className="flex flex-wrap gap-2">
        {userProfile.skills.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${colors[i % colors.length]}`}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default UserBadge;

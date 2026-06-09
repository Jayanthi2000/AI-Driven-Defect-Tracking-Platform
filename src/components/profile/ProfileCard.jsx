import { motion } from "framer-motion";
import { userProfile } from "../../data/profileData";

const ProfileCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#111318] border border-white/[0.06] rounded-2xl p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-400">
            {userProfile.avatar}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#111318]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white mb-1">{userProfile.name}</h2>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs text-emerald-400 font-semibold">{userProfile.role}</span>
            <span className="text-slate-700">·</span>
            <span className="text-xs text-slate-400">{userProfile.team}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                <path d="M6 1a3 3 0 110 6 3 3 0 010-6zM1.5 11A4.5 4.5 0 0110.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {userProfile.email}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                <path d="M6 1.5A3 3 0 016 7.5m0-6A3 3 0 006 7.5m0 0c-2.2 0-4.5.9-4.5 2.5v.5h9V10c0-1.6-2.3-2.5-4.5-2.5z" stroke="currentColor" strokeWidth="1.1" />
              </svg>
              {userProfile.location}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {userProfile.timezone}
            </span>
          </div>
        </div>

        {/* Edit button */}
        <button className="flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-400 leading-relaxed mt-5 pt-5 border-t border-white/[0.05]">
        {userProfile.bio}
      </p>
    </motion.div>
  );
};

export default ProfileCard;

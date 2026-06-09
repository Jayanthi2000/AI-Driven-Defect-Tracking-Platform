import { motion } from "framer-motion";
import ConfidenceMeter from "./ConfidenceMeter";

const DuplicateBugCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5 hover:border-violet-500/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Bugs */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.07]">
              {item.category}
            </span>
            <span className="text-[10px] text-slate-500">{item.detectedAt}</span>
          </div>

          <div className="grid grid-cols-[auto_12px_auto] items-center gap-2">
            {/* Original */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 min-w-0">
              <p className="text-[10px] text-emerald-500 font-semibold mb-1 uppercase tracking-wider">
                Original
              </p>
              <p className="text-[11px] font-mono text-emerald-400 mb-1">{item.original.id}</p>
              <p className="text-xs text-slate-300 leading-snug">{item.original.title}</p>
            </div>

            {/* Arrow */}
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="w-3 h-3 text-slate-600 flex-shrink-0"
            >
              <path
                d="M1 6h10M7 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Duplicate */}
            <div className="bg-amber-500/[0.04] border border-amber-500/[0.12] rounded-xl p-3 min-w-0">
              <p className="text-[10px] text-amber-400 font-semibold mb-1 uppercase tracking-wider">
                Duplicate
              </p>
              <p className="text-[11px] font-mono text-amber-400 mb-1">{item.duplicate.id}</p>
              <p className="text-xs text-slate-300 leading-snug">{item.duplicate.title}</p>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <ConfidenceMeter score={item.confidence} size="sm" showLabel={true} />
      </div>

      {/* Action row */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 text-[11px] font-medium py-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors duration-200">
          Merge Bugs
        </button>
        <button className="flex-1 text-[11px] font-medium py-1.5 rounded-lg bg-white/[0.04] text-slate-400 border border-white/[0.07] hover:bg-white/[0.08] transition-colors duration-200">
          Keep Separate
        </button>
      </div>
    </motion.div>
  );
};

export default DuplicateBugCard;

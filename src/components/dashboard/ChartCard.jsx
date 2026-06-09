import {
  motion,
} from "framer-motion";

export default function ChartCard({
  title,
  children,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <div className="h-2 w-2 rounded-full bg-emerald-400" />

      </div>

      {children}

    </motion.div>
  );
}
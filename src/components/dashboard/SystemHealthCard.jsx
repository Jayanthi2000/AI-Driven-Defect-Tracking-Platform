import { motion } from "framer-motion";

const systems = [
  {
    name: "API Gateway",
    uptime: "99.9%",
    progress: "w-[99%]",
    color: "bg-emerald-400",
  },
  {
    name: "AI Engine",
    uptime: "98.7%",
    progress: "w-[90%]",
    color: "bg-cyan-400",
  },
  {
    name: "Database Cluster",
    uptime: "97.1%",
    progress: "w-[82%]",
    color: "bg-violet-400",
  },
];

function SystemHealthCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-white">
            System Health
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Live infrastructure monitoring
          </p>
        </div>

        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
      </div>

      <div className="space-y-6">
        {systems.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300">{item.name}</span>

              <span className="text-sm font-semibold text-white">
                {item.uptime}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} ${item.progress}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default SystemHealthCard;
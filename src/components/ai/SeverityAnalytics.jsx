import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { severityDistribution, categoryBreakdown } from "../../data/aiData";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1014] border border-white/[0.08] rounded-xl p-3 shadow-2xl">
        <p className="text-[11px] text-white font-semibold">{payload[0].name}</p>
        <p className="text-[11px] text-slate-400">{payload[0].value} bugs</p>
      </div>
    );
  }
  return null;
};

const SeverityAnalytics = () => {
  const total = severityDistribution.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Severity Distribution</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all active bugs</p>
        </div>
        <span className="text-xs font-bold text-white">{total} total</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Donut */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={severityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {severityDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{total}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Bugs</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-2">
          {severityDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-[11px] text-slate-400">{item.name}</span>
              </div>
              <span className="text-[11px] font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category bars */}
      <div className="mt-5 pt-5 border-t border-white/[0.05]">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3 font-semibold">
          By Category
        </p>
        <div className="space-y-2.5">
          {categoryBreakdown.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 w-28 truncate flex-shrink-0">
                {cat.name}
              </span>
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.count / 14) * 100}%` }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: cat.color }}
                />
              </div>
              <span className="text-[11px] font-semibold text-white w-5 text-right flex-shrink-0">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeverityAnalytics;

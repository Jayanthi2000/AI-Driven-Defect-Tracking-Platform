import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Bug, CheckCircle2, AlertTriangle, BarChart3 } from "lucide-react";
import { bugTrendData, severityData, teamProductivity, velocityData, moduleData } from "../data/dashboardData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1f2e] border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>)}
    </div>
  );
};

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay } });

export default function AnalyticsPage() {
  const topStats = [
    { label: "Total Bugs", value: "148", icon: Bug, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Resolved", value: "108", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Critical", value: "8", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { label: "AI Accuracy", value: "94%", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ];
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered defect insights and team performance metrics</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.07)} className={`bg-[#111318] border ${s.border} rounded-2xl p-4`}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(0.2)} className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Bug Trend (6 Weeks)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={bugTrendData}>
              <defs>
                <linearGradient id="oG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
              <Area type="monotone" dataKey="open" name="Open" stroke="#f97316" strokeWidth={2} fill="url(#oG)" />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} fill="url(#rG)" />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Severity Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {severityData.map((e, i) => <Cell key={i} fill={e.fill} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {severityData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                    <span className="text-xs text-slate-400">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{s.value}</span>
                    <span className="text-[10px] text-slate-500">{Math.round(s.value / 148 * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(0.3)} className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Team Productivity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={teamProductivity}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="assigned" name="Assigned" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(0.35)} className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Sprint Velocity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={velocityData}>
              <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="bugs" name="Bugs Fixed" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div {...fadeUp(0.4)} className="bg-[#111318] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-300 mb-4">Bugs by Module</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={moduleData} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bugs" name="Bugs" radius={[0, 4, 4, 0]}>
              {moduleData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { analyticsData, velocityData } from "../../data/adminEnterpriseData";

const cardStyle = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.06)",
  background: "linear-gradient(145deg, rgba(14,14,22,0.8) 0%, rgba(10,10,16,0.7) 100%)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  padding: 24,
  boxShadow: "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 40px rgba(0,0,0,0.3)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(10,10,16,0.96)",
        border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}>
        <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>{label}</p>
        <p style={{ color: "#22c55e", fontSize: 14, fontWeight: 600, margin: "2px 0 0" }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const VelocityTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(10,10,16,0.96)",
        border: "1px solid rgba(20,184,166,0.2)",
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}>
        <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>{label}</p>
        <p style={{ color: "#14b8a6", fontSize: 14, fontWeight: 600, margin: "2px 0 0" }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <div
        style={cardStyle}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.12)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(34,197,94,0.04), inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.35)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 40px rgba(0,0,0,0.3)"; }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h3 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Bug Resolution Trend</h3>
            <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>Realtime sprint analytics</p>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            padding: "4px 10px", borderRadius: 999,
            border: "1px solid rgba(34,197,94,0.2)",
            color: "#22c55e", background: "rgba(34,197,94,0.07)",
            textTransform: "uppercase",
          }}>Live</span>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="bugChart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#334155" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#334155" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} fill="url(#bugChart)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={cardStyle}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(20,184,166,0.12)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(20,184,166,0.04), inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 50px rgba(0,0,0,0.35)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 40px rgba(0,0,0,0.3)"; }}
      >
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Team Velocity</h3>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>Sprint performance by team</p>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={velocityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="team" stroke="#334155" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#334155" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<VelocityTooltip />} />
              <Bar dataKey="velocity" radius={[8, 8, 0, 0]} fill="url(#barGrad)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

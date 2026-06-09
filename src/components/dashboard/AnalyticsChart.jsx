import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  {
    name: "Mon",
    bugs: 12,
  },
  {
    name: "Tue",
    bugs: 19,
  },
  {
    name: "Wed",
    bugs: 8,
  },
  {
    name: "Thu",
    bugs: 15,
  },
  {
    name: "Fri",
    bugs: 22,
  },
  {
    name: "Sat",
    bugs: 10,
  },
];

export default function AnalyticsChart() {
  return (
    <div className="w-full h-[400px] rounded-2xl border border-white/10 bg-[#111827] p-5">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Weekly Defect Analytics
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="bugs"
            stroke="#10b981"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
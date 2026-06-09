import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Resolved",
    value: 68,
  },
  {
    name: "Pending",
    value: 22,
  },
  {
    name: "Critical",
    value: 10,
  },
];

const COLORS = [
  "#10b981",
  "#8b5cf6",
  "#ef4444",
];

export default function ResolutionChart() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F172A]/80 p-6 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h3 className="text-lg font-semibold text-white">
            Resolution Rate
          </h3>

          <p className="text-sm text-slate-400">
            AI defect distribution
          </p>

        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          Live
        </div>

      </div>

      <div className="h-[260px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      <div className="mt-6 space-y-3">

        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">

              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background:
                    COLORS[index],
                }}
              />

              <span className="text-sm text-slate-300">
                {item.name}
              </span>

            </div>

            <span className="text-sm font-semibold text-white">
              {item.value}%
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}
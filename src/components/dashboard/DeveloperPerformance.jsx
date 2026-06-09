import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Alex",
    fixed: 42,
  },
  {
    name: "Sophia",
    fixed: 35,
  },
  {
    name: "Daniel",
    fixed: 54,
  },
  {
    name: "Emma",
    fixed: 28,
  },
];

function DeveloperPerformance() {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Developer Performance
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Bugs resolved this month
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />

            <Bar
              dataKey="fixed"
              radius={[10, 10, 0, 0]}
              fill="#06b6d4"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DeveloperPerformance;
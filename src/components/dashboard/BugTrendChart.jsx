import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import ChartCard from "./ChartCard";

const data = [
  {
    name: "Mon",
    bugs: 40,
  },
  {
    name: "Tue",
    bugs: 55,
  },
  {
    name: "Wed",
    bugs: 48,
  },
  {
    name: "Thu",
    bugs: 70,
  },
  {
    name: "Fri",
    bugs: 64,
  },
  {
    name: "Sat",
    bugs: 52,
  },
  {
    name: "Sun",
    bugs: 30,
  },
];

export default function BugTrendChart() {
  return (
    <ChartCard title="Bug Activity">

      <div className="h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="bugGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#10b981"
                  stopOpacity={0.5}
                />

                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />

            <XAxis
              dataKey="name"
              stroke="#64748b"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="bugs"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#bugGradient)"
              strokeWidth={3}
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

    </ChartCard>
  );
}
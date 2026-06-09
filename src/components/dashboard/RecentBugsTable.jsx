import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const bugs = [
  {
    id: "BUG-2341",
    title:
      "Authentication token expired",
    severity: "Critical",
    status: "Open",
    assignee: "Fathima",
  },

  {
    id: "BUG-2338",
    title:
      "Dashboard chart not loading",
    severity: "High",
    status: "In Progress",
    assignee: "Jayanthi",
  },

  {
    id: "BUG-2329",
    title:
      "AI response timeout",
    severity: "Medium",
    status: "Testing",
    assignee: "Madhu",
  },

  {
    id: "BUG-2311",
    title:
      "Pagination issue in reports",
    severity: "Low",
    status: "Resolved",
    assignee: "Malathi",
  },
];

const severityStyles = {
  Critical:
    "bg-red-500/10 text-red-400 border-red-500/20",

  High:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",

  Medium:
    "bg-violet-500/10 text-violet-400 border-violet-500/20",

  Low:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const statusIcons = {
  Open: AlertTriangle,

  "In Progress": Clock3,

  Testing: Clock3,

  Resolved: CheckCircle2,
};

export default function RecentBugsTable() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">
            Recent Bugs
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest detected defects
          </p>

        </div>

        <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-500/20 hover:text-white">
          View All
        </button>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-white/5 text-left text-sm text-slate-500">

              <th className="pb-4 font-medium">
                Bug ID
              </th>

              <th className="pb-4 font-medium">
                Title
              </th>

              <th className="pb-4 font-medium">
                Severity
              </th>

              <th className="pb-4 font-medium">
                Status
              </th>

              <th className="pb-4 font-medium">
                Assignee
              </th>

            </tr>

          </thead>

          <tbody>

            {bugs.map((bug) => {
              const Icon =
                statusIcons[
                  bug.status
                ];

              return (
                <tr
                  key={bug.id}
                  className="border-b border-white/5 transition hover:bg-white/[0.02]"
                >

                  <td className="py-5 text-sm font-semibold text-emerald-400">
                    {bug.id}
                  </td>

                  <td className="py-5 text-sm text-white">
                    {bug.title}
                  </td>

                  <td className="py-5">

                    <span
                      className={`rounded-xl border px-3 py-1 text-xs font-semibold ${severityStyles[bug.severity]}`}
                    >
                      {bug.severity}
                    </span>

                  </td>

                  <td className="py-5">

                    <div className="flex items-center gap-2 text-sm text-slate-300">

                      <Icon
                        size={15}
                      />

                      {bug.status}

                    </div>

                  </td>

                  <td className="py-5 text-sm text-slate-400">
                    {bug.assignee}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}
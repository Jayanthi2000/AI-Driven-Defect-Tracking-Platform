import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const bugs = [
  {
    id: "BUG-2041",
    title: "Login API timeout",
    severity: "Critical",
    status: "Open",
    assignee: "Fathima",
  },

  {
    id: "BUG-2037",
    title: "Dashboard chart glitch",
    severity: "Medium",
    status: "In Progress",
    assignee: "Madhu",
  },

  {
    id: "BUG-2029",
    title: "AI prediction mismatch",
    severity: "High",
    status: "Review",
    assignee: "Jayanthi",
  },

  {
    id: "BUG-2021",
    title: "Export CSV issue",
    severity: "Low",
    status: "Resolved",
    assignee: "Malathi",
  },
];

function getSeverityColor(severity) {
  switch (severity) {
    case "Critical":
      return "text-red-400 bg-red-500/10 border-red-500/20";

    case "High":
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";

    case "Medium":
      return "text-violet-400 bg-violet-500/10 border-violet-500/20";

    default:
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "Open":
      return (
        <AlertTriangle
          size={15}
          className="text-red-400"
        />
      );

    case "Resolved":
      return (
        <CheckCircle2
          size={15}
          className="text-emerald-400"
        />
      );

    default:
      return (
        <Clock3
          size={15}
          className="text-amber-400"
        />
      );
  }
}

export default function RecentBugsTable() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F172A]/80 p-6 backdrop-blur-xl">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h3 className="text-xl font-bold text-white">
            Recent Bugs
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Latest AI-tracked issues
          </p>

        </div>

        <button className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20">
          View All
        </button>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-white/10 text-left">

              <th className="pb-4 text-sm font-medium text-slate-400">
                Bug ID
              </th>

              <th className="pb-4 text-sm font-medium text-slate-400">
                Title
              </th>

              <th className="pb-4 text-sm font-medium text-slate-400">
                Severity
              </th>

              <th className="pb-4 text-sm font-medium text-slate-400">
                Status
              </th>

              <th className="pb-4 text-sm font-medium text-slate-400">
                Assignee
              </th>

            </tr>

          </thead>

          <tbody>

            {bugs.map((bug) => (
              <tr
                key={bug.id}
                className="border-b border-white/5 transition hover:bg-white/[0.03]"
              >

                <td className="py-5 text-sm font-semibold text-emerald-400">
                  {bug.id}
                </td>

                <td className="py-5 text-sm text-white">
                  {bug.title}
                </td>

                <td className="py-5">

                  <span
                    className={`rounded-xl border px-3 py-1 text-xs font-semibold ${getSeverityColor(
                      bug.severity
                    )}`}
                  >
                    {bug.severity}
                  </span>

                </td>

                <td className="py-5">

                  <div className="flex items-center gap-2 text-sm text-slate-300">

                    {getStatusIcon(
                      bug.status
                    )}

                    {bug.status}

                  </div>

                </td>

                <td className="py-5 text-sm text-slate-300">
                  {bug.assignee}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
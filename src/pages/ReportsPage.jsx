const reportItems = [
  { title: "Monthly Bug Report", date: "May 2026", bugs: 148, resolved: 112, status: "Ready" },
  { title: "Sprint 14 Summary",  date: "Apr 2026", bugs: 94,  resolved: 87,  status: "Ready" },
  { title: "Q1 Defect Analysis", date: "Mar 2026", bugs: 213, resolved: 198, status: "Ready" },
  { title: "Critical Issues Log", date: "May 2026",bugs: 12,  resolved: 8,   status: "Draft"  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="mt-2 text-slate-400">Download and review defect reports</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {reportItems.map((r) => (
          <div
            key={r.title}
            className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-500/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">{r.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{r.date}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  r.status === "Ready"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {r.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs text-slate-500">Total Bugs</p>
                <p className="mt-1 text-2xl font-bold text-white">{r.bugs}</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs text-slate-500">Resolved</p>
                <p className="mt-1 text-2xl font-bold text-emerald-400">{r.resolved}</p>
              </div>
            </div>
            <button className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 text-sm text-slate-300 transition hover:border-emerald-500/20 hover:text-emerald-400">
              Download Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const workflowColumns = [
  {
    title: "Open",
    color: "border-red-500/20",
    bugs: [
      {
        title: "Login API Failure",
        priority: "High",
      },
      {
        title: "JWT Token Expired",
        priority: "Medium",
      },
    ],
  },

  {
    title: "In Progress",
    color: "border-yellow-500/20",
    bugs: [
      {
        title: "Payment Timeout",
        priority: "High",
      },
    ],
  },

  {
    title: "Testing",
    color: "border-blue-500/20",
    bugs: [
      {
        title: "Dashboard Rendering",
        priority: "Low",
      },
    ],
  },

  {
    title: "Resolved",
    color: "border-emerald-500/20",
    bugs: [
      {
        title: "Role Permission Issue",
        priority: "Resolved",
      },
    ],
  },
];

export default function WorkflowPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Workflow Board
        </h1>

        <p className="mt-2 text-slate-400">
          Track defects across the development lifecycle
        </p>
      </div>

      {/* BOARD */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {workflowColumns.map((column) => (
          <div
            key={column.title}
            className={`rounded-3xl border bg-[#111827] p-5 ${column.color}`}
          >
            {/* COLUMN HEADER */}

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {column.title}
              </h2>

              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                {column.bugs.length}
              </span>
            </div>

            {/* CARDS */}

            <div className="space-y-4">
              {column.bugs.map((bug) => (
                <div
                  key={bug.title}
                  className="rounded-2xl border border-white/10 bg-[#1F2937] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-[#243041]"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {bug.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      {bug.priority}
                    </span>

                    <span className="text-xs text-slate-500">
                      AI Assigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
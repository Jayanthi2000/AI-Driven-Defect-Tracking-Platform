import {
  motion,
} from "framer-motion";

import {
  Bug,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const columns = [
  {
    title: "Todo",
    color: "border-slate-500/20",
    count: 6,
    tasks: [
      {
        title:
          "Authentication API issue",
        priority: "High",
        icon: AlertTriangle,
        color: "red",
      },

      {
        title:
          "Navbar responsiveness",
        priority: "Medium",
        icon: Bug,
        color: "amber",
      },
    ],
  },

  {
    title: "In Progress",
    color: "border-violet-500/20",
    count: 4,
    tasks: [
      {
        title:
          "AI defect prediction",
        priority: "Critical",
        icon: Clock3,
        color: "violet",
      },

      {
        title:
          "Analytics redesign",
        priority: "Medium",
        icon: Bug,
        color: "blue",
      },
    ],
  },

  {
    title: "Testing",
    color: "border-amber-500/20",
    count: 3,
    tasks: [
      {
        title:
          "Mobile dashboard testing",
        priority: "Low",
        icon: CheckCircle2,
        color: "emerald",
      },
    ],
  },

  {
    title: "Completed",
    color: "border-emerald-500/20",
    count: 12,
    tasks: [
      {
        title:
          "Sidebar optimization",
        priority: "Done",
        icon: CheckCircle2,
        color: "emerald",
      },

      {
        title:
          "Landing page UI",
        priority: "Done",
        icon: CheckCircle2,
        color: "emerald",
      },
    ],
  },
];

const badgeStyles = {
  red:
    "bg-red-500/10 text-red-400",

  amber:
    "bg-amber-500/10 text-amber-400",

  violet:
    "bg-violet-500/10 text-violet-400",

  emerald:
    "bg-emerald-500/10 text-emerald-400",

  blue:
    "bg-cyan-500/10 text-cyan-400",
};

export default function KanbanBoard() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111827] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">

      {/* HEADER */}

      <div className="mb-7 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Sprint Workflow
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            AI powered issue tracking board
          </p>

        </div>

        <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">
          Create Task
        </button>

      </div>

      {/* BOARD */}

      <div className="grid gap-6 xl:grid-cols-4">

        {columns.map(
          (column, index) => (
            <div
              key={index}
              className={`rounded-3xl border ${column.color} bg-[#0B1120] p-5`}
            >

              {/* COLUMN HEADER */}

              <div className="mb-5 flex items-center justify-between">

                <h3 className="text-lg font-bold text-white">
                  {column.title}
                </h3>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-slate-300">
                  {column.count}
                </span>

              </div>

              {/* TASKS */}

              <div className="space-y-4">

                {column.tasks.map(
                  (
                    task,
                    taskIndex
                  ) => {
                    const Icon =
                      task.icon;

                    return (
                      <motion.div
                        key={
                          taskIndex
                        }
                        whileHover={{
                          y: -4,
                        }}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition"
                      >

                        <div className="flex items-start justify-between">

                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${badgeStyles[task.color]}`}
                          >

                            <Icon
                              size={20}
                            />

                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${badgeStyles[task.color]}`}
                          >
                            {
                              task.priority
                            }
                          </span>

                        </div>

                        <h4 className="mt-4 text-sm font-semibold leading-relaxed text-white">
                          {task.title}
                        </h4>

                        <div className="mt-5 flex items-center justify-between">

                          <div className="flex -space-x-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111827] bg-emerald-500 text-xs font-bold text-black">
                              A
                            </div>

                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111827] bg-violet-500 text-xs font-bold text-white">
                              K
                            </div>

                          </div>

                          <p className="text-xs text-slate-500">
                            2h ago
                          </p>

                        </div>

                      </motion.div>
                    );
                  }
                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}
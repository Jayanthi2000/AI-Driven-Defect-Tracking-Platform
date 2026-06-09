import {
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Clock3,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Critical auth bug resolved",
    project: "Authentication Service",
    time: "2 min ago",
    type: "resolved",
  },

  {
    id: 2,
    title: "AI detected anomaly spike",
    project: "Payments API",
    time: "10 min ago",
    type: "warning",
  },

  {
    id: 3,
    title: "Pull request linked to bug",
    project: "Frontend Dashboard",
    time: "25 min ago",
    type: "git",
  },

  {
    id: 4,
    title: "Regression test started",
    project: "Testing Pipeline",
    time: "40 min ago",
    type: "progress",
  },
];

const styles = {
  resolved: {
    icon: CheckCircle2,
    color:
      "text-emerald-400",
    bg:
      "bg-emerald-500/10",
  },

  warning: {
    icon: AlertTriangle,
    color:
      "text-red-400",
    bg:
      "bg-red-500/10",
  },

  git: {
    icon: GitBranch,
    color:
      "text-violet-400",
    bg:
      "bg-violet-500/10",
  },

  progress: {
    icon: Clock3,
    color:
      "text-amber-400",
    bg:
      "bg-amber-500/10",
  },
};

export default function RecentActivity() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/20">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Live system updates
          </p>

        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          LIVE
        </div>

      </div>

      {/* LIST */}

      <div className="space-y-4">

        {activities.map((item) => {
          const Icon =
            styles[item.type].icon;

          return (
            <div
              key={item.id}
              className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.04]"
            >

              {/* ICON */}

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles[item.type].bg}`}
              >
                <Icon
                  size={18}
                  className={
                    styles[item.type]
                      .color
                  }
                />
              </div>

              {/* CONTENT */}

              <div className="flex-1">

                <h3 className="font-medium text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.project}
                </p>

              </div>

              {/* TIME */}

              <span className="text-xs text-slate-500">
                {item.time}
              </span>

            </div>
          );
        })}

      </div>
    </div>
  );
}
import {
  Server,
  Database,
  ShieldCheck,
  Wifi,
} from "lucide-react";

const systems = [
  {
    name: "API Server",
    status: "Operational",
    color: "emerald",
    icon: Server,
  },

  {
    name: "Database",
    status: "Healthy",
    color: "blue",
    icon: Database,
  },

  {
    name: "Security",
    status: "Protected",
    color: "violet",
    icon: ShieldCheck,
  },

  {
    name: "Network",
    status: "Stable",
    color: "amber",
    icon: Wifi,
  },
];

const colors = {
  emerald:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

  blue:
    "border-blue-500/20 bg-blue-500/10 text-blue-400",

  violet:
    "border-violet-500/20 bg-violet-500/10 text-violet-400",

  amber:
    "border-amber-500/20 bg-amber-500/10 text-amber-400",
};

export default function SystemHealth() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F172A] p-6">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-white">
            System Health
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Infrastructure monitoring status
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
          LIVE
        </div>

      </div>

      {/* SYSTEMS */}

      <div className="space-y-4">

        {systems.map((system, index) => {
          const Icon = system.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.05]"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${colors[system.color]}`}
                >
                  <Icon size={20} />
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    {system.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {system.status}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                <span className="text-sm font-medium text-emerald-400">
                  Online
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
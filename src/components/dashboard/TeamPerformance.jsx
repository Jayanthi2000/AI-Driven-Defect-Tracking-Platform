import {
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";

const members = [
  {
    name: "Fathima",
    role: "Frontend",
    completed: 42,
    progress: 92,
  },

  {
    name: "Jayanthi",
    role: "Backend",
    completed: 38,
    progress: 84,
  },

  {
    name: "Madhu",
    role: "AI Engineer",
    completed: 31,
    progress: 76,
  },

  {
    name: "Malathi",
    role: "Tester",
    completed: 54,
    progress: 97,
  },
];

export default function TeamPerformance() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-white">
            Team Performance
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Sprint productivity tracking
          </p>

        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
          <Users
            size={20}
            className="text-violet-400"
          />
        </div>

      </div>

      {/* MEMBERS */}

      <div className="space-y-5">

        {members.map((member, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
          >

            <div className="mb-3 flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-white">
                  {member.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {member.role}
                </p>

              </div>

              <div className="flex items-center gap-2 text-emerald-400">

                <CheckCircle2 size={16} />

                <span className="text-sm font-semibold">
                  {member.completed}
                </span>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="h-2 overflow-hidden rounded-full bg-white/5">

              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                style={{
                  width: `${member.progress}%`,
                }}
              />

            </div>

            <div className="mt-2 flex items-center justify-between">

              <span className="text-xs text-slate-500">
                Sprint completion
              </span>

              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">

                <TrendingUp size={12} />

                {member.progress}%

              </span>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
const TEAM = [
  { name: "Alex Carter",   role: "Admin",     email: "alex@defectai.com",    bugs: 0,  resolved: 0,  initials: "AC", color: "from-violet-400 to-violet-600" },
  { name: "Jamie Liu",     role: "Developer", email: "jamie@defectai.com",   bugs: 34, resolved: 28, initials: "JL", color: "from-emerald-400 to-emerald-600" },
  { name: "Sam Patel",     role: "Developer", email: "sam@defectai.com",     bugs: 41, resolved: 35, initials: "SP", color: "from-emerald-400 to-teal-600" },
  { name: "Morgan Kim",    role: "Tester",    email: "morgan@defectai.com",  bugs: 58, resolved: 49, initials: "MK", color: "from-amber-400 to-orange-500" },
  { name: "Taylor Brooks", role: "Tester",    email: "taylor@defectai.com",  bugs: 47, resolved: 39, initials: "TB", color: "from-amber-400 to-amber-600" },
];

const ROLE_COLORS = {
  Admin:     "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Developer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Tester:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team</h1>
          <p className="mt-2 text-slate-400">Manage your team members and roles</p>
        </div>
        <button className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400">
          + Invite Member
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEAM.map((member) => (
          <div
            key={member.email}
            className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-500/20"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-black ${member.color}`}>
                {member.initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white truncate">{member.name}</h3>
                <p className="text-sm text-slate-500 truncate">{member.email}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                {member.role}
              </span>
            </div>

            {member.role !== "Admin" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.03] p-3 text-center">
                  <p className="text-xs text-slate-500">Assigned</p>
                  <p className="mt-1 text-xl font-bold text-white">{member.bugs}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3 text-center">
                  <p className="text-xs text-slate-500">Resolved</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">{member.resolved}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

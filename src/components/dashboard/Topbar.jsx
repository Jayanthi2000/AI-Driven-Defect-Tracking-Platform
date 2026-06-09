import {
  Bell,
  Search,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0B0F17]/80 backdrop-blur-xl">

      <div className="flex h-20 items-center justify-between px-6">

        {/* SEARCH */}

        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 w-[320px]">

          <Search
            size={18}
            className="text-slate-500"
          />

          <input
            type="text"
            placeholder="Search bugs, reports..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* AI STATUS */}

          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">

            AI Engine Online

          </div>

          {/* NOTIFICATION */}

          <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.06]">

            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

          </button>

        </div>
      </div>
    </header>
  );
}
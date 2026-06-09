import { FiFilter, FiSearch } from "react-icons/fi";

function SearchAndFilters() {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5">
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search bugs, developers, testers..."
            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none"
          />
        </div>

        <select className="bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-3 outline-none">
          <option>Severity</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>

        <select className="bg-[#0f172a] border border-white/10 rounded-2xl px-5 py-3 outline-none">
          <option>Status</option>
          <option>Open</option>
          <option>Resolved</option>
          <option>In Progress</option>
        </select>

        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition">
          <FiFilter />
          Apply
        </button>
      </div>
    </div>
  );
}

export default SearchAndFilters;
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const bugs = [
  {
    id: "#2041",
    title: "Authentication failure",
    severity: "Critical",
    status: "Open",
    assigned: "Alex",
  },
  {
    id: "#2042",
    title: "API timeout issue",
    severity: "Medium",
    status: "In Progress",
    assigned: "Sophia",
  },
  {
    id: "#2043",
    title: "Dashboard crash",
    severity: "Critical",
    status: "Resolved",
    assigned: "Daniel",
  },
];

function BugMonitoringTable() {
  const [search, setSearch] = useState("");

  const filtered = bugs.filter((bug) =>
    bug.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Bug Monitoring</h2>
          <p className="text-sm text-gray-400 mt-1">
            Track and manage all defects
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute top-3.5 left-4 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400">
              <th className="pb-4">Bug ID</th>
              <th className="pb-4">Issue</th>
              <th className="pb-4">Severity</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Assigned</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((bug) => (
              <tr
                key={bug.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-5">{bug.id}</td>
                <td>{bug.title}</td>

                <td>
                  <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                    {bug.severity}
                  </span>
                </td>

                <td>{bug.status}</td>
                <td>{bug.assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BugMonitoringTable;
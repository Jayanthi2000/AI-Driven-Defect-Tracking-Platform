import { useState } from "react";
import AssignModal from "./AssignModal";

const users = [
  {
    id: 1,
    name: "Alex Carter",
    role: "Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Sophia Lee",
    role: "Tester",
    status: "Idle",
  },
  {
    id: 3,
    name: "Daniel Kim",
    role: "Developer",
    status: "Busy",
  },
];

function UserManagement() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition"
        >
          Assign Role
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="pb-4">User</th>
              <th className="pb-4">Role</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-4">{user.name}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignModal open={open} setOpen={setOpen} />
    </div>
  );
}

export default UserManagement;
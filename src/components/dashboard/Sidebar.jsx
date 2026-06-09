import {
  LayoutDashboard,
  Bug,
  BarChart3,
  Brain,
  Workflow,
  FileText,
  Bell,
  Users,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

const menus = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Bugs",
    icon: Bug,
    path: "/admin/bugs",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    label: "AI Analysis",
    icon: Brain,
    path: "/admin/ai-analysis",
  },
  {
    label: "Workflow",
    icon: Workflow,
    path: "/admin/workflow",
  },
  {
    label: "Reports",
    icon: FileText,
    path: "/admin/reports",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    label: "Teams",
    icon: Users,
    path: "/admin/team-management",
  },
  {
    label: "Team Chat",
    icon: MessageSquare,
    path: "/admin/team-chat",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/[0.06] bg-[#0B0F17] lg:flex lg:flex-col">

      {/* LOGO */}

      <div className="flex h-20 items-center gap-3 border-b border-white/[0.06] px-6">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">

          <Zap
            size={20}
            className="text-black"
            fill="currentColor"
          />

        </div>

        <div>
          <h1 className="text-lg font-bold">
            Defect
            <span className="text-emerald-400">
              AI
            </span>
          </h1>

          <p className="text-xs text-slate-500">
            Admin Panel
          </p>
        </div>
      </div>

      {/* MENU */}

      <div className="flex-1 space-y-2 overflow-y-auto p-4">

        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <Icon size={18} />

              {item.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
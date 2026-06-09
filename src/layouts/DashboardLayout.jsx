import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bug,
  BarChart3,
  Brain,
  Workflow,
  FileText,
  Bell,
  Users,
  User,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notifications } from "../data/mock/notificationsData";

/* =========================================================
   ROLE-BASED NAVIGATION
========================================================= */

const NAVIGATION = {
  admin: [
    { path: "/admin/dashboard",     label: "Dashboard",      icon: LayoutDashboard },
    { path: "/admin/analytics",     label: "Analytics",      icon: BarChart3 },
    { path: "/admin/users",         label: "Users",          icon: Users },
    { path: "/admin/bugs",          label: "Bug Monitoring", icon: Bug },
    { path: "/admin/activity",      label: "Activity",       icon: Workflow },
    { path: "/admin/notifications", label: "Notifications",  icon: Bell },
    { path: "/admin/insights",      label: "Insights",       icon: Brain },
    { path: "/admin/profile",       label: "Profile",        icon: User },
    { path: "/admin/settings",      label: "Settings",       icon: Settings },
  ],

  developer: [
    { path: "/developer/dashboard",     label: "Dashboard",     icon: LayoutDashboard },
    { path: "/developer/bugs",          label: "Assigned Bugs", icon: Bug },
    { path: "/developer/kanban",        label: "Kanban Board",  icon: Workflow },
    { path: "/developer/activity",      label: "Activity Feed", icon: FileText },
    { path: "/developer/chat",          label: "Team Chat",     icon: MessageSquare },
    { path: "/developer/notifications", label: "Notifications", icon: Bell },
    { path: "/developer/profile",       label: "Profile",       icon: User },
    { path: "/developer/settings",      label: "Settings",      icon: Settings },
  ],

  tester: [
    { path: "/tester/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { path: "/tester/report-bug",    label: "Report Bug",   icon: PlusCircle },
    { path: "/tester/history",       label: "Bug History",  icon: FileText },
    { path: "/tester/verify",        label: "Verify Bugs",  icon: Workflow },
    { path: "/tester/reopen",        label: "Reopen Bugs",  icon: Workflow },
    { path: "/tester/chat",          label: "Tester Chat",  icon: MessageSquare },
    { path: "/tester/notifications", label: "Notifications",icon: Bell },
    { path: "/tester/profile",       label: "Profile",      icon: User },
    { path: "/tester/settings",      label: "Settings",     icon: Settings },
  ],
};

/* =========================================================
   ROLE COLORS
========================================================= */

const ROLE_COLORS = {
  admin:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  developer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  tester:    "bg-amber-500/10  text-amber-400  border-amber-500/20",
};

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

function getDisplayName(user) {
  return user?.name || user?.fullName || user?.email || "User";
}

/* =========================================================
   SIDEBAR LINK
========================================================= */

function SidebarLink({ item, collapsed, onClick }) {
  const Icon = item.icon;

  const unreadCount = item.path.includes("notifications")
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
         transition-all duration-200
         ${collapsed ? "justify-center" : ""}
         ${
           isActive
             ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
             : "border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
         }`
      }
    >
      <Icon size={17} className="flex-shrink-0" />

      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

      {!collapsed && unreadCount > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-black">
          {unreadCount}
        </span>
      )}

      {collapsed && unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400" />
      )}
    </NavLink>
  );
}

/* =========================================================
   SIDEBAR CONTENT
========================================================= */

function SidebarContent({ user, collapsed, onToggleCollapse, onLogout, onClose }) {
  const role        = user?.role?.toLowerCase()?.trim() || "developer";
  const navItems    = NAVIGATION[role] || [];
  const displayName = getDisplayName(user);
  const initials    = getInitials(displayName);

  return (
    <div className="flex h-full flex-col">

      {/* ── LOGO ── */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600">
            <Zap size={18} className="text-black" fill="currentColor" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">DefectAI</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Enterprise Platform
              </p>
            </div>
          )}
        </div>

        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        )}

        {/* Desktop collapse toggle */}
        {onToggleCollapse && !onClose && (
          <button
            onClick={onToggleCollapse}
            className="hidden h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:text-white lg:flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* ── ROLE BADGE ── */}
      {!collapsed && (
        <div className="mb-4 flex justify-center">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${ROLE_COLORS[role]}`}
          >
            {role}
          </span>
        </div>
      )}

      {/* ── NAV ── */}
      <nav
        className={`flex flex-1 flex-col gap-1 overflow-y-auto ${
          collapsed ? "items-center" : ""
        }`}
      >
        {navItems.map((item) => (
          <SidebarLink
            key={item.path}
            item={item}
            collapsed={collapsed}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* ── USER ── */}
      <div className="mt-5 border-t border-white/[0.06] pt-5">
        {!collapsed ? (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-black">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-white">{displayName}</h3>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="mb-3 flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-black">
              {initials}
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3
            text-sm font-medium text-red-400 transition-all hover:bg-red-500/20
            ${collapsed ? "justify-center px-2" : "justify-center"}`}
        >
          <LogOut size={16} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD LAYOUT  (default export)
========================================================= */

const DashboardLayout = () => {
  const { user, logout }                          = useAuth();
  const navigate                                  = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed,  setSidebarCollapsed]  = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const role        = user?.role?.toLowerCase()?.trim() || "developer";
  const displayName = getDisplayName(user);
  const initials    = getInitials(displayName);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen text-slate-200">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`
          fixed left-0 top-0 hidden h-screen
          border-r border-white/[0.06] bg-[#0D1117] p-5
          transition-all duration-300
          lg:block
          ${sidebarCollapsed ? "w-[72px]" : "w-72"}
        `}
      >
        <SidebarContent
          user={user}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── MOBILE SIDEBAR ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/[0.06] bg-[#0D1117] p-5 lg:hidden"
            >
              <SidebarContent
                user={user}
                collapsed={false}
                onLogout={handleLogout}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN AREA ── */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-72"
        }`}
      >

        {/* ── TOPBAR / NAVBAR ── */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">

            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all hover:border-white/20 hover:text-white lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div className="hidden sm:block">
                <h2 className="text-sm font-semibold text-white">
                  AI-Driven Defect Tracker
                </h2>
                <p className="text-[11px] text-slate-500">Enterprise SaaS Workspace</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Notifications bell */}
              <NavLink
                to={`/${role}/notifications`}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all hover:border-white/20 hover:text-white"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-black">
                    {unreadCount}
                  </span>
                )}
              </NavLink>

              {/* Name + role badge */}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-medium text-white">{displayName}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${ROLE_COLORS[role]}`}
                >
                  {role}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-black">
                {initials}
              </div>

              {/* Logout (desktop only) */}
              <button
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20 lg:flex"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
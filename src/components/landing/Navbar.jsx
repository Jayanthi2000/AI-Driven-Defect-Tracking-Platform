/* =========================================
   PREMIUM LANDING NAVBAR — FINAL FIXED
========================================= */

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Zap,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useAuth,
} from "../../context/AuthContext";

/* =========================================
   ROLE STYLES
========================================= */

const ROLE_STYLES = {
  admin: {
    label: "Admin",

    className:
      "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30",
  },

  developer: {
    label: "Developer",

    className:
      "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  },

  tester: {
    label: "Tester",

    className:
      "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  },
};

/* =========================================
   ROLE META
========================================= */

function getRoleMeta(role) {
  return (
    ROLE_STYLES?.[
      role?.toLowerCase()
    ] || {
      label: role || "User",

      className:
        "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
    }
  );
}

/* =========================================
   USER INITIALS
========================================= */

function getInitials(user) {
  if (!user) return "?";

  const name =
    user?.name ||
    user?.fullName ||
    user?.email ||
    "";

  return (
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    name.charAt(0).toUpperCase()
  );
}

/* =========================================
   USER MENU
========================================= */

function UserMenu({
  user,
  logout,
}) {
  const [open, setOpen] =
    useState(false);

  const ref = useRef(null);

  const navigate =
    useNavigate();

  const role =
    getRoleMeta(user?.role);

  const initials =
    getInitials(user);

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email ||
    "User";

  /* =========================================
     DASHBOARD PATH
  ========================================= */

  const dashboardPath =
    user?.role
      ?.toLowerCase()
      ?.trim() === "admin"
      ? "/admin/dashboard"
      : user?.role
          ?.toLowerCase()
          ?.trim() ===
        "developer"
      ? "/developer/dashboard"
      : "/tester/dashboard";

  /* =========================================
     CLOSE DROPDOWN
  ========================================= */

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current &&
        !ref.current.contains(
          e.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
    >
      {/* USER BUTTON */}

      <button
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 transition-all duration-200 hover:border-emerald-500/30 hover:bg-white/[0.07]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-black shadow-lg shadow-emerald-500/20">
          {initials}
        </div>

        <div className="hidden lg:flex flex-col items-start">
          <span className="max-w-[120px] truncate text-sm font-semibold text-white">
            {displayName}
          </span>

          <span className="text-[10px] text-slate-500">
            {role.label}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`hidden lg:block text-slate-400 transition-transform duration-200 ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            transition={{
              duration: 0.16,
            }}
            className="absolute right-0 top-full z-[9999] mt-3 w-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* USER INFO */}

            <div className="border-b border-white/[0.06] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-black">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName}
                  </p>

                  {user?.email && (
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  )}

                  <span
                    className={`mt-2 inline-flex rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${role.className}`}
                  >
                    {role.label}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="p-2">
              <button
                onClick={() => {
                  setOpen(false);

                  navigate(
                    dashboardPath
                  );
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <LayoutDashboard
                  size={15}
                />

                Dashboard
              </button>

              <button
                onClick={() => {
                  setOpen(false);

                  logout();

                  navigate("/");
                }}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={15} />

                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================
   MAIN NAVBAR
========================================= */

export default function Navbar() {
  const [open, setOpen] =
    useState(false);

  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();

  /* =========================================
     NAV ITEMS
  ========================================= */

  const navItems = [
    {
      name: "Features",
      path: "/features",
    },

    {
      name: "Pricing",
      path: "/pricing",
    },

    {
      name: "Docs",
      path: "/docs",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0B0F17]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* LOGO */}

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <Zap
              size={18}
              className="text-black"
              fill="currentColor"
            />
          </div>

          <span className="text-lg font-bold tracking-tight text-white">
            Defect
            <span className="text-emerald-400">
              AI
            </span>
          </span>
        </Link>

        {/* DESKTOP NAV */}

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT SIDE */}

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated &&
          user ? (
            <UserMenu
              user={user}
              logout={logout}
            />
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Sign In
              </Link>

              <Link
                to="/login"
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}

        <button
          onClick={() =>
            setOpen(!open)
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white md:hidden"
        >
          {open ? (
            <X size={18} />
          ) : (
            <Menu size={18} />
          )}
        </button>
      </div>
    </header>
  );
}
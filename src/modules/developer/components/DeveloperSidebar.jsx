import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bug,
  Activity,
  User,
  ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "MAIN",
    items: [
      {
        to: "/developer/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        to: "/developer/my-bugs",
        label: "My Bugs",
        icon: Bug,
      },
      {
        to: "/developer/activity",
        label: "Activity",
        icon: Activity,
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        to: "/developer/profile",
        label: "Profile",
        icon: User,
      },
    ],
  },
];

export default function DeveloperSidebar({
  collapsed,
  onToggle,
}) {
  const location = useLocation();

  return (
    <motion.aside
  initial={false}
  animate={{
    width: collapsed ? 72 : 240,
  }}
  transition={{
    duration: 0.25,
  }}
  className="
sticky
top-16
h-[calc(100vh-64px)]
flex-shrink-0
border-r
border-emerald-500/10
bg-[#0a0a0a]/30
backdrop-blur-sm
relative
overflow-hidden
"
>
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "linear-gradient(180deg, rgba(20,184,166,0.05) 0%, transparent 40%)",
    }}
  />

    {/* Primary Soft Glow */}
      {/* Toggle */}
      <div className="flex justify-end p-3 border-b border-white/5">
        <button
          onClick={onToggle}
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-xl
            bg-white/5
            border border-white/10
            text-slate-400
            hover:text-white
            hover:border-emerald-500/30
            hover:bg-emerald-500/10
            transition-all
          "
        >
          <ChevronLeft
            size={16}
            className={`transition-transform ${collapsed ? "rotate-180" : ""
              }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 overflow-y-auto h-full">
        {NAV_ITEMS.map((group) => (
          <div
            key={group.label}
            className="mb-6"
          >
            {!collapsed && (
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[2px]
                  text-emerald-400
                  font-bold
                  px-3
                  mb-2
                "
              >
                {group.label}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const active =
                  location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                      relative
                      flex items-center
                      rounded-xl
                      transition-all
                      ${collapsed
                        ? "justify-center p-3"
                        : "px-3 py-3 gap-3"
                      }
                      ${active
                        ? `
                            bg-emerald-500/10
                            border border-emerald-500/20
                            text-emerald-400
                          `
                        : `
                            text-slate-400
                            hover:text-white
                            hover:bg-white/5
                          `
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="developer-active-tab"
                        className="
                          absolute
                          inset-0
                          rounded-xl
                          border
                          border-emerald-500/20
                          bg-emerald-500/5
                        "
                      />
                    )}

                    <Icon
                      size={18}
                      className="relative z-10"
                    />

                    {!collapsed && (
                      <span className="relative z-10 text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
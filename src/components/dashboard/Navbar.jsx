import { useState } from "react";

import {
  Menu,
  Bell,
  ChevronDown,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { ROLE_HOME } from "../../utils/routeConfig";

export default function Navbar({
  openSidebar,
}) {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [openDropdown,
    setOpenDropdown] =
    useState(false);

  const initials =
    user?.name
      ?.split(" ")
      ?.map((w) => w[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "U";

  const handleLogout =
    () => {
      logout();
      navigate("/");
    };

  const dashboardRoute =
    ROLE_HOME[
      user?.role
        ?.toLowerCase()
    ];

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 items-center justify-between
        border-b border-white/[0.06]
        bg-[#0b1220]/80
        px-4 backdrop-blur-xl
        sm:px-6
      "
    >
      {/* LEFT */}

      <div className="flex items-center gap-3">
        <button
          onClick={openSidebar}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-white/[0.06]
            bg-white/[0.03]
            text-slate-300
            transition-all hover:bg-white/[0.06]
            lg:hidden
          "
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-white sm:text-base">
            Welcome back,
            {" "}
            {user?.name}
          </h1>

          <p className="text-xs text-slate-500">
            Manage your workspace
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">
        {/* NOTIFICATION */}

        <button
          className="
            relative flex h-10 w-10 items-center justify-center
            rounded-xl border border-white/[0.06]
            bg-white/[0.03]
            text-slate-300
            transition-all hover:bg-white/[0.06]
          "
        >
          <Bell size={18} />

          <span
            className="
              absolute right-2 top-2
              h-2 w-2 rounded-full
              bg-emerald-400
            "
          />
        </button>

        {/* PROFILE */}

        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdown(
                !openDropdown
              )
            }
            className="
              flex items-center gap-3
              rounded-2xl border border-white/[0.06]
              bg-white/[0.03]
              px-3 py-2
              transition-all hover:bg-white/[0.06]
            "
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                bg-gradient-to-br
                from-emerald-400
                to-emerald-600
                text-sm font-bold text-black
              "
            >
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <h3 className="text-sm font-medium text-white">
                {user?.name}
              </h3>

              <p className="text-xs capitalize text-slate-500">
                {user?.role}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                openDropdown
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}

          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  absolute right-0 mt-3
                  w-56 overflow-hidden
                  rounded-2xl
                  border border-white/[0.06]
                  bg-[#111827]
                  shadow-2xl
                "
              >
                <div className="border-b border-white/[0.06] p-4">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {user?.name}
                  </h3>

                  <p className="truncate text-xs text-slate-500">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate(
                        dashboardRoute
                      );

                      setOpenDropdown(
                        false
                      );
                    }}
                    className="
                      flex w-full items-center rounded-xl
                      px-3 py-2 text-sm text-slate-300
                      transition-all hover:bg-white/[0.05]
                    "
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      navigate(
                        `${dashboardRoute.replace(
                          "/dashboard",
                          ""
                        )}/profile`
                      );

                      setOpenDropdown(
                        false
                      );
                    }}
                    className="
                      flex w-full items-center rounded-xl
                      px-3 py-2 text-sm text-slate-300
                      transition-all hover:bg-white/[0.05]
                    "
                  >
                    Profile
                  </button>

                  <button
                    onClick={
                      handleLogout
                    }
                    className="
                      flex w-full items-center rounded-xl
                      px-3 py-2 text-sm text-red-400
                      transition-all hover:bg-red-500/10
                    "
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
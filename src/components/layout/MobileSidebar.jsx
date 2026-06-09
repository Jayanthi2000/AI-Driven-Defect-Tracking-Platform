import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { ADMIN_ROUTES } from "../../routes/routeConfig";

export default function MobileSidebar({
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <AnimatePresence>

      {mobileOpen && (
        <>
          {/* overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />

          {/* panel */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#0b1120] lg:hidden"
          >

            {/* header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">

              <div>
                <h2 className="text-lg font-bold">
                  DefectAI
                </h2>

                <p className="text-xs text-gray-400">
                  Admin Workspace
                </p>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-gray-300"
              >
                <X size={18} />
              </button>

            </div>

            {/* links */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">

              {ADMIN_ROUTES.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-3 rounded-2xl px-4 py-3 transition
                      ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }
                      `
                    }
                  >
                    <Icon size={18} />

                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}

            </nav>

          </motion.aside>
        </>
      )}

    </AnimatePresence>
  );
}
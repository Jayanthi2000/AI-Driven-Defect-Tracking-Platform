import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  Bug,
  BarChart2,
  Trello,
  Zap,
  Users,
  ClipboardList,
  Bell,
  Activity,
  FileText,
  Plug,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Command,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    section: "Core",
    items: [
      {
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        path: "/admin/analytics",
        icon: BarChart2,
        label: "Analytics",
      },
      {
        path: "/admin/bugs",
        icon: Bug,
        label: "Bug Reports",
        badge: 6,
      },
      {
        path: "/admin/kanban",
        icon: Trello,
        label: "Kanban Board",
      },
      {
        path: "/admin/ai-insights",
        icon: Zap,
        label: "AI Insights",
      },
    ],
  },

  {
    section: "Team",
    items: [
      {
        path: "/admin/team",
        icon: Users,
        label: "Team",
      },
      {
        path: "/admin/assignments",
        icon: ClipboardList,
        label: "Assignments",
      },
      {
        path: "/admin/notifications",
        icon: Bell,
        label: "Notifications",
        badge: 3,
      },
    ],
  },

  {
    section: "System",
    items: [
      {
        path: "/admin/activity",
        icon: Activity,
        label: "Activity Logs",
      },
      {
        path: "/admin/reports",
        icon: FileText,
        label: "Reports",
      },
      {
        path: "/admin/integrations",
        icon: Plug,
        label: "Integrations",
      },
    ],
  },

  {
    section: "Account",
    items: [
      {
        path: "/admin/settings",
        icon: Settings,
        label: "Settings",
      },
      {
        path: "/admin/profile",
        icon: User,
        label: "Profile",
      },
    ],
  },
];

export function Sidebar({ onCommandPalette }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const SidebarContent = ({ isMobile = false }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#050816 0%,#070b1a 100%)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: "18px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            flexShrink: 0,
            background:
              "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(34,197,94,0.3)",
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            ⬡
          </span>
        </div>

        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Nexus
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                Enterprise Suite
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEARCH */}

      <div
        style={{
          padding: "12px 10px 8px",
        }}
      >
        <button
          onClick={onCommandPalette}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 13,
            transition: "all 0.2s",
          }}
        >
          <Command size={14} />

          {(!collapsed || isMobile) && (
            <span
              style={{
                flex: 1,
                textAlign: "left",
              }}
            >
              Search...
            </span>
          )}

          {(!collapsed || isMobile) && (
            <kbd
              style={{
                fontSize: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 6,
                padding: "2px 6px",
                color: "#94a3b8",
              }}
            >
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* NAVIGATION */}

      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "6px 8px",
        }}
      >
        {navItems.map((group) => (
          <div
            key={group.section}
            style={{
              marginBottom: 20,
            }}
          >
            {(!collapsed || isMobile) && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "0.08em",
                  padding: "4px 10px 8px",
                  textTransform: "uppercase",
                }}
              >
                {group.section}
              </div>
            )}

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
                title={
                  collapsed && !isMobile
                    ? item.label
                    : undefined
                }
                style={({ isActive }) => ({
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 14,
                  marginBottom: 4,
                  textDecoration: "none",
                  color: isActive
                    ? "#ffffff"
                    : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(34,197,94,0.10), rgba(20,184,166,0.05))"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(34,197,94,0.18)"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
                  overflow: "hidden",
                })}
              >
                <item.icon
                  size={17}
                  style={{
                    flexShrink: 0,
                  }}
                />

                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge &&
                  (!collapsed || isMobile) && (
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg,#22c55e,#16a34a)",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 999,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* FOOTER */}

      <div
        style={{
          padding: "10px 8px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            RS
          </div>

          {(!collapsed || isMobile) && (
            <div
              style={{
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                }}
              >
                Rahul Singh
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                Admin
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE BUTTON */}

      <button
        onClick={() => setMobileOpen(true)}
        className="mobile-menu-btn"
        style={{
          display: "none",
          position: "fixed",
          top: 14,
          left: 14,
          zIndex: 100,
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          color: "#fff",
          cursor: "pointer",
          padding: "8px 10px",
        }}
      >
        <Menu size={18} />
      </button>

      {/* DESKTOP */}

      <motion.aside
        animate={{
          width: collapsed ? 72 : 250,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="desktop-sidebar"
        style={{
          height: "100vh",
          background:
            "linear-gradient(180deg,#050816 0%,#070b1a 100%)",
          borderRight:
            "1px solid rgba(255,255,255,0.06)",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <SidebarContent />

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          style={{
            position: "absolute",
            top: 22,
            right: -12,
            width: 26,
            height: 26,
            background: "#0f172a",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#cbd5e1",
            zIndex: 10,
          }}
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronLeft size={13} />
          )}
        </button>
      </motion.aside>

      {/* MOBILE DRAWER */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileOpen(false)
              }
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                zIndex: 150,
                backdropFilter: "blur(4px)",
              }}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                type: "spring",
                damping: 25,
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: 260,
                background:
                  "linear-gradient(180deg,#050816 0%,#070b1a 100%)",
                borderRight:
                  "1px solid rgba(255,255,255,0.06)",
                zIndex: 160,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() =>
                  setMobileOpen(false)
                }
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <SidebarContent isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .sidebar-link:hover {
          background: rgba(34,197,94,0.07) !important;
          color: white !important;
        }

        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }

          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

export default Sidebar;
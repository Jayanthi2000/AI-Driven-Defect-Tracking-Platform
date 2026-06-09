import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  LogIn,
  UserPlus,
  Settings,
  Bug,
  KanbanSquare,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    getRoleRedirect,
    logout,
  } = useAuth();

  const dashboardPath =
    isAuthenticated
      ? getRoleRedirect()
      : "/login";

  const navItems = isAuthenticated
    ? [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: dashboardPath,
        },
        {
          label: "Bugs",
          icon: Bug,
          path: "/bugs",
        },
        {
          label: "Kanban",
          icon: KanbanSquare,
          path: "/kanban",
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
        },
        {
          label: "Team",
          icon: Users,
          path: "/team",
        },
        {
          label: "Settings",
          icon: Settings,
          path: "/settings",
        },
      ]
    : [];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(3,7,18,0.78)",
        borderBottom:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: "14px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* LOGO */}

        <Link
          to={
            isAuthenticated
              ? dashboardPath
              : "/"
          }
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background:
                "linear-gradient(135deg,#00f5d4,#00c896)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#031019",
              fontWeight: 900,
              fontSize: 18,
              boxShadow:
                "0 10px 30px rgba(0,245,212,0.28)",
            }}
          >
            ⚡
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#fff",
            }}
          >
            Defect
            <span
              style={{
                color: "#00f5d4",
              }}
            >
              AI
            </span>
          </div>
        </Link>

        {/* CENTER NAV */}

        {isAuthenticated && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 6,
              borderRadius: 18,
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  onClick={() =>
                    navigate(item.path)
                  }
                  style={{
                    height: 42,
                    padding: "0 16px",
                    borderRadius: 12,
                    border: "none",
                    background: isActive
                      ? "linear-gradient(135deg,#00f5d4,#00c896)"
                      : "transparent",
                    color: isActive
                      ? "#031019"
                      : "#cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontWeight: 700,
                    transition: "0.25s ease",
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* RIGHT ACTIONS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          {isAuthenticated ? (
            <>
              <button
                onClick={() =>
                  navigate(dashboardPath)
                }
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 14,
                  border:
                    "1px solid rgba(0,245,212,0.14)",
                  background:
                    "rgba(0,245,212,0.08)",
                  color: "#00f5d4",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <LayoutDashboard size={16} />
                Workspace
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 14,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background:
                    "rgba(255,255,255,0.04)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 14,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background:
                    "rgba(255,255,255,0.04)",
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 700,
                }}
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  height: 44,
                  padding: "0 20px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg,#00f5d4,#00c896)",
                  color: "#031019",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 800,
                  boxShadow:
                    "0 10px 30px rgba(0,245,212,0.28)",
                }}
              >
                <UserPlus size={16} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
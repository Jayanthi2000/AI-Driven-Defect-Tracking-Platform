import { useState, useRef } from "react";
import { Bell, Menu } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

// Role → accent color map (mirrors Sidebar)
const ACCENT = {
  admin:     "#22c55e",
  developer: "#22c55e",
  tester:    "#f59e0b",
};

// Role → subtitle map
const SUBTITLE = {
  admin:     "DefectAI Admin Panel",
  developer: "DefectAI Developer Portal",
  tester:    "DefectAI Tester Module",
};

// Admin top-level nav links (only admin has a horizontal topbar nav)
const ADMIN_NAV = [
  { label: "Dashboard",     to: "/admin/dashboard" },
  { label: "Team",          to: "/admin/team" },
  { label: "Notifications", to: "/admin/notifications" },
  { label: "Settings",      to: "/admin/settings" },
];

/**
 * Topbar
 *
 * Props:
 *   role             – "admin" | "developer" | "tester"
 *   user             – { name, email }
 *   sidebarCollapsed – boolean (used to adjust left offset on mobile)
 *   onToggleSidebar  – () => void
 *   title            – optional string override
 *   subtitle         – optional string override
 *   notificationCount – number (default 0)
 */
export default function Topbar({
  role = "developer",
  user,
  sidebarCollapsed,
  onToggleSidebar,
  title = "Dashboard",
  subtitle,
  notificationCount = 0,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);
  const accent = ACCENT[role] ?? "#22c55e";
  const sub = subtitle ?? SUBTITLE[role] ?? "";
  const isAdmin = role === "admin";

  return (
    <>
      <header className={`topbar ${isAdmin ? "topbar--admin" : ""}`}>
        {/* Left: title (all roles) + admin horizontal nav */}
        <div className="topbar-left">
          {/* Mobile hamburger — visible only when sidebar is not fixed */}
          <button className="topbar-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
            <Menu size={20} />
          </button>

          <div className="topbar-titles">
            <h1 className="topbar-title">{title}</h1>
            {sub && <p className="topbar-subtitle">{sub}</p>}
          </div>

          {/* Admin horizontal nav links */}
          {isAdmin && (
            <nav className="admin-topnav">
              {ADMIN_NAV.map((item) => (
                <a key={item.to} href={item.to} className="admin-topnav-link">
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Right: actions */}
        <div className="topbar-right">
          {/* Refresh button (admin only) */}
          {isAdmin && (
            <button className="topbar-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              <span>Refresh</span>
            </button>
          )}

          {/* Notification bell */}
          <button className="topbar-icon-btn notif-btn" aria-label="Notifications">
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="notif-badge">{notificationCount}</span>
            )}
          </button>

          {/* Avatar / profile trigger */}
          <div className="topbar-profile-wrap">
            <button
              ref={avatarRef}
              className="topbar-avatar-btn"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              style={{ "--accent": accent }}
            >
              <div className="topbar-avatar" style={{ background: accent }}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="topbar-avatar-info">
                <span className="topbar-avatar-name">{user?.name}</span>
                <span className="topbar-avatar-role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "#6b7280", marginLeft: 2, flexShrink: 0 }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <ProfileDropdown
              user={user}
              role={role}
              accentColor={accent}
              open={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              anchorRef={avatarRef}
            />
          </div>
        </div>
      </header>

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 64px;
          background: rgba(10, 14, 26, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 16px;
        }

        /* Admin variant: slightly taller to fit horizontal nav */
        .topbar--admin {
          height: 64px;
        }

        /* Left */
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
          min-width: 0;
          flex: 1;
        }
        .topbar-hamburger {
          display: none;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.15s;
        }
        .topbar-hamburger:hover { color: #e2e8f0; }
        @media (max-width: 768px) {
          .topbar-hamburger { display: flex; }
        }

        .topbar-titles {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .topbar-title {
          font-size: 17px;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.2;
        }
        .topbar-subtitle {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        /* Admin horizontal nav */
        .admin-topnav {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
        }
        .admin-topnav-link {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .admin-topnav-link:hover {
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
        }
        .admin-topnav-link[aria-current="page"],
        .admin-topnav-link.active {
          background: rgba(34,197,94,0.12);
          color: #22c55e;
        }

        /* Right */
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .topbar-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .topbar-action-btn:hover {
          background: rgba(255,255,255,0.09);
          color: #e2e8f0;
        }

        .topbar-icon-btn {
          position: relative;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 7px;
          border-radius: 8px;
          transition: background 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .topbar-icon-btn:hover {
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
        }
        .notif-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #0a0e1a;
        }

        /* Profile */
        .topbar-profile-wrap {
          position: relative;
        }
        .topbar-avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 10px;
          transition: background 0.15s;
        }
        .topbar-avatar-btn:hover {
          background: rgba(255,255,255,0.06);
        }
        .topbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .topbar-avatar-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }
        .topbar-avatar-name {
          font-size: 13px;
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap;
        }
        .topbar-avatar-role {
          font-size: 11px;
          color: #6b7280;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
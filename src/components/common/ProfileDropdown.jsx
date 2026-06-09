import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

/**
 * ProfileDropdown
 *
 * Props:
 *   user       – { name, email, avatarUrl? }
 *   role       – "admin" | "developer" | "tester"
 *   accentColor – string (CSS color)
 *   open       – boolean
 *   onClose    – () => void
 *   anchorRef  – ref to the trigger button (for positioning)
 */
export default function ProfileDropdown({ user, role, accentColor = "#22c55e", open, onClose, anchorRef }) {
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const profilePath = `/${role}/profile`;
  const logoutPath  = "/logout";

  return (
    <>
      <div ref={dropdownRef} className="profile-dropdown">
        {/* User info header */}
        <div className="pd-header">
          <div className="pd-avatar" style={{ background: accentColor }}>
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="pd-info">
            <span className="pd-name">{user?.name}</span>
            <span className="pd-email">{user?.email}</span>
          </div>
        </div>

        <div className="pd-divider" />

        {/* Menu items */}
        <Link to={profilePath} className="pd-item" onClick={onClose}>
          <User size={15} />
          <span>Profile</span>
        </Link>

        <div className="pd-divider" />

        <Link to={logoutPath} className="pd-item pd-logout" onClick={onClose}>
          <LogOut size={15} />
          <span>Logout</span>
        </Link>
      </div>

      <style>{`
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 220px;
          background: #161b2e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          z-index: 200;
          overflow: hidden;
          animation: pdFadeIn 0.15s ease;
        }
        @keyframes pdFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pd-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
        }
        .pd-avatar {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .pd-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .pd-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .pd-email {
          font-size: 11.5px;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pd-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .pd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          font-size: 13.5px;
          color: #94a3b8;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
          cursor: pointer;
        }
        .pd-item:hover {
          background: rgba(255,255,255,0.05);
          color: #e2e8f0;
        }
        .pd-logout:hover {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
        }
      `}</style>
    </>
  );
}
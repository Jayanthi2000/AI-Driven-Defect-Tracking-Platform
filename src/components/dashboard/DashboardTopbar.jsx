import {
  Search,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

export default function DashboardTopbar() {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      marginBottom: 28,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(8,8,14,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      padding: "14px 20px",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)",
    }}>
      {/* LEFT */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", margin: 0, letterSpacing: "-0.03em" }}>
          Admin Dashboard
        </h2>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>
          Welcome back — monitor your AI platform.
        </p>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
          width: 220,
        }} className="search-bar-hidden">
          <Search size={14} style={{ color: "#475569", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search bugs, projects..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#e2e8f0",
              width: "100%",
            }}
          />
        </div>

        {/* AI Button */}
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 14px",
          borderRadius: 10,
          border: "1px solid rgba(34,197,94,0.2)",
          background: "rgba(34,197,94,0.08)",
          color: "#22c55e",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.16s",
          letterSpacing: "-0.01em",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.14)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(34,197,94,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <Sparkles size={14} />
          AI Engine
        </button>

        {/* Notification bell */}
        <button style={{
          position: "relative",
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
          color: "#64748b",
          cursor: "pointer",
          transition: "all 0.16s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#e2e8f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#64748b"; }}
        >
          <Bell size={16} />
          <span style={{
            position: "absolute", top: 8, right: 8,
            width: 7, height: 7, borderRadius: "50%",
            background: "#ef4444",
            boxShadow: "0 0 6px rgba(239,68,68,0.7)",
            border: "1.5px solid rgba(8,8,14,0.9)",
          }} />
        </button>

        {/* Settings */}
        <button style={{
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
          color: "#64748b",
          cursor: "pointer",
          transition: "all 0.16s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#e2e8f0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#64748b"; }}
        >
          <Settings size={16} />
        </button>

        {/* Profile */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "5px 10px 5px 5px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
          cursor: "pointer",
          transition: "all 0.16s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #22c55e, #14b8a6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 12, color: "black",
            boxShadow: "0 0 10px rgba(34,197,94,0.25)",
          }}>
            F
          </div>
          <div style={{ display: "none" }} className="profile-name">
            <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", display: "block" }}>Fathima</span>
            <span style={{ fontSize: 11, color: "#475569" }}>System Admin</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .search-bar-hidden { display: flex !important; }
          .profile-name { display: block !important; }
        }
        @media (max-width: 1023px) {
          .search-bar-hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

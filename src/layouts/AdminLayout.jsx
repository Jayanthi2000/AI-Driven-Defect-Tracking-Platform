// ─── DefectAI Admin Layout ────────────────────────────────────────────────────

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminProvider } from "../context/AdminContext";
import AdminNavbar from "../components/navbar/AdminNavbar";
import AdminSidebar from "../components/navbar/AdminSidebar";

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AdminProvider>
      <div style={{ position: "relative", minHeight: "100vh", color: "white", background: "#070a14", overflow: "hidden" }}>

        {/* ── Full-page grid background ── */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }} />

        {/* ── Top-right teal/green glow ── */}
        <div style={{
          position: "fixed", pointerEvents: "none", zIndex: 0,
          top: "-18%", right: "-10%", width: "800px", height: "700px",
          background: "radial-gradient(ellipse at top right, rgba(20,184,166,0.22) 0%, rgba(34,197,94,0.10) 35%, transparent 65%)",
          filter: "blur(90px)",
        }} />

        {/* ── Bottom-left green glow ── */}
        <div style={{
          position: "fixed", pointerEvents: "none", zIndex: 0,
          bottom: "0%", left: "-8%", width: "600px", height: "500px",
          background: "radial-gradient(ellipse at bottom left, rgba(34,197,94,0.09) 0%, rgba(20,184,166,0.04) 40%, transparent 65%)",
          filter: "blur(80px)",
        }} />

        {/* ── Center blue accent glow ── */}
        <div style={{
          position: "fixed", pointerEvents: "none", zIndex: 0,
          top: "40%", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "400px",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        {/* ── Vignette ── */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 130% 110% at 50% 50%, transparent 30%, rgba(4,6,14,0.7) 100%)",
        }} />

        {/* ── App shell ── */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <AdminNavbar />

          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            {/* Fixed-height sidebar that stays at top */}
            <div style={{
              position: "sticky",
              top: 64,
              height: "calc(100vh - 64px)",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}>
              <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((prev) => !prev)}
              />
            </div>

            <main style={{
              flex: 1,
              overflowX: "hidden",
              overflowY: "auto",
              padding: "28px 32px",
              minWidth: 0,
              minHeight: "calc(100vh - 64px)",
            }}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}

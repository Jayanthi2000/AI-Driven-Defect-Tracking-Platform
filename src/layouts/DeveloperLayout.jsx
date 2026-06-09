// src/modules/developer/components/DeveloperLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import DeveloperNavbar from "./DeveloperNavbar";
import DeveloperSidebar from "./DeveloperSidebar";

const GridBackground = () => (
  <div
    className="fixed inset-0 pointer-events-none overflow-hidden"
    style={{ zIndex: 0 }}
  >
    {/* Base Background */}
    <div className="absolute inset-0 bg-[#0a0a0f]" />

    {/* Square Grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />

    {/* Same Glow as Login Page */}
    <div
      className="absolute"
      style={{
        top: "-20%",
        right: "-10%",
        width: "750px",
        height: "650px",
        background:
          "radial-gradient(ellipse at top right, rgba(20,184,166,0.20) 0%, rgba(34,197,94,0.10) 35%, transparent 65%)",
        filter: "blur(70px)",
      }}
    />

    {/* Secondary Soft Glow */}
    <div
      className="absolute"
      style={{
        top: "0%",
        right: "10%",
        width: "400px",
        height: "350px",
        background:
          "radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 60%)",
        filter: "blur(60px)",
      }}
    />

    {/* Vignette */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(
            ellipse 120% 100% at 50% 50%,
            transparent 40%,
            rgba(8,8,14,0.85) 100%
          )
        `,
      }}
    />
  </div>
);

export default function DeveloperLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen text-white font-sans">

      <GridBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <DeveloperNavbar />

        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <DeveloperSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
          />

          <main
            style={{
              flex: 1,
              overflowX: "hidden",
              overflowY: "auto",
              padding: "28px",
              minWidth: 0,
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
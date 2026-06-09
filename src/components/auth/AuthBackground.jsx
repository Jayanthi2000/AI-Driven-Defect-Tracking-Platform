import React from "react";
import { motion } from "framer-motion";

const AuthBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">

    {/* Base dark */}
    <div className="absolute inset-0" style={{ background: "#0a0a0f" }} />

    {/* ✅ SQUARE GRID — exact landing page pattern */}
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

    {/* Top-right teal/green glow over the grid */}
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

    {/* Softer secondary glow */}
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

    {/* Vignette — fades grid at edges so it doesn't look clipped */}
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 120% 100% at 50% 50%,
            transparent 40%,
            rgba(8,8,14,0.85) 100%)
        `,
      }}
    />

    {/* Bottom fade */}
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{
        height: "30%",
        background: "linear-gradient(to bottom, transparent, rgba(6,6,10,0.8))",
      }}
    />

  </div>
);

export const AuthCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`relative z-10 w-full max-w-md mx-auto ${className}`}
  >
    <div
      className="rounded-2xl p-8"
      style={{
        background:
          "linear-gradient(145deg, rgba(20,184,166,0.07) 0%, rgba(10,10,16,0.92) 50%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow:
          "0 0 0 1px rgba(34,197,94,0.08), 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
      }}
    >
      {children}
    </div>
  </motion.div>
);

export const AuthLogo = () => (
  <div className="flex items-center gap-2.5 mb-8">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
    >
      <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
        <path d="M7.5 1L0.5 9H6L5 15L12.5 7H7L7.5 1Z" fill="white" />
      </svg>
    </div>
    <span className="text-xl font-bold tracking-tight text-white">
      Defect<span style={{ color: "#22c55e" }}>AI</span>
    </span>
  </div>
);

export default AuthBackground;
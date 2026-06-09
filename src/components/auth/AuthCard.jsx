import React from "react";

import { motion } from "framer-motion";

/**
 * =========================================================
 * AUTH CARD
 * Responsive Glassmorphism Card
 * =========================================================
 */

export default function AuthCard({
  children,
  className = "",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
      }}
      className={`
        relative
        w-full
        max-w-[480px]
        overflow-visible
        rounded-3xl
        border border-white/10
        bg-white/[0.04]
        p-7
        shadow-2xl
        backdrop-blur-2xl
        sm:p-9
        ${className}
      `}
    >
      {/* =====================================================
          TOP SHIMMER
      ===================================================== */}

      <div
        className="
          absolute inset-x-0 top-0 h-px
          bg-gradient-to-r
          from-transparent
          via-emerald-400/50
          to-transparent
        "
      />

      {/* =====================================================
          GLOW EFFECTS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute -right-24 -top-24
          h-44 w-44 rounded-full
          bg-emerald-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute -bottom-24 -left-24
          h-44 w-44 rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      {/* =====================================================
          INNER BORDER
      ===================================================== */}

      <div
        className="
          absolute inset-0
          rounded-[30px]
          border border-white/[0.03]
        "
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
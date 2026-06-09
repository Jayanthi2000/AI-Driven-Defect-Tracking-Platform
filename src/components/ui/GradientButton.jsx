import React from "react";

export default function GradientButton({
  children,
  fullWidth = false,
  loading = false,
  className = "",
  type = "button",
  disabled = false,
  variant = "emerald",
  size = "md",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold transition-all duration-200
        disabled:cursor-not-allowed disabled:opacity-60
        bg-gradient-to-r from-emerald-500 to-emerald-600
        hover:from-emerald-400 hover:to-emerald-500
        text-white shadow-emerald-glow
        h-12 px-6 text-sm
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Loading…
        </span>
      ) : (
        children
      )}
    </button>
  );
}

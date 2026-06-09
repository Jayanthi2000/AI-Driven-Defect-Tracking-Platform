import React from "react";

/**
 * Responsive Professional InputField
 */

export default function InputField({
  label,
  icon: Icon,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">

      {/* LABEL */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div className="relative w-full">

        {/* ICON */}
        {Icon && (
          <div
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          >
            <Icon size={18} />
          </div>
        )}

        {/* INPUT */}
        <input
          {...props}
          className={`
            w-full
            h-12
            sm:h-14
            rounded-2xl
            border
            bg-[#162033]
            text-sm
            sm:text-base
            text-white
            placeholder:text-slate-500
            px-4
            ${Icon ? "pl-12" : ""}
            outline-none
            transition-all
            duration-200
            backdrop-blur-xl
            focus:scale-[1.01]
            focus:ring-4
            focus:ring-emerald-400/10
            ${
              error
                ? "border-red-500/70 focus:border-red-400 focus:ring-red-400/10"
                : "border-white/10 focus:border-emerald-400"
            }
            ${className}
          `}
        />

      </div>

      {/* ERROR */}
      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}
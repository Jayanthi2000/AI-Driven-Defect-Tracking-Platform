import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Professional Responsive Password Input
 */

export default function PasswordInput({
  label,
  error,
  className = "",
  ...props
}) {
  const [show, setShow] =
    useState(false);

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

        {/* INPUT */}
        <input
          {...props}
          type={
            show
              ? "text"
              : "password"
          }
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
            pr-14
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

        {/* TOGGLE BUTTON */}
        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            transition-all
            duration-200
            hover:text-white
            active:scale-90
          "
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

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
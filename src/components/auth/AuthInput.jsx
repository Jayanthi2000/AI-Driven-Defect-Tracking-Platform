import React from "react";

const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  rightElement,
  disabled,
  autoComplete,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#9ca3af] tracking-wide">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#22c55e] transition-colors duration-200">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full h-11 rounded-xl text-sm text-white placeholder-[#4b5563]
            bg-white/[0.04] border transition-all duration-200 outline-none
            ${Icon ? "pl-10" : "pl-4"}
            ${rightElement ? "pr-10" : "pr-4"}
            ${
              error
                ? "border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                : "border-white/[0.08] focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/10 hover:border-white/[0.12]"
            }
            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
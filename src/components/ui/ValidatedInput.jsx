import { AnimatePresence, motion } from "framer-motion";

export default function ValidatedInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  hint,
  readOnly,
  rightEl,
  required,
}) {
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ color: "#9ca3af" }}
        >
          {label}
          {required && (
            <span className="ml-1" style={{ color: "#ef4444" }}>
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={[
            "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-150",
            "bg-white/[0.04]",
            hasError
              ? "border border-[#ef4444]/60 focus:border-[#ef4444] text-white placeholder-[#6b7280]"
              : readOnly
              ? "border border-white/[0.05] text-[#6b7280] cursor-not-allowed"
              : "border border-white/[0.10] focus:border-[#22c55e]/50 text-white placeholder-[#4b5563]",
          ].join(" ")}
        />

        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#f87171" }}
          >
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs"
            style={{ color: "#4b5563" }}
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
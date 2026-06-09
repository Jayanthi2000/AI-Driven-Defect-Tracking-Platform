import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const AuthButton = ({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}) => {
  const base =
    "relative w-full h-11 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary: `
      text-white
      bg-gradient-to-r from-[#16a34a] to-[#0d9488]
      hover:from-[#15803d] hover:to-[#0f766e]
      shadow-[0_0_20px_rgba(34,197,94,0.15)]
      hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]
    `,
    ghost: `
      text-[#9ca3af] border border-white/[0.08]
      hover:border-white/[0.15] hover:text-white
      bg-white/[0.02] hover:bg-white/[0.05]
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </motion.button>
  );
};

export default AuthButton;
import React from "react";
import { motion } from "framer-motion";
import { getPasswordStrength, PASSWORD_RULES } from "../../utils/validation";
import { Check, X } from "lucide-react";

const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-3">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">Password strength</span>
          <span className="text-xs font-medium" style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: strength.score >= level ? "100%" : "0%" }}
                transition={{ duration: 0.3, delay: level * 0.05 }}
                style={{ backgroundColor: strength.score >= level ? strength.color : "transparent" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rules checklist */}
      <div className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <div key={rule.id} className="flex items-center gap-2">
              <div
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  backgroundColor: passed ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${passed ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {passed ? (
                  <Check size={9} className="text-[#22c55e]" />
                ) : (
                  <X size={9} className="text-[#4b5563]" />
                )}
              </div>
              <span
                className="text-xs transition-colors duration-200"
                style={{ color: passed ? "#9ca3af" : "#4b5563" }}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
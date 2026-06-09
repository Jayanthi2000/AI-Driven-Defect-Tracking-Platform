// ============================================================
// DefectAI Validation Utilities
// ============================================================

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// ── Password Rules ────────────────────────────────────────────

export const PASSWORD_RULES = [
  { id: "length",    label: "At least 8 characters",        test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A-Z)",    test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter (a-z)",    test: (p) => /[a-z]/.test(p) },
  { id: "number",    label: "One number (0-9)",              test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "One special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;

  if (passed <= 1) return { score: 1, label: "Weak",        color: "#ef4444" };
  if (passed === 2) return { score: 2, label: "Fair",        color: "#f97316" };
  if (passed === 3) return { score: 3, label: "Good",        color: "#eab308" };
  if (passed === 4) return { score: 4, label: "Strong",      color: "#14b8a6" };
  return              { score: 5, label: "Very Strong",  color: "#22c55e" };
};

export const isPasswordValid = (password) => {
  return PASSWORD_RULES.every((r) => r.test(password));
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};
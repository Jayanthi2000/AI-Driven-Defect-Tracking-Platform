// ============================================================
// DefectAI Auth Service — LocalStorage Only
// ============================================================
// Single source of truth for auth storage keys.
// All modules MUST use these constants (never raw strings).
// ============================================================

export const STORAGE_KEYS = {
  USERS:        "defectai_users",
  CURRENT_USER: "defectai_currentUser",
  TOKEN:        "defectai_token",
  RESET_TOKENS: "defectai_resetTokens",
};

// ── Limits ────────────────────────────────────────────────────
export const MAX_ADMINS = 5;

// ── Helpers ───────────────────────────────────────────────────
const generateToken = () => {
  const rand = Math.random().toString(36).substring(2, 11);
  return `defectai_token_${rand}`;
};

const generateResetToken = () => {
  const rand = Math.random().toString(36).substring(2, 15);
  return `reset_${rand}_${Date.now()}`;
};

const now = () => new Date().toISOString();

// ── User Store ────────────────────────────────────────────────

export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || []; }
  catch { return []; }
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// ── Count active admins ───────────────────────────────────────
export const getActiveAdminCount = () => {
  return getUsers().filter(
    (u) => u.role === "ADMIN" && u.status !== "inactive"
  ).length;
};

export const isAdminLimitReached = () => getActiveAdminCount() >= MAX_ADMINS;

// ── Public Registration — ADMIN only, max 5 ──────────────────
export const registerUser = ({ name, email, password }) => {
  if (isAdminLimitReached()) {
    return {
      success: false,
      error: `Registration is closed. The maximum of ${MAX_ADMINS} admin accounts has been reached.`,
      adminLimitReached: true,
    };
  }

  const users = getUsers();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser = {
    id:        `user_${Date.now()}`,
    name:      name.trim(),
    email:     email.toLowerCase(),
    password,
    role:      "ADMIN",
    status:    "active",
    createdBy: null,        // self-registered
    createdAt: now(),
    updatedAt: now(),
  };

  saveUsers([...users, newUser]);
  return { success: true, user: sanitize(newUser) };
};

// ── Admin Creates DEVELOPER or TESTER ────────────────────────
export const createUser = ({ name, email, password, role, createdBy = null }) => {
  const normalizedRole = role?.toUpperCase();

  if (!["DEVELOPER", "TESTER"].includes(normalizedRole)) {
    return { success: false, error: "Invalid role. Must be DEVELOPER or TESTER." };
  }

  const users = getUsers();

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists." };
  }

  const newUser = {
    id:        `user_${Date.now()}`,
    name:      name.trim(),
    email:     email.toLowerCase(),
    password,
    role:      normalizedRole,
    status:    "active",
    createdBy: createdBy || getCurrentUser()?.id || null,
    createdAt: now(),
    updatedAt: now(),
  };

  saveUsers([...users, newUser]);
  return { success: true, user: sanitize(newUser) };
};

// ── Login ─────────────────────────────────────────────────────
export const loginUser = ({ email, password, rememberMe }) => {
  const users = getUsers();
  const user  = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) return { success: false, error: "Invalid email or password." };

  if (user.status === "inactive") {
    return { success: false, error: "Your account has been deactivated. Contact an administrator." };
  }

  const token = generateToken();
  localStorage.setItem(STORAGE_KEYS.TOKEN,        token);
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ ...user, role: user.role?.toUpperCase() }));

  if (rememberMe) {
    localStorage.setItem("defectai_rememberMe", "true");
  } else {
    localStorage.removeItem("defectai_rememberMe");
  }

  // Update lastLogin
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], lastLogin: now() };
    saveUsers(users);
  }

  return { success: true, user: sanitize(user), token };
};

// ── Logout ────────────────────────────────────────────────────
export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// ── Token Validation ──────────────────────────────────────────
export const validateToken = () => {
  try {
    const token   = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userRaw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    if (!token || !userRaw)                   return { valid: false };
    if (!token.startsWith("defectai_token_")) return { valid: false };

    const user = JSON.parse(userRaw);
    if (!user?.id || !user?.email || !user?.role) return { valid: false };

    // Cross-check user still exists and is active in the store
    const users = getUsers();
    const stored = users.find((u) => u.id === user.id);
    if (!stored || stored.status === "inactive") {
      logoutUser();
      return { valid: false };
    }

    return { valid: true, user: sanitize({ ...stored, role: stored.role?.toUpperCase() }), token };
  } catch {
    return { valid: false };
  }
};

// ── Current User ──────────────────────────────────────────────
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null; }
  catch { return null; }
};

// ── Strip password before exposing user ──────────────────────
const sanitize = (user) => {
  if (!user) return null;
  const { password: _pw, ...safe } = user;
  return safe;
};

// ── Role → Dashboard Route ────────────────────────────────────
export const getDashboardRoute = (role) => {
  switch (role?.toUpperCase()) {
    case "ADMIN":     return "/admin/dashboard";
    case "DEVELOPER": return "/developer/dashboard";
    case "TESTER":    return "/tester/dashboard";
    default:          return "/login";
  }
};

// ── Forgot / Reset Password ───────────────────────────────────
export const forgotPassword = (email) => {
  const users = getUsers();
  const user  = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) return { success: false, error: "No account found with this email address." };

  const resetToken  = generateResetToken();
  const resetTokens = getResetTokens();
  const filtered    = resetTokens.filter((t) => t.email !== email.toLowerCase());

  filtered.push({ token: resetToken, email: email.toLowerCase(), expiresAt: Date.now() + 15 * 60 * 1000 });
  localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(filtered));

  return { success: true, token: resetToken };
};

export const getResetTokens = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESET_TOKENS)) || []; }
  catch { return []; }
};

export const validateResetToken = (token) => {
  const tokens = getResetTokens();
  const found  = tokens.find((t) => t.token === token);

  if (!found)                       return { valid: false, error: "Invalid or expired reset link." };
  if (Date.now() > found.expiresAt) return { valid: false, error: "This reset link has expired. Please request a new one." };

  return { valid: true, email: found.email };
};

export const resetPassword = (token, newPassword) => {
  const validation = validateResetToken(token);
  if (!validation.valid) return { success: false, error: validation.error };

  const users = getUsers();
  const idx   = users.findIndex((u) => u.email.toLowerCase() === validation.email);

  if (idx === -1) return { success: false, error: "User not found." };

  users[idx] = { ...users[idx], password: newPassword, updatedAt: now() };
  saveUsers(users);

  const tokens = getResetTokens().filter((t) => t.token !== token);
  localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));

  return { success: true };
};
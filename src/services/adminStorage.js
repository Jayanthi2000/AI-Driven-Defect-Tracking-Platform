// ─── DefectAI Admin Storage Service ─────────────────────────────────────────
// All LocalStorage operations for the admin module.
// User creation is delegated to authService to keep one source of truth.

import {
  STORAGE_KEYS as AUTH_KEYS,
  getUsers,
  createUser as authCreateUser,
  isAdminLimitReached,
  getCurrentUser as authGetCurrentUser,
} from './authService';

const KEYS = {
  ...AUTH_KEYS,
  NOTIFICATIONS: 'defectai_notifications',
  ACTIVITIES:    'defectai_activities',
  SETTINGS:      'defectai_settings',
  TICKETS:       'defectai_tickets',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
};

const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const now = () => new Date().toISOString();

// ─── Users ────────────────────────────────────────────────────────────────────
// Re-export getUsers from authService so all code reads from the same key.

export { getUsers };

export const saveUsers = (users) => write(KEYS.USERS, users);

export const getUserById = (id) =>
  getUsers().find((u) => u.id === id) || null;

export const getUserByEmail = (email) =>
  getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;

/**
 * Create a DEVELOPER or TESTER (called from Admin dashboard).
 * Data shape: { fullName, email, password, role }
 * Internally maps fullName → name so authService schema is consistent.
 */
export const createUser = (data) => {
  const result = authCreateUser({
    name:      data.fullName || data.name,
    email:     data.email,
    password:  data.password,
    role:      data.role,
    createdBy: authGetCurrentUser()?.id || null,
  });

  if (result.error) return { error: result.error };

  addNotification({
    type:    'user_created',
    title:   'New User Created',
    message: `${data.role} "${data.fullName || data.name}" was added to the system.`,
    userId:  result.user?.id,
  });

  addActivity({
    action:  'user_created',
    user:    data.fullName || data.name,
    role:    data.role,
    details: `New ${data.role} account created`,
  });

  return { user: result.user };
};

export const updateUser = (id, updates) => {
  const users = getUsers();
  const idx   = users.findIndex((u) => u.id === id);
  if (idx === -1) return { error: 'User not found' };

  users[idx] = { ...users[idx], ...updates, updatedAt: now() };
  saveUsers(users);

  addActivity({
    action:  'user_updated',
    user:    users[idx].fullName || users[idx].name,
    role:    users[idx].role,
    details: 'User profile updated',
  });

  return { user: users[idx] };
};

export const deleteUser = (id) => {
  const users = getUsers();
  const user  = users.find((u) => u.id === id);
  if (!user) return { error: 'User not found' };

  const filtered = users.filter((u) => u.id !== id);
  saveUsers(filtered);

  addNotification({
    type:    'user_deleted',
    title:   'User Removed',
    message: `${user.role} "${user.fullName || user.name}" was removed from the system.`,
  });

  addActivity({
    action:  'user_deleted',
    user:    user.fullName || user.name,
    role:    user.role,
    details: 'User account deleted',
  });

  return { success: true };
};

export const toggleUserStatus = (id) => {
  const users = getUsers();
  const idx   = users.findIndex((u) => u.id === id);
  if (idx === -1) return { error: 'User not found' };

  const newStatus = users[idx].status === 'active' ? 'inactive' : 'active';
  users[idx] = { ...users[idx], status: newStatus, updatedAt: now() };
  saveUsers(users);

  addActivity({
    action:  newStatus === 'active' ? 'user_activated' : 'user_deactivated',
    user:    users[idx].fullName || users[idx].name,
    role:    users[idx].role,
    details: `User account ${newStatus}`,
  });

  return { user: users[idx] };
};

// ─── Current User ─────────────────────────────────────────────────────────────

export const getCurrentUser = () => read(KEYS.CURRENT_USER);

export const saveCurrentUser = (user) => write(KEYS.CURRENT_USER, user);

export const updateCurrentUser = (updates) => {
  const current = getCurrentUser();
  if (!current) return null;
  const updated = { ...current, ...updates, updatedAt: now() };
  saveCurrentUser(updated);
  updateUser(current.id, updates);
  return updated;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const getNotifications = () => read(KEYS.NOTIFICATIONS) || [];

export const saveNotifications = (notifications) =>
  write(KEYS.NOTIFICATIONS, notifications);

export const addNotification = (data) => {
  const notifications = getNotifications();
  const notification  = {
    id:        generateId(),
    type:      data.type || 'info',
    title:     data.title,
    message:   data.message,
    userId:    data.userId || null,
    read:      false,
    createdAt: now(),
  };
  notifications.unshift(notification);
  saveNotifications(notifications.slice(0, 100));
  return notification;
};

export const markNotificationRead = (id) => {
  const notifications = getNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  saveNotifications(notifications);
};

export const markAllNotificationsRead = () => {
  saveNotifications(getNotifications().map((n) => ({ ...n, read: true })));
};

export const deleteNotification = (id) => {
  saveNotifications(getNotifications().filter((n) => n.id !== id));
};

export const clearAllNotifications = () => saveNotifications([]);

export const getUnreadCount = () =>
  getNotifications().filter((n) => !n.read).length;

// ─── Activities ───────────────────────────────────────────────────────────────

export const getActivities = () => read(KEYS.ACTIVITIES) || [];

export const addActivity = (data) => {
  const activities = getActivities();
  const activity   = {
    id:        generateId(),
    action:    data.action,
    user:      data.user,
    role:      data.role || 'System',
    details:   data.details,
    timestamp: now(),
  };
  activities.unshift(activity);
  write(KEYS.ACTIVITIES, activities.slice(0, 200));
  return activity;
};

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  general: {
    appName: "DefectAI", language: "en", timezone: "UTC", dateFormat: "MM/DD/YYYY",
  },
  notifications: {
    emailNotifications: true, userCreated: true, userDeleted: true,
    userLogin: true, ticketCreated: true, ticketClosed: true,
  },
  security: {
    sessionTimeout: 30, twoFactorAuth: false, passwordExpiry: 90,
  },
  appearance: {
    theme: "dark", accentColor: "#22c55e", compactMode: false,
  },
};

export const getSettings = () => {
  const stored = read(KEYS.SETTINGS);
  if (!stored) return DEFAULT_SETTINGS;
  return {
    general:       { ...DEFAULT_SETTINGS.general,       ...(stored.general       || {}) },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(stored.notifications || {}) },
    security:      { ...DEFAULT_SETTINGS.security,      ...(stored.security      || {}) },
    appearance:    { ...DEFAULT_SETTINGS.appearance,    ...(stored.appearance    || {}) },
  };
};

export const saveSettings  = (settings) => write(KEYS.SETTINGS, settings);

export const updateSettings = (section, values) => {
  const settings = getSettings();
  settings[section] = { ...settings[section], ...values };
  saveSettings(settings);
  return settings;
};

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const getTickets = () => read(KEYS.TICKETS) || [];

export const getTicketStats = () => {
  const tickets = getTickets();
  return {
    total:      tickets.length,
    open:       tickets.filter((t) => t.status === 'open').length,
    assigned:   tickets.filter((t) => t.status === 'assigned').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    closed:     tickets.filter((t) => t.status === 'closed').length,
    critical:   tickets.filter((t) => t.priority === 'critical').length,
  };
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getDashboardStats = () => {
  const users       = getUsers();
  const ticketStats = getTicketStats();
  return {
    users: {
      total:      users.length,
      developers: users.filter((u) => u.role?.toUpperCase() === 'DEVELOPER').length,
      testers:    users.filter((u) => u.role?.toUpperCase() === 'TESTER').length,
      active:     users.filter((u) => u.status === 'active').length,
      inactive:   users.filter((u) => u.status === 'inactive').length,
    },
    tickets: ticketStats,
  };
};

// ─── Seed Demo Data ────────────────────────────────────────────────────────────

export const seedDemoData = () => {
  if (getTickets().length === 0) {
    const mockTickets = [
      { id: '1', title: 'Login fails on mobile',    status: 'open',        priority: 'critical', createdAt: now() },
      { id: '2', title: 'Dashboard chart error',    status: 'assigned',    priority: 'high',     createdAt: now() },
      { id: '3', title: 'Export CSV broken',        status: 'in_progress', priority: 'medium',   createdAt: now() },
      { id: '4', title: 'Typo on settings page',   status: 'closed',      priority: 'low',      createdAt: now() },
      { id: '5', title: 'API timeout issues',       status: 'open',        priority: 'critical', createdAt: now() },
      { id: '6', title: 'Email not sending',        status: 'in_progress', priority: 'high',     createdAt: now() },
      { id: '7', title: 'Profile image upload',     status: 'closed',      priority: 'medium',   createdAt: now() },
      { id: '8', title: 'Search filter bug',        status: 'assigned',    priority: 'low',      createdAt: now() },
    ];
    write(KEYS.TICKETS, mockTickets);
  }
};
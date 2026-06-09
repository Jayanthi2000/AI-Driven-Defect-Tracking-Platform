// testerService.js - Core service for Tester Module
export const STORAGE_KEYS = {
  USERS:         'defectai_users',
  BUGS:          'defectai_bugs',
  ACTIVITIES:    'defectai_tester_activities',
  NOTIFICATIONS: 'defectai_tester_notifications',
  ANALYTICS:     'defectai_tester_analytics',
  REPORTS:       'defectai_tester_reports',
  CURRENT_USER:  'defectai_currentUser',
  TOKEN:         'defectai_token',
};

// ─── User Helpers ────────────────────────────────────────────────────────────
export const getCurrentUser = () => {
  try {
    const u = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  } catch { return null; }
};

export const getUsers = () => {
  try {
    const u = localStorage.getItem(STORAGE_KEYS.USERS);
    return u ? JSON.parse(u) : [];
  } catch { return []; }
};

export const updateUser = (updatedUser) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === updatedUser.id);
  if (idx !== -1) users[idx] = { ...users[idx], ...updatedUser };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  const current = getCurrentUser();
  if (current && current.id === updatedUser.id) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ ...current, ...updatedUser }));
  }
  return updatedUser;
};

export const getDevelopers = () => {
  return getUsers().filter(u => u.role === 'developer');
};

export const getAdmins = () => {
  return getUsers().filter(u => u.role === 'admin');
};

// ─── Bug Helpers ─────────────────────────────────────────────────────────────
export const getBugs = () => {
  try {
    const b = localStorage.getItem(STORAGE_KEYS.BUGS);
    return b ? JSON.parse(b) : [];
  } catch { return []; }
};

export const saveBugs = (bugs) => {
  localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs));
};

export const getBugById = (id) => getBugs().find(b => b.id === id) || null;

export const createBug = (bugData, reporterId) => {
  const bugs = getBugs();
  const newBug = {
    id: `BUG-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    ...bugData,
    reporterId,
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    activities: [],
    fixNotes: '',
    reviewNotes: '',
    retestRequested: false,
    closedAt: null,
    approvedAt: null,
  };
  bugs.unshift(newBug);
  saveBugs(bugs);
  return newBug;
};

export const updateBug = (bugId, updates) => {
  const bugs = getBugs();
  const idx = bugs.findIndex(b => b.id === bugId);
  if (idx === -1) return null;
  bugs[idx] = { ...bugs[idx], ...updates, updatedAt: new Date().toISOString() };
  saveBugs(bugs);
  return bugs[idx];
};

export const addComment = (bugId, text, userId) => {
  const bug = getBugById(bugId);
  if (!bug) return null;
  const comment = {
    id: `CMT-${Date.now()}`,
    text,
    userId,
    createdAt: new Date().toISOString(),
  };
  const updatedComments = [...(bug.comments || []), comment];
  return updateBug(bugId, { comments: updatedComments });
};

export const getBugsByReporter = (reporterId) => {
  return getBugs().filter(b => b.reporterId === reporterId);
};

export const getTesterStats = (reporterId) => {
  const bugs = getBugsByReporter(reporterId);
  return {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'OPEN').length,
    assigned: bugs.filter(b => b.status === 'ASSIGNED').length,
    inProgress: bugs.filter(b => b.status === 'IN_PROGRESS').length,
    fixed: bugs.filter(b => b.status === 'FIXED').length,
    readyForTesting: bugs.filter(b => b.status === 'READY_FOR_TESTING').length,
    testerReview: bugs.filter(b => b.status === 'TESTER_REVIEW').length,
    approved: bugs.filter(b => b.status === 'APPROVED').length,
    closed: bugs.filter(b => b.status === 'CLOSED').length,
    reopened: bugs.filter(b => b.status === 'REOPENED').length,
    rejected: bugs.filter(b => b.status === 'REJECTED').length,
  };
};
// developerService.js - Core developer data service

export const STORAGE_KEYS = {
  USERS:        'defectai_users',
  BUGS:         'bugs',
  ACTIVITIES:   'activities',
  NOTIFICATIONS:'notifications',
  ANALYTICS:    'analytics',
  REPORTS:      'reports',
  CURRENT_USER: 'defectai_currentUser',
  TOKEN:        'defectai_token',
};

export const BUG_STATUS = {
  ASSIGNED:          'ASSIGNED',
  IN_PROGRESS:       'IN_PROGRESS',
  FIXED:             'FIXED',
  READY_FOR_TESTING: 'READY_FOR_TESTING',
  COMPLETED:         'COMPLETED',
  REOPENED:          'REOPENED',
};

export const BUG_PRIORITY = {
  LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', CRITICAL: 'CRITICAL',
};

export const BUG_SEVERITY = {
  MINOR: 'MINOR', MAJOR: 'MAJOR', CRITICAL: 'CRITICAL', BLOCKER: 'BLOCKER',
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Normalize: support both "name" and "fullName" fields
    if (user && !user.name && user.fullName) {
      user.name = user.fullName;
    }
    return user;
  } catch { return null; }
};

export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch { return []; }
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getBugs = () => {
  try {
    const bugs = localStorage.getItem(STORAGE_KEYS.BUGS);
    return bugs ? JSON.parse(bugs) : [];
  } catch { return []; }
};

export const saveBugs = (bugs) => {
  localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs));
};

export const getDeveloperBugs = (developerId) => {
  const bugs = getBugs();
  return bugs.filter(
    bug => bug.assignedDeveloper === developerId ||
           bug.assignedTo        === developerId ||
           bug.assignedDeveloperId === developerId
  );
};

export const getBugById = (bugId) => {
  return getBugs().find(bug => bug.id === bugId) || null;
};

export const updateBug = (bugId, updates) => {
  const bugs = getBugs();
  const idx  = bugs.findIndex(b => b.id === bugId);
  if (idx === -1) return null;
  bugs[idx] = { ...bugs[idx], ...updates, updatedAt: new Date().toISOString() };
  saveBugs(bugs);
  return bugs[idx];
};

export const getActivities = () => {
  try {
    const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return activities ? JSON.parse(activities) : [];
  } catch { return []; }
};

export const saveActivities = (activities) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
};

export const addActivity = (activity) => {
  const activities  = getActivities();
  const newActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...activity,
  };
  activities.unshift(newActivity);
  saveActivities(activities.slice(0, 500));
  return newActivity;
};

export const getDeveloperActivities = (developerId) => {
  return getActivities().filter(a => a.userId === developerId);
};

export const getNotifications = () => {
  try {
    const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return n ? JSON.parse(n) : [];
  } catch { return []; }
};

export const saveNotifications = (notifications) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    read: false,
    ...notification,
  };
  notifications.unshift(newNotif);
  saveNotifications(notifications.slice(0, 200));
  return newNotif;
};

export const markNotificationRead = (notifId) => {
  const notifications = getNotifications();
  const idx = notifications.findIndex(n => n.id === notifId);
  if (idx !== -1) {
    notifications[idx].read = true;
    saveNotifications(notifications);
  }
};

export const markAllNotificationsRead = (userId) => {
  const notifications = getNotifications();
  saveNotifications(
    notifications.map(n => n.recipientId === userId ? { ...n, read: true } : n)
  );
};

export const getUserNotifications = (userId) => {
  return getNotifications().filter(n => n.recipientId === userId);
};

export const getAnalytics = () => {
  try {
    const a = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return a ? JSON.parse(a) : {};
  } catch { return {}; }
};

export const saveAnalytics = (analytics) => {
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
};

export const getDeveloperStats = (developerId) => {
  const bugs = getDeveloperBugs(developerId);
  return {
    assigned:        bugs.length,
    open:            bugs.filter(b => b.status === BUG_STATUS.ASSIGNED).length,
    inProgress:      bugs.filter(b => b.status === BUG_STATUS.IN_PROGRESS).length,
    fixed:           bugs.filter(b => b.status === BUG_STATUS.FIXED).length,
    readyForTesting: bugs.filter(b => b.status === BUG_STATUS.READY_FOR_TESTING).length,
    completed:       bugs.filter(b => b.status === BUG_STATUS.COMPLETED).length,
  };
};

export const initializeDemoData = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const bugs = getBugs();

  // Only seed if THIS developer has no bugs yet
  const devBugs = bugs.filter(
    b => b.assignedDeveloper === currentUser.id ||
         b.assignedTo        === currentUser.id ||
         b.assignedDeveloperId === currentUser.id
  );

  if (devBugs.length === 0) {
    const devId = currentUser.id;
    const demoBugs = [
      {
        id: `bug_${devId}_001`,
        title: 'Login button unresponsive on mobile Safari',
        description: 'The login button does not trigger form submission on iOS Safari 16+.',
        status: BUG_STATUS.ASSIGNED, priority: BUG_PRIORITY.CRITICAL, severity: BUG_SEVERITY.BLOCKER,
        module: 'Authentication', environment: 'iOS Safari 16',
        assignedDeveloper: devId, assignedTo: devId, assignedDeveloperId: devId,
        comments: [], fixNotes: '', timeline: [],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: `bug_${devId}_002`,
        title: 'Dashboard charts not rendering in Firefox',
        description: 'Recharts components fail to render properly in Firefox 118.',
        status: BUG_STATUS.IN_PROGRESS, priority: BUG_PRIORITY.HIGH, severity: BUG_SEVERITY.MAJOR,
        module: 'Dashboard', environment: 'Firefox 118',
        assignedDeveloper: devId, assignedTo: devId, assignedDeveloperId: devId,
        comments: [], fixNotes: 'Identified SVG rendering issue.', timeline: [],
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: `bug_${devId}_003`,
        title: 'User profile image upload fails silently',
        description: 'When uploading images larger than 2MB, the upload appears to succeed but the image is never saved.',
        status: BUG_STATUS.FIXED, priority: BUG_PRIORITY.MEDIUM, severity: BUG_SEVERITY.MAJOR,
        module: 'Profile', environment: 'All browsers',
        assignedDeveloper: devId, assignedTo: devId, assignedDeveloperId: devId,
        comments: [], fixNotes: 'Added file size validation.', timeline: [],
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: `bug_${devId}_004`,
        title: 'Notifications not clearing after mark all read',
        description: 'The Mark All as Read button triggers but the badge count does not update until page refresh.',
        status: BUG_STATUS.READY_FOR_TESTING, priority: BUG_PRIORITY.MEDIUM, severity: BUG_SEVERITY.MINOR,
        module: 'Notifications', environment: 'Chrome, Firefox',
        assignedDeveloper: devId, assignedTo: devId, assignedDeveloperId: devId,
        comments: [], fixNotes: 'Fixed reactive state for notification count.', timeline: [],
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: `bug_${devId}_005`,
        title: 'Reports export creates corrupted CSV',
        description: 'Exporting reports to CSV generates a file with incorrect encoding.',
        status: BUG_STATUS.ASSIGNED, priority: BUG_PRIORITY.HIGH, severity: BUG_SEVERITY.MAJOR,
        module: 'Reports', environment: 'Windows Excel',
        assignedDeveloper: devId, assignedTo: devId, assignedDeveloperId: devId,
        comments: [], fixNotes: '', timeline: [],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
      {
        id: `bug_${devId}_006`,
        title: 'Search functionality ignores special characters',
        description: 'The global search bar does not handle @, #, & correctly.',
        status: BUG_STATUS.COMPLETED, priority: BUG_PRIORITY.LOW, severity: BUG_SEVERITY.MINOR,
        module: 'Search', environment: 'All browsers',
        assignedDeveloper: devId, assignedTo: devId, assignedDeveloperId: devId,
        comments: [], fixNotes: 'Added proper URL encoding.', timeline: [],
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ];
    saveBugs([...bugs, ...demoBugs]);
  }
};

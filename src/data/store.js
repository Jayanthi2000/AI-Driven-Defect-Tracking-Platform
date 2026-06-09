const defaultData = {
  bugs: [
    { id: 'BUG-001', title: 'Authentication token expires prematurely', severity: 'critical', status: 'open', assignee: 'Arjun Mehta', priority: 'P0', created: '2024-01-15', updated: '2024-01-20', tags: ['auth', 'backend'], description: 'JWT tokens are expiring after 15 minutes instead of the configured 24 hours.' },
    { id: 'BUG-002', title: 'Dashboard charts flicker on resize', severity: 'medium', status: 'in-progress', assignee: 'Priya Sharma', priority: 'P2', created: '2024-01-16', updated: '2024-01-21', tags: ['ui', 'charts'], description: 'Recharts components flicker when browser window is resized.' },
    { id: 'BUG-003', title: 'Export PDF generates blank pages', severity: 'high', status: 'open', assignee: 'Dev Kumar', priority: 'P1', created: '2024-01-17', updated: '2024-01-22', tags: ['export', 'pdf'], description: 'PDF export inserts blank pages between sections.' },
    { id: 'BUG-004', title: 'Notification bell count resets on refresh', severity: 'low', status: 'resolved', assignee: 'Ananya Roy', priority: 'P3', created: '2024-01-18', updated: '2024-01-23', tags: ['notifications'], description: 'Unread notification count resets to 0 when page is refreshed.' },
    { id: 'BUG-005', title: 'Search results do not highlight keywords', severity: 'low', status: 'open', assignee: null, priority: 'P3', created: '2024-01-19', updated: '2024-01-24', tags: ['search', 'ui'], description: 'Global search returns results but does not highlight matching keywords.' },
    { id: 'BUG-006', title: 'Memory leak in WebSocket connection handler', severity: 'critical', status: 'in-progress', assignee: 'Arjun Mehta', priority: 'P0', created: '2024-01-20', updated: '2024-01-25', tags: ['websocket', 'performance'], description: 'WebSocket connections are not being properly closed, causing memory leak.' },
    { id: 'BUG-007', title: 'Mobile sidebar overlaps content on iOS', severity: 'medium', status: 'open', assignee: 'Priya Sharma', priority: 'P2', created: '2024-01-21', updated: '2024-01-26', tags: ['mobile', 'ui', 'ios'], description: 'On iOS Safari the sidebar drawer overlaps page content when open.' },
    { id: 'BUG-008', title: 'CSV import fails on special characters', severity: 'high', status: 'resolved', assignee: 'Dev Kumar', priority: 'P1', created: '2024-01-22', updated: '2024-01-27', tags: ['import', 'csv'], description: 'CSV files containing special characters (ñ, ü, ç) fail to import.' },
  ],
  kanban: {
    backlog: [
      { id: 'k1', title: 'Redesign onboarding flow', label: 'design', priority: 'medium', assignee: 'PS', due: '2024-02-10', tags: ['ux', 'design'] },
      { id: 'k2', title: 'Implement SSO with Okta', label: 'feature', priority: 'high', assignee: 'AM', due: '2024-02-15', tags: ['auth', 'enterprise'] },
    ],
    todo: [
      { id: 'k3', title: 'Add dark mode support for emails', label: 'feature', priority: 'low', assignee: 'AR', due: '2024-02-08', tags: ['email'] },
      { id: 'k4', title: 'Performance audit on analytics page', label: 'perf', priority: 'high', assignee: 'DK', due: '2024-02-12', tags: ['performance'] },
    ],
    progress: [
      { id: 'k5', title: 'Build AI insights dashboard widget', label: 'feature', priority: 'high', assignee: 'AM', due: '2024-02-05', tags: ['ai', 'dashboard'] },
      { id: 'k6', title: 'Migrate to React Query v5', label: 'infra', priority: 'medium', assignee: 'DK', due: '2024-02-18', tags: ['infra'] },
    ],
    testing: [
      { id: 'k7', title: 'Notification preference system', label: 'feature', priority: 'medium', assignee: 'PS', due: '2024-01-30', tags: ['notifications'] },
    ],
    done: [
      { id: 'k8', title: 'Upgrade Recharts to v2.9', label: 'infra', priority: 'low', assignee: 'AR', due: '2024-01-25', tags: ['charts'] },
      { id: 'k9', title: 'Fix CORS policy on staging', label: 'bug', priority: 'critical', assignee: 'AM', due: '2024-01-22', tags: ['backend'] },
    ],
  },
  team: [
    { id: 1, name: 'Arjun Mehta', role: 'Lead Engineer', avatar: 'AM', email: 'arjun@corp.io', status: 'online', bugsResolved: 34, tasksCompleted: 67, productivity: 94, joined: '2022-03-15', skills: ['React', 'Node.js', 'Go', 'K8s'] },
    { id: 2, name: 'Priya Sharma', role: 'UI/UX Engineer', avatar: 'PS', email: 'priya@corp.io', status: 'online', bugsResolved: 28, tasksCompleted: 54, productivity: 88, joined: '2022-07-20', skills: ['React', 'Figma', 'CSS', 'Motion'] },
    { id: 3, name: 'Dev Kumar', role: 'Backend Engineer', avatar: 'DK', email: 'dev@corp.io', status: 'away', bugsResolved: 41, tasksCompleted: 78, productivity: 91, joined: '2021-11-10', skills: ['Python', 'PostgreSQL', 'Redis', 'AWS'] },
    { id: 4, name: 'Ananya Roy', role: 'QA Engineer', avatar: 'AR', email: 'ananya@corp.io', status: 'offline', bugsResolved: 52, tasksCompleted: 45, productivity: 85, joined: '2023-01-05', skills: ['Cypress', 'Jest', 'Selenium', 'k6'] },
    { id: 5, name: 'Ravi Nair', role: 'DevOps Engineer', avatar: 'RN', email: 'ravi@corp.io', status: 'online', bugsResolved: 19, tasksCompleted: 89, productivity: 96, joined: '2022-05-22', skills: ['Terraform', 'K8s', 'CI/CD', 'AWS'] },
  ],
  notifications: [
    { id: 1, type: 'bug', message: 'BUG-006 escalated to critical', time: '2 min ago', read: false },
    { id: 2, type: 'team', message: 'Ravi Nair joined the workspace', time: '1h ago', read: false },
    { id: 3, type: 'ai', message: 'AI detected anomaly in error rate', time: '3h ago', read: false },
    { id: 4, type: 'system', message: 'Deployment to staging completed', time: '5h ago', read: true },
    { id: 5, type: 'bug', message: 'BUG-003 assigned to Dev Kumar', time: '1d ago', read: true },
  ],
  settings: {
    theme: 'dark',
    notifications: { email: true, push: true, slack: false, digest: 'daily' },
    workspace: { name: 'Nexus Corp', timezone: 'Asia/Kolkata', language: 'en' },
    sidebar: { collapsed: false, showLabels: true },
    appearance: { density: 'comfortable', accentColor: '#3b82f6' },
  },
  profile: {
    name: 'Rahul Singh',
    role: 'Admin',
    email: 'rahul@corp.io',
    avatar: 'RS',
    bio: 'Building the future of enterprise tooling.',
    location: 'Bangalore, India',
    timezone: 'IST (UTC+5:30)',
  },
};

export const getStore = (key) => {
  try {
    const stored = localStorage.getItem(`saas_${key}`);
    return stored ? JSON.parse(stored) : defaultData[key];
  } catch { return defaultData[key]; }
};

export const setStore = (key, value) => {
  try { localStorage.setItem(`saas_${key}`, JSON.stringify(value)); } catch {}
};

export const getDefault = (key) => defaultData[key];

export const analyticsData = {
  bugTrend: [
    { month: 'Aug', opened: 18, resolved: 12, critical: 3 },
    { month: 'Sep', opened: 24, resolved: 19, critical: 5 },
    { month: 'Oct', opened: 31, resolved: 28, critical: 4 },
    { month: 'Nov', opened: 22, resolved: 25, critical: 2 },
    { month: 'Dec', opened: 15, resolved: 20, critical: 1 },
    { month: 'Jan', opened: 28, resolved: 22, critical: 6 },
  ],
  sprintVelocity: [
    { sprint: 'S12', planned: 40, completed: 36, bugs: 5 },
    { sprint: 'S13', planned: 45, completed: 42, bugs: 3 },
    { sprint: 'S14', planned: 38, completed: 38, bugs: 8 },
    { sprint: 'S15', planned: 50, completed: 44, bugs: 4 },
    { sprint: 'S16', planned: 42, completed: 40, bugs: 2 },
    { sprint: 'S17', planned: 48, completed: 46, bugs: 3 },
  ],
  performance: [
    { name: 'Arjun', score: 94 }, { name: 'Dev', score: 91 }, { name: 'Priya', score: 88 },
    { name: 'Ravi', score: 96 }, { name: 'Ananya', score: 85 },
  ],
  severityDist: [
    { name: 'Critical', value: 12, color: '#ef4444' },
    { name: 'High', value: 28, color: '#f59e0b' },
    { name: 'Medium', value: 35, color: '#3b82f6' },
    { name: 'Low', value: 25, color: '#10b981' },
  ],
  dailyActivity: [
    { day: 'Mon', commits: 24, reviews: 8, deploys: 2 },
    { day: 'Tue', commits: 31, reviews: 12, deploys: 3 },
    { day: 'Wed', commits: 19, reviews: 6, deploys: 1 },
    { day: 'Thu', commits: 42, reviews: 18, deploys: 4 },
    { day: 'Fri', commits: 38, reviews: 14, deploys: 5 },
    { day: 'Sat', commits: 12, reviews: 3, deploys: 1 },
    { day: 'Sun', commits: 8, reviews: 2, deploys: 0 },
  ],
};
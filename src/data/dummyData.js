export const stats = [
  {
    title: 'Total Bugs',
    value: 148,
    color: 'text-violet-400',
  },
  {
    title: 'Open Bugs',
    value: 32,
    color: 'text-orange-400',
  },
  {
    title: 'Critical Bugs',
    value: 8,
    color: 'text-red-400',
  },
  {
    title: 'Resolved Bugs',
    value: 108,
    color: 'text-emerald-400',
  },
];

export const bugTrendData = [
  { name: 'Mon', bugs: 12 },
  { name: 'Tue', bugs: 19 },
  { name: 'Wed', bugs: 9 },
  { name: 'Thu', bugs: 14 },
  { name: 'Fri', bugs: 7 },
];

export const severityData = [
  { name: 'Low', value: 25 },
  { name: 'Medium', value: 35 },
  { name: 'High', value: 20 },
  { name: 'Critical', value: 10 },
];

export const velocityData = [
  { name: 'Week 1', resolved: 24 },
  { name: 'Week 2', resolved: 31 },
  { name: 'Week 3', resolved: 18 },
  { name: 'Week 4', resolved: 39 },
];

export const moduleData = [
  { name: 'Auth', bugs: 14 },
  { name: 'Dashboard', bugs: 8 },
  { name: 'Payments', bugs: 21 },
  { name: 'Notifications', bugs: 6 },
];

export const recentBugs = [
  {
    id: 'BUG-101',
    title: 'JWT token expired during refresh',
    severity: 'Critical',
    status: 'Open',
  },
  {
    id: 'BUG-102',
    title: 'Dashboard chart rendering issue',
    severity: 'Medium',
    status: 'In Progress',
  },
  {
    id: 'BUG-103',
    title: 'Payment gateway timeout issue',
    severity: 'High',
    status: 'Testing',
  },
];
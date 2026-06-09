// analyticsService.js
import { getBugs } from './testerService';
import { STORAGE_KEYS } from './testerService';

export const getAnalytics = () => {
  try {
    const a = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return a ? JSON.parse(a) : {};
  } catch { return {}; }
};

export const computeTesterAnalytics = (reporterId) => {
  const bugs = getBugs().filter(b => b.reporterId === reporterId);

  const severityDist = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const priorityDist = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const statusDist = {};

  bugs.forEach(bug => {
    if (bug.severity && severityDist[bug.severity] !== undefined) severityDist[bug.severity]++;
    if (bug.priority && priorityDist[bug.priority] !== undefined) priorityDist[bug.priority]++;
    statusDist[bug.status] = (statusDist[bug.status] || 0) + 1;
  });

  // Monthly trends (last 6 months)
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    const monthKey = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const count = bugs.filter(b => b.createdAt && b.createdAt.startsWith(monthKey)).length;
    monthlyTrends.push({ month, count, year });
  }

  // Weekly trends (last 7 days)
  const weeklyTrends = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toLocaleString('default', { weekday: 'short' });
    const dateStr = d.toISOString().split('T')[0];
    const count = bugs.filter(b => b.createdAt && b.createdAt.startsWith(dateStr)).length;
    weeklyTrends.push({ day, count, date: dateStr });
  }

  const closed = bugs.filter(b => b.status === 'CLOSED').length;
  const approved = bugs.filter(b => b.status === 'APPROVED' || b.status === 'CLOSED').length;
  const rejected = bugs.filter(b => b.status === 'REJECTED' || b.status === 'REOPENED').length;
  const total = bugs.length;

  return {
    severityDist,
    priorityDist,
    statusDist,
    monthlyTrends,
    weeklyTrends,
    closureRate: total ? Math.round((closed / total) * 100) : 0,
    approvalRate: total ? Math.round((approved / total) * 100) : 0,
    rejectionRate: total ? Math.round((rejected / total) * 100) : 0,
    reopenRate: total ? Math.round((bugs.filter(b => b.status === 'REOPENED').length / total) * 100) : 0,
    totalBugs: total,
  };
};

export const computeGlobalAnalytics = () => {
  const bugs = getBugs();
  const severityDist = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  bugs.forEach(bug => {
    if (bug.severity && severityDist[bug.severity] !== undefined) severityDist[bug.severity]++;
  });
  return { severityDist, total: bugs.length };
};
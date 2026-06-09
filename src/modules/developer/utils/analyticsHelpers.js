// analyticsHelpers.js
import { BUG_STATUS } from '../constants/statuses';

export const computeWeeklyData = (bugs) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const dayBugs = bugs.filter(b => new Date(b.updatedAt).toDateString() === date.toDateString());
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fixed:  dayBugs.filter(b => b.status === BUG_STATUS.FIXED || b.status === BUG_STATUS.COMPLETED).length,
      active: dayBugs.filter(b => b.status === BUG_STATUS.IN_PROGRESS).length,
    };
  });
};

export const computeMonthlyData = (bugs) => {
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const monthBugs = bugs.filter(b => new Date(b.createdAt).getMonth() === date.getMonth());
    return {
      month,
      bugs:  monthBugs.length,
      fixed: monthBugs.filter(b => b.status === BUG_STATUS.COMPLETED).length,
    };
  });
};

export const computePriorityData = (bugs) => {
  return Object.entries(
    bugs.reduce((acc, bug) => { acc[bug.priority] = (acc[bug.priority] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));
};

export const computeStatusData = (bugs, statusColors) => {
  return Object.entries(
    bugs.reduce((acc, bug) => { acc[bug.status] = (acc[bug.status] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value, fill: statusColors[name] || '#6b7280' }));
};

export const computeProductivityScore = (stats) => {
  if (!stats.assigned) return 0;
  return Math.round(((stats.fixed + stats.completed) / stats.assigned) * 100);
};

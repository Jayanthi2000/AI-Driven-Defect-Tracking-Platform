// activityService.js
import { STORAGE_KEYS } from './testerService';

export const getActivities = () => {
  try {
    const a = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return a ? JSON.parse(a) : [];
  } catch { return []; }
};

export const saveActivities = (activities) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
};

export const createActivity = ({ type, bugId, bugTitle, userId, userName, targetId, targetName, details }) => {
  const activities = getActivities();
  const newActivity = {
    id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    bugId,
    bugTitle,
    userId,
    userName,
    targetId,
    targetName,
    details,
    createdAt: new Date().toISOString(),
  };
  activities.unshift(newActivity);
  // Keep last 500 activities
  if (activities.length > 500) activities.splice(500);
  saveActivities(activities);
  return newActivity;
};

export const getActivitiesByUser = (userId) => {
  return getActivities().filter(a => a.userId === userId);
};

export const getActivitiesByBug = (bugId) => {
  return getActivities().filter(a => a.bugId === bugId);
};

export const ACTIVITY_TYPES = {
  BUG_REPORTED: 'BUG_REPORTED',
  BUG_ASSIGNED: 'BUG_ASSIGNED',
  BUG_REOPENED: 'BUG_REOPENED',
  BUG_CLOSED: 'BUG_CLOSED',
  BUG_APPROVED: 'BUG_APPROVED',
  BUG_REJECTED: 'BUG_REJECTED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  RETEST_COMPLETED: 'RETEST_COMPLETED',
  REVIEW_ADDED: 'REVIEW_ADDED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  FIX_NOTED: 'FIX_NOTED',
};

export const ACTIVITY_LABELS = {
  BUG_REPORTED: 'Reported bug',
  BUG_ASSIGNED: 'Bug assigned',
  BUG_REOPENED: 'Reopened bug',
  BUG_CLOSED: 'Closed bug',
  BUG_APPROVED: 'Approved fix',
  BUG_REJECTED: 'Rejected fix',
  COMMENT_ADDED: 'Added comment',
  RETEST_COMPLETED: 'Completed retest',
  REVIEW_ADDED: 'Added review',
  STATUS_CHANGED: 'Status changed',
  FIX_NOTED: 'Fix noted',
};
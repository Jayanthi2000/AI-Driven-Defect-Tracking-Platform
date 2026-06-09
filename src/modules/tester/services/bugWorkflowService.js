// bugWorkflowService.js - handles all status transitions + cross-module sync
import { updateBug, getBugById, createBug, getAdmins, getDevelopers } from './testerService';
import { createActivity, ACTIVITY_TYPES } from './activityService';
import { createNotification, NOTIF_TYPES } from './notificationService';

export const BUG_STATUS = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  FIXED: 'FIXED',
  READY_FOR_TESTING: 'READY_FOR_TESTING',
  TESTER_REVIEW: 'TESTER_REVIEW',
  APPROVED: 'APPROVED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
  REOPENED: 'REOPENED',
};

export const STATUS_COLORS = {
  OPEN: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  ASSIGNED: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  IN_PROGRESS: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  FIXED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  READY_FOR_TESTING: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  TESTER_REVIEW: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  APPROVED: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  CLOSED: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  REJECTED: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  REOPENED: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
};

export const SEVERITY_COLORS = {
  CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-400' },
  MEDIUM: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  LOW: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
};

export const PRIORITY_COLORS = {
  URGENT: { bg: 'bg-red-500/20', text: 'text-red-400' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  MEDIUM: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  LOW: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

// Tester retests a bug (moves to TESTER_REVIEW)
export const retestBug = (bugId, tester, reviewNotes = '') => {
  const bug = getBugById(bugId);
  if (!bug) return null;
  const updated = updateBug(bugId, {
    status: BUG_STATUS.TESTER_REVIEW,
    retestRequested: false,
    reviewNotes,
    retestAt: new Date().toISOString(),
  });
  createActivity({
    type: ACTIVITY_TYPES.RETEST_COMPLETED,
    bugId,
    bugTitle: bug.title,
    userId: tester.id,
    userName: tester.name,
    details: `Retest completed. ${reviewNotes ? 'Notes: ' + reviewNotes : ''}`,
  });
  // Notify assigned developer
  if (bug.assignedDeveloperId) {
    createNotification({
      type: NOTIF_TYPES.REVIEW_COMPLETED,
      title: 'Retest Completed',
      message: `${tester.name} completed retest for "${bug.title}"`,
      targetUserId: bug.assignedDeveloperId,
      bugId,
      fromUserId: tester.id,
    });
  }
  // Notify admins
  getAdmins().forEach(admin => {
    createNotification({
      type: NOTIF_TYPES.REVIEW_COMPLETED,
      title: 'Retest Completed',
      message: `${tester.name} completed retest for "${bug.title}"`,
      targetUserId: admin.id,
      bugId,
      fromUserId: tester.id,
    });
  });
  return updated;
};

// Tester approves a fix
export const approveFix = (bugId, tester, reviewNotes = '') => {
  const bug = getBugById(bugId);
  if (!bug) return null;
  const updated = updateBug(bugId, {
    status: BUG_STATUS.APPROVED,
    reviewNotes,
    approvedAt: new Date().toISOString(),
    approvedBy: tester.id,
  });
  createActivity({
    type: ACTIVITY_TYPES.BUG_APPROVED,
    bugId,
    bugTitle: bug.title,
    userId: tester.id,
    userName: tester.name,
    details: `Fix approved. ${reviewNotes}`,
  });
  if (bug.assignedDeveloperId) {
    createNotification({
      type: NOTIF_TYPES.BUG_APPROVED,
      title: 'Fix Approved ✓',
      message: `${tester.name} approved your fix for "${bug.title}"`,
      targetUserId: bug.assignedDeveloperId,
      bugId,
      fromUserId: tester.id,
    });
  }
  getAdmins().forEach(admin => {
    createNotification({
      type: NOTIF_TYPES.BUG_APPROVED,
      title: 'Fix Approved',
      message: `${tester.name} approved fix for "${bug.title}"`,
      targetUserId: admin.id,
      bugId,
      fromUserId: tester.id,
    });
  });
  return updated;
};

// Tester rejects a fix
export const rejectFix = (bugId, tester, reviewNotes = '') => {
  const bug = getBugById(bugId);
  if (!bug) return null;
  const updated = updateBug(bugId, {
    status: BUG_STATUS.REJECTED,
    reviewNotes,
    rejectedAt: new Date().toISOString(),
    rejectedBy: tester.id,
  });
  createActivity({
    type: ACTIVITY_TYPES.BUG_REJECTED,
    bugId,
    bugTitle: bug.title,
    userId: tester.id,
    userName: tester.name,
    details: `Fix rejected. Reason: ${reviewNotes}`,
  });
  if (bug.assignedDeveloperId) {
    createNotification({
      type: NOTIF_TYPES.BUG_REJECTED,
      title: 'Fix Rejected',
      message: `${tester.name} rejected your fix for "${bug.title}". Reason: ${reviewNotes}`,
      targetUserId: bug.assignedDeveloperId,
      bugId,
      fromUserId: tester.id,
    });
  }
  getAdmins().forEach(admin => {
    createNotification({
      type: NOTIF_TYPES.BUG_REJECTED,
      title: 'Fix Rejected',
      message: `${tester.name} rejected fix for "${bug.title}"`,
      targetUserId: admin.id,
      bugId,
      fromUserId: tester.id,
    });
  });
  return updated;
};

// Tester closes a bug
export const closeBug = (bugId, tester) => {
  const bug = getBugById(bugId);
  if (!bug) return null;
  const updated = updateBug(bugId, {
    status: BUG_STATUS.CLOSED,
    closedAt: new Date().toISOString(),
    closedBy: tester.id,
  });
  createActivity({
    type: ACTIVITY_TYPES.BUG_CLOSED,
    bugId,
    bugTitle: bug.title,
    userId: tester.id,
    userName: tester.name,
    details: 'Bug closed.',
  });
  getAdmins().forEach(admin => {
    createNotification({
      type: NOTIF_TYPES.BUG_CLOSED,
      title: 'Bug Closed',
      message: `${tester.name} closed "${bug.title}"`,
      targetUserId: admin.id,
      bugId,
      fromUserId: tester.id,
    });
  });
  return updated;
};

// Tester reopens a bug
export const reopenBug = (bugId, tester, reason = '') => {
  const bug = getBugById(bugId);
  if (!bug) return null;
  const updated = updateBug(bugId, {
    status: BUG_STATUS.REOPENED,
    reopenedAt: new Date().toISOString(),
    reopenedBy: tester.id,
    reopenReason: reason,
  });
  createActivity({
    type: ACTIVITY_TYPES.BUG_REOPENED,
    bugId,
    bugTitle: bug.title,
    userId: tester.id,
    userName: tester.name,
    details: `Bug reopened. ${reason ? 'Reason: ' + reason : ''}`,
  });
  if (bug.assignedDeveloperId) {
    createNotification({
      type: NOTIF_TYPES.BUG_REOPENED,
      title: 'Bug Reopened',
      message: `${tester.name} reopened "${bug.title}". ${reason}`,
      targetUserId: bug.assignedDeveloperId,
      bugId,
      fromUserId: tester.id,
    });
  }
  getAdmins().forEach(admin => {
    createNotification({
      type: NOTIF_TYPES.BUG_REOPENED,
      title: 'Bug Reopened',
      message: `${tester.name} reopened "${bug.title}"`,
      targetUserId: admin.id,
      bugId,
      fromUserId: tester.id,
    });
  });
  return updated;
};

// Report a new bug
export const reportBug = (bugData, tester) => {
  const newBug = createBug(bugData, tester.id);
  createActivity({
    type: ACTIVITY_TYPES.BUG_REPORTED,
    bugId: newBug.id,
    bugTitle: newBug.title,
    userId: tester.id,
    userName: tester.name,
    details: `Bug reported with ${newBug.severity} severity`,
  });
  getAdmins().forEach(admin => {
    createNotification({
      type: NOTIF_TYPES.BUG_REPORTED,
      title: 'New Bug Reported',
      message: `${tester.name} reported "${newBug.title}" (${newBug.severity})`,
      targetUserId: admin.id,
      bugId: newBug.id,
      fromUserId: tester.id,
    });
  });
  if (bugData.assignedDeveloperId) {
    createNotification({
      type: NOTIF_TYPES.BUG_ASSIGNED,
      title: 'Bug Assigned to You',
      message: `${tester.name} assigned "${newBug.title}" to you`,
      targetUserId: bugData.assignedDeveloperId,
      bugId: newBug.id,
      fromUserId: tester.id,
    });
    createActivity({
      type: ACTIVITY_TYPES.BUG_ASSIGNED,
      bugId: newBug.id,
      bugTitle: newBug.title,
      userId: tester.id,
      userName: tester.name,
      targetId: bugData.assignedDeveloperId,
      details: 'Bug assigned to developer',
    });
    updateBug(newBug.id, { status: 'ASSIGNED' });
  }
  return newBug;
};
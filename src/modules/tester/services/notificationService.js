// notificationService.js
import { STORAGE_KEYS } from './testerService';

export const getNotifications = () => {
  try {
    const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return n ? JSON.parse(n) : [];
  } catch { return []; }
};

export const saveNotifications = (notifications) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const createNotification = ({ type, title, message, targetUserId, bugId, fromUserId }) => {
  const notifications = getNotifications();
  const newNotif = {
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    title,
    message,
    targetUserId,
    bugId,
    fromUserId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotif);
  if (notifications.length > 200) notifications.splice(200);
  saveNotifications(notifications);
  return newNotif;
};

export const getNotificationsByUser = (userId) => {
  return getNotifications().filter(n => n.targetUserId === userId);
};

export const getUnreadCount = (userId) => {
  return getNotificationsByUser(userId).filter(n => !n.read).length;
};

export const markAsRead = (notifId) => {
  const notifications = getNotifications();
  const idx = notifications.findIndex(n => n.id === notifId);
  if (idx !== -1) {
    notifications[idx].read = true;
    saveNotifications(notifications);
  }
};

export const markAllAsRead = (userId) => {
  const notifications = getNotifications();
  notifications.forEach(n => {
    if (n.targetUserId === userId) n.read = true;
  });
  saveNotifications(notifications);
};

export const NOTIF_TYPES = {
  BUG_REPORTED: 'BUG_REPORTED',
  BUG_ASSIGNED: 'BUG_ASSIGNED',
  BUG_APPROVED: 'BUG_APPROVED',
  BUG_REJECTED: 'BUG_REJECTED',
  BUG_REOPENED: 'BUG_REOPENED',
  BUG_CLOSED: 'BUG_CLOSED',
  RETEST_REQUESTED: 'RETEST_REQUESTED',
  REVIEW_COMPLETED: 'REVIEW_COMPLETED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  STATUS_CHANGED: 'STATUS_CHANGED',
};
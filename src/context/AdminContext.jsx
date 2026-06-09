import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
  seedDemoData,
} from "../services/adminStorage";

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      "useAdmin must be used within AdminProvider"
    );
  }

  return context;
};

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] =
    useState([]);
  const [unreadCount, setUnreadCount] =
    useState(0);

  const refreshUsers = () => {
    setUsers(getUsers() || []);
  };

  const refreshNotifications = () => {
    setNotifications(getNotifications() || []);
    setUnreadCount(getUnreadCount() || 0);
  };

  useEffect(() => {
    seedDemoData();
    refreshUsers();
    refreshNotifications();
  }, []);

  const handleCreateUser = (data) => {
    const result = createUser(data);
    refreshUsers();
    return result;
  };

  const handleUpdateUser = (id, data) => {
    updateUser(id, data);
    refreshUsers();
  };

  const handleDeleteUser = (id) => {
    deleteUser(id);
    refreshUsers();
  };

  const handleToggleUserStatus = (id) => {
    toggleUserStatus(id);
    refreshUsers();
  };

  const handleMarkNotificationRead = (id) => {
    markNotificationRead(id);
    refreshNotifications();
  };

  const handleMarkAllNotificationsRead = () => {
    markAllNotificationsRead();
    refreshNotifications();
  };

  const handleDeleteNotification = (id) => {
    deleteNotification(id);
    refreshNotifications();
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
    refreshNotifications();
  };

  const value = {
    users,

    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    toggleUserStatus: handleToggleUserStatus,

    notifications,
    unreadCount,

    markNotificationRead:
      handleMarkNotificationRead,

    markAllNotificationsRead:
      handleMarkAllNotificationsRead,

    deleteNotification:
      handleDeleteNotification,

    clearAllNotifications:
      handleClearAllNotifications,

    refreshUsers,
    refreshNotifications,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
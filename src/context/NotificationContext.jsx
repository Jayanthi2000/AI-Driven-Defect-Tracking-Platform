import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const addNotification = ({
    title,
    message,
    role = "all",
    type = "info",
  }) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      role,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
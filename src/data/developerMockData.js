
export const kanbanData = [
  {
    id: "todo",
    title: "Todo",
    items: [
      {
        id: 1,
        title: "Fix websocket reconnect issue",
        priority: "High Priority",
        description: "Socket session timeout issue after deployment.",
      },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    items: [
      {
        id: 2,
        title: "AI duplicate clustering bug",
        priority: "Critical",
        description: "Duplicate grouping not matching embeddings.",
      },
    ],
  },
  {
    id: "done",
    title: "Completed",
    items: [
      {
        id: 3,
        title: "Notification panel alignment",
        priority: "Medium",
        description: "Fixed sidebar layout overflow issue.",
      },
    ],
  },
];

export const aiFixes = [
  {
    id: 1,
    title: "Suggested Cache Strategy",
    description: "Use optimistic UI updates to reduce websocket retries.",
  },
  {
    id: 2,
    title: "Predicted Root Cause",
    description: "Race condition detected during token refresh cycle.",
  },
];

export const developerActivity = [
  {
    id: 1,
    title: "Merged websocket stability patch",
    time: "5 mins ago",
  },
  {
    id: 2,
    title: "Reviewed AI duplicate issue",
    time: "11 mins ago",
  },
];

export const conversations = [
  {
    id: 1,
    name: "Rahul",
    status: "Online",
    messages: [
      {
        sender: "Rahul",
        text: "Can you review the auth patch?",
        time: "10:20 AM",
      },
    ],
  },
  {
    id: 2,
    name: "QA Team",
    status: "Offline",
    messages: [
      {
        sender: "QA Team",
        text: "Regression test completed.",
        time: "Yesterday",
      },
    ],
  },
];

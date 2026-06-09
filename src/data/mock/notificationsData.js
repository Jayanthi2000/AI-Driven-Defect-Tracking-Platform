/* =========================================
   MOCK NOTIFICATIONS DATA
========================================= */

export const notifications = [
  {
    id: 1,
    type: "assignment",
    title: "Bug Assigned",
    message:
      "Critical payment gateway issue assigned to Developer Team Alpha.",

    time: "2 mins ago",

    read: false,

    priority: "high",
  },

  {
    id: 2,
    type: "success",
    title: "Bug Fixed",
    message:
      "Authentication session timeout issue has been resolved successfully.",

    time: "12 mins ago",

    read: false,

    priority: "medium",
  },

  {
    id: 3,
    type: "warning",
    title: "Server Warning",
    message:
      "High API latency detected in production environment.",

    time: "25 mins ago",

    read: true,

    priority: "high",
  },

  {
    id: 4,
    type: "ai",
    title: "AI Insight Generated",
    message:
      "AI engine detected recurring UI crashes linked to state updates.",

    time: "40 mins ago",

    read: true,

    priority: "medium",
  },

  {
    id: 5,
    type: "security",
    title: "Security Alert",
    message:
      "Multiple failed admin login attempts detected.",

    time: "1 hour ago",

    read: false,

    priority: "critical",
  },

  {
    id: 6,
    type: "deployment",
    title: "Deployment Successful",
    message:
      "Version v2.4.0 deployed successfully to staging environment.",

    time: "2 hours ago",

    read: true,

    priority: "low",
  },

  {
    id: 7,
    type: "comment",
    title: "New Developer Comment",
    message:
      "Developer added additional logs and debugging notes to BUG-1024.",

    time: "3 hours ago",

    read: false,

    priority: "low",
  },

  {
    id: 8,
    type: "verification",
    title: "Verification Needed",
    message:
      "Resolved bugs pending QA verification before release.",

    time: "5 hours ago",

    read: true,

    priority: "medium",
  },

  {
    id: 9,
    type: "system",
    title: "System Maintenance",
    message:
      "Scheduled maintenance planned for Saturday at 11:00 PM.",

    time: "Yesterday",

    read: true,

    priority: "low",
  },

  {
    id: 10,
    type: "performance",
    title: "Performance Drop",
    message:
      "Frontend rendering performance dropped by 18% after latest update.",

    time: "Yesterday",

    read: false,

    priority: "high",
  },
];

export default notifications;
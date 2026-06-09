import {
  LayoutDashboard,
  Bug,
  BarChart3,
  Bell,
  Users,
  User,
  Settings,
  Brain,
  Workflow,
  FileText,
  MessageSquare,
} from "lucide-react";

/* =========================================================
   ADMIN
========================================================= */

export const ADMIN_LINKS = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    path: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },

  {
    path: "/admin/users",
    label: "Users",
    icon: Users,
  },

  {
    path: "/admin/bugs",
    label: "Bug Monitoring",
    icon: Bug,
  },

  {
    path: "/admin/activity",
    label: "Activity",
    icon: Workflow,
  },

  {
    path: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
  },

  {
    path: "/admin/insights",
    label: "Insights",
    icon: Brain,
  },

  {
    path: "/admin/profile",
    label: "Profile",
    icon: User,
  },

  {
    path: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

/* =========================================================
   DEVELOPER
========================================================= */

export const DEVELOPER_LINKS =
  [
    {
      path: "/developer/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/developer/bugs",
      label: "Assigned Bugs",
      icon: Bug,
    },

    {
      path: "/developer/kanban",
      label: "Kanban",
      icon: Workflow,
    },

    {
      path: "/developer/activity",
      label: "Activity",
      icon: FileText,
    },

    {
      path: "/developer/chat",
      label: "Team Chat",
      icon: MessageSquare,
    },

    {
      path: "/developer/notifications",
      label: "Notifications",
      icon: Bell,
    },

    {
      path: "/developer/profile",
      label: "Profile",
      icon: User,
    },

    {
      path: "/developer/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

/* =========================================================
   TESTER
========================================================= */

export const TESTER_LINKS = [
  {
    path: "/tester/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    path: "/tester/report-bug",
    label: "Report Bug",
    icon: Bug,
  },

  {
    path: "/tester/history",
    label: "Bug History",
    icon: FileText,
  },

  {
    path: "/tester/verify",
    label: "Verify Bugs",
    icon: Workflow,
  },

  {
    path: "/tester/reopen",
    label: "Reopen Bugs",
    icon: Bug,
  },

  {
    path: "/tester/chat",
    label: "Chat",
    icon: MessageSquare,
  },

  {
    path: "/tester/notifications",
    label: "Notifications",
    icon: Bell,
  },

  {
    path: "/tester/profile",
    label: "Profile",
    icon: User,
  },

  {
    path: "/tester/settings",
    label: "Settings",
    icon: Settings,
  },
];

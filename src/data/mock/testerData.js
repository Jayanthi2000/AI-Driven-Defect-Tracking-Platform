import {
  chatUsers,
  messages,
} from "./mock/testerData.js";

export const dashboardStats = [
  {
    id: 1,
    title: "Reported Bugs",
    value: "128",
    change: "+12%",
    trend: "up",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: 2,
    title: "Critical Issues",
    value: "18",
    change: "+4%",
    trend: "up",
    color: "from-red-500 to-pink-600",
  },
  {
    id: 3,
    title: "Pending Verification",
    value: "24",
    change: "-8%",
    trend: "down",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 4,
    title: "Resolved Bugs",
    value: "76",
    change: "+18%",
    trend: "up",
    color: "from-emerald-500 to-green-600",
  },
];

export const recentActivities = [
  {
    id: 1,
    action: "Bug #BUG-2091 marked as fixed",
    time: "5 min ago",
  },
  {
    id: 2,
    action: "Developer commented on #BUG-2032",
    time: "15 min ago",
  },
  {
    id: 3,
    action: "New QA task assigned",
    time: "1 hour ago",
  },
];

export const bugs = [
  {
    id: "#BUG-1024",
    title: "Payment gateway crash",
    severity: "Critical",
    priority: "P1",
    status: "Pending",
    assignedTo: "Rahul",
    createdAt: "2026-05-21",
  },
  {
    id: "#BUG-1025",
    title: "Theme flickering issue",
    severity: "Medium",
    priority: "P2",
    status: "Resolved",
    assignedTo: "Kavin",
    createdAt: "2026-05-20",
  },
  {
    id: "#BUG-1026",
    title: "Login timeout problem",
    severity: "High",
    priority: "P1",
    status: "In Progress",
    assignedTo: "Aisha",
    createdAt: "2026-05-18",
  },
];

export const notifications = [
  {
    id: 1,
    title: "Bug #BUG-2024 has been resolved",
    description: "Please verify the latest fix.",
    time: "2 mins ago",
  },
  {
    id: 2,
    title: "New QA assignment received",
    description: "Checkout module requires testing.",
    time: "10 mins ago",
  },
];

export const chatUsers = [
  {
    id: 1,
    name: "Arun",
    role: "Developer",
    status: "Online",
  },
  {
    id: 2,
    name: "Nivetha",
    role: "Tester",
    status: "Offline",
  },
  {
    id: 3,
    name: "Rahul",
    role: "Admin",
    status: "Online",
  },
];

export const messages = [
  {
    id: 1,
    sender: "Arun",
    text: "Bug fixed in auth module.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "Nivetha",
    text: "Retesting started.",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "Rahul",
    text: "Deploy after QA approval.",
    time: "10:35 AM",
  },
];
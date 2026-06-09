
import {
  dashboardStats,
  recentActivities,
  bugs,
} from "./mock/testerData";

export const dashboardStats = [
  {
    id: 1,
    title: "Reported Bugs",
    value: 128,
    change: "+12%",
  },
  {
    id: 2,
    title: "Critical Issues",
    value: 9,
    change: "+3%",
  },
  {
    id: 3,
    title: "Pending Verification",
    value: 24,
    change: "+8%",
  },
  {
    id: 4,
    title: "Resolved Bugs",
    value: 95,
    change: "+18%",
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "Login bug reported",
    time: "10 mins ago",
    status: "critical",
  },
  {
    id: 2,
    title: "Payment issue verified",
    time: "25 mins ago",
    status: "resolved",
  },
  {
    id: 3,
    title: "UI alignment bug reopened",
    time: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    title: "API timeout issue escalated",
    time: "2 hours ago",
    status: "critical",
  },
];

export const bugs = [
  {
    id: "BUG-1021",
    title: "Login button not responding",
    severity: "Critical",
    status: "Open",
    module: "Authentication",
  },
  {
    id: "BUG-1022",
    title: "Payment gateway timeout",
    severity: "High",
    status: "In Progress",
    module: "Payments",
  },
  {
    id: "BUG-1023",
    title: "Navbar overlaps content",
    severity: "Medium",
    status: "Resolved",
    module: "UI",
  },
  {
    id: "BUG-1024",
    title: "Incorrect API response",
    severity: "High",
    status: "Pending Verification",
    module: "Backend",
  },
];

export const chatUsers = [
  {
    id: 1,
    name: "Arun Dev",
    role: "Frontend Developer",
    online: true,
  },
  {
    id: 2,
    name: "Meena QA",
    role: "QA Engineer",
    online: true,
  },
  {
    id: 3,
    name: "Rahul Backend",
    role: "Backend Developer",
    online: false,
  },
];

export const messages = [
  {
    id: 1,
    sender: "Meena QA",
    text: "BUG-1021 still reproducible in staging.",
    time: "10:45 AM",
  },
  {
    id: 2,
    sender: "Arun Dev",
    text: "Fix deployed. Please verify once.",
    time: "10:47 AM",
  },
  {
    id: 3,
    sender: "Rahul Backend",
    text: "API issue root cause identified.",
    time: "11:02 AM",
  },
];
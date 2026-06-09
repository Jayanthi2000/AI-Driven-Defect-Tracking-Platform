export const BUGS_DATA = [
  {
    id: "BUG-001",
    title: "Login API returns 401 Unauthorized on valid credentials",
    severity: "Critical",
    status: "In Progress",
    category: "Authentication",
    assignedTo: "Arjun Mehta",
    priority: "P1",
  },
  {
    id: "BUG-002",
    title: "JWT token expired prematurely",
    severity: "High",
    status: "Open",
    category: "Authentication",
    assignedTo: "Sneha Iyer",
    priority: "P1",
  },
  {
    id: "BUG-003",
    title: "Payment gateway timeout",
    severity: "Critical",
    status: "Testing",
    category: "Payments",
    assignedTo: "Rahul Patel",
    priority: "P1",
  },
  {
    id: "BUG-004",
    title: "Notification service delay",
    severity: "Medium",
    status: "Open",
    category: "Notifications",
    assignedTo: "Divya Nair",
    priority: "P2",
  },
  {
    id: "BUG-005",
    title: "Dashboard chart rendering fails",
    severity: "Medium",
    status: "In Progress",
    category: "Frontend",
    assignedTo: "Kiran Bose",
    priority: "P2",
  },
  {
    id: "BUG-006",
    title: "User role permission mismatch",
    severity: "High",
    status: "Resolved",
    category: "Security",
    assignedTo: "Arjun Mehta",
    priority: "P1",
  },
];

export const TEAM_MEMBERS = [
  {
    id: "t1",
    name: "Arjun Mehta",
    avatar: "AM",
    role: "Full Stack Developer",
  },
  {
    id: "t2",
    name: "Sneha Iyer",
    avatar: "SI",
    role: "Backend Developer",
  },
  {
    id: "t3",
    name: "Rahul Patel",
    avatar: "RP",
    role: "Senior Developer",
  },
  {
    id: "t4",
    name: "Divya Nair",
    avatar: "DN",
    role: "Frontend Developer",
  },
  {
    id: "t5",
    name: "Kiran Bose",
    avatar: "KB",
    role: "Frontend Developer",
  },
];

export const CATEGORIES = [
  "Authentication",
  "Dashboard",
  "Frontend",
  "Backend",
  "Payments",
  "API",
  "UI/UX",
  "Notifications",
  "Analytics",
  "Performance",
  "Security",
];

export const SEVERITIES = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const STATUSES = [
  "Open",
  "In Progress",
  "Testing",
  "Resolved",
];

export const PRIORITIES = [
  "P1",
  "P2",
  "P3",
  "P4",
];
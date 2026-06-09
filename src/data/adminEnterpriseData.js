
export const dashboardStats = [
  {
    id: 1,
    title: "Open Defects",
    value: "1,248",
    change: "+18% this sprint",
    icon: "bugs",
  },
  {
    id: 2,
    title: "Active Monitoring",
    value: "342",
    change: "+12% uptime",
    icon: "active",
  },
  {
    id: 3,
    title: "Quality Score",
    value: "94%",
    change: "AI confidence improved",
    icon: "quality",
  },
  {
    id: 4,
    title: "Team Members",
    value: "86",
    change: "+7 new onboarded",
    icon: "users",
  },
];

export const analyticsData = [
  { name: "Mon", resolved: 42 },
  { name: "Tue", resolved: 58 },
  { name: "Wed", resolved: 66 },
  { name: "Thu", resolved: 74 },
  { name: "Fri", resolved: 82 },
];

export const velocityData = [
  { team: "Frontend", velocity: 86 },
  { team: "Backend", velocity: 72 },
  { team: "QA", velocity: 91 },
  { team: "AI", velocity: 65 },
];

export const bugTableData = [
  {
    id: 1,
    title: "Authentication token expiration loop",
    status: "Open",
    severity: "Critical",
    assignedTo: "Rahul",
  },
  {
    id: 2,
    title: "AI duplicate prediction mismatch",
    status: "Investigating",
    severity: "High",
    assignedTo: "Sneha",
  },
  {
    id: 3,
    title: "Realtime notification sync delay",
    status: "In Progress",
    severity: "Medium",
    assignedTo: "Kavin",
  },
];

export const aiInsights = [
  {
    id: 1,
    title: "High Regression Probability",
    score: "87%",
    description: "Authentication module likely to generate repeated failures.",
  },
  {
    id: 2,
    title: "Sprint Risk Forecast",
    score: "74%",
    description: "Backend API delivery delays may impact release velocity.",
  },
];

export const activityFeed = [
  {
    id: 1,
    title: "New critical defect escalated",
    time: "2 mins ago",
    status: "Escalated",
  },
  {
    id: 2,
    title: "AI engine completed duplicate scan",
    time: "10 mins ago",
    status: "Completed",
  },
  {
    id: 3,
    title: "QA verification finished",
    time: "18 mins ago",
    status: "Resolved",
  },
];

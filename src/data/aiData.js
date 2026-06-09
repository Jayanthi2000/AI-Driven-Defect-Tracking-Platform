export const aiInsights = [
  {
    id: 1,
    title: "Critical Authentication Failures",
    category: "Authentication Issue",
    confidence: 94,
    severity: "Critical",
    trend: "+12%",
    trendUp: true,
    description: "JWT refresh token handling is failing under concurrent requests, causing session drops for ~18% of users.",
    suggestedFix: "Validate JWT refresh token handling with mutex lock on token refresh endpoint.",
    affectedBugs: 7,
    color: "emerald",
  },
  {
    id: 2,
    title: "Payment Gateway Timeouts",
    category: "Network / Integration",
    confidence: 89,
    severity: "High",
    trend: "-4%",
    trendUp: false,
    description: "Recurring timeout pattern detected on /api/payment/charge averaging 8.2s response time under load.",
    suggestedFix: "Implement circuit breaker pattern and increase retry backoff strategy to 3 attempts.",
    affectedBugs: 4,
    color: "amber",
  },
  {
    id: 3,
    title: "Memory Leak in Dashboard Module",
    category: "Performance",
    confidence: 82,
    severity: "Medium",
    trend: "+3%",
    trendUp: true,
    description: "Event listener cleanup missing in useEffect teardowns across 3 dashboard components.",
    suggestedFix: "Add cleanup functions to all useEffect hooks subscribing to WebSocket events.",
    affectedBugs: 3,
    color: "violet",
  },
  {
    id: 4,
    title: "SQL Injection Vector in Search",
    category: "Security",
    confidence: 97,
    severity: "Critical",
    trend: "New",
    trendUp: true,
    description: "Unparameterized query construction found in advanced search endpoint. Immediate attention required.",
    suggestedFix: "Replace string concatenation with parameterized queries using prepared statements.",
    affectedBugs: 1,
    color: "emerald",
  },
];

export const duplicateBugs = [
  {
    id: 1,
    original: { id: "BUG-087", title: "Login fails after password reset" },
    duplicate: { id: "BUG-103", title: "User cannot login post password change" },
    confidence: 92,
    category: "Authentication Issue",
    detectedAt: "2 hours ago",
  },
  {
    id: 2,
    original: { id: "BUG-061", title: "Dashboard charts not loading on mobile" },
    duplicate: { id: "BUG-098", title: "Recharts blank on small screen devices" },
    confidence: 88,
    category: "UI / Rendering",
    detectedAt: "5 hours ago",
  },
  {
    id: 3,
    original: { id: "BUG-044", title: "API returns 500 on null payload" },
    duplicate: { id: "BUG-091", title: "Server error when body is empty" },
    confidence: 95,
    category: "Backend / API",
    detectedAt: "1 day ago",
  },
];

export const bugTrendData = [
  { week: "W1", critical: 3, high: 7, medium: 12, low: 5 },
  { week: "W2", critical: 5, high: 9, medium: 10, low: 8 },
  { week: "W3", critical: 4, high: 6, medium: 14, low: 6 },
  { week: "W4", critical: 7, high: 11, medium: 9, low: 4 },
  { week: "W5", critical: 6, high: 8, medium: 11, low: 7 },
  { week: "W6", critical: 9, high: 13, medium: 8, low: 3 },
  { week: "W7", critical: 5, high: 7, medium: 10, low: 9 },
  { week: "W8", critical: 4, high: 6, medium: 7, low: 11 },
];

export const severityDistribution = [
  { name: "Critical", value: 18, color: "#10b981" },
  { name: "High", value: 34, color: "#f59e0b" },
  { name: "Medium", value: 29, color: "#8b5cf6" },
  { name: "Low", value: 19, color: "#6b7280" },
];

export const aiActivityTimeline = [
  {
    id: 1,
    type: "duplicate_detected",
    message: "Duplicate detected: BUG-103 matches BUG-087 with 92% confidence",
    time: "2 min ago",
    icon: "copy",
  },
  {
    id: 2,
    type: "severity_upgraded",
    message: "BUG-104 severity upgraded from High to Critical by AI analysis",
    time: "18 min ago",
    icon: "alert",
  },
  {
    id: 3,
    type: "fix_suggested",
    message: "Auto-fix suggestion generated for BUG-091: parameterized queries",
    time: "1 hr ago",
    icon: "lightbulb",
  },
  {
    id: 4,
    type: "category_assigned",
    message: "BUG-099 automatically categorized as Security vulnerability",
    time: "3 hr ago",
    icon: "tag",
  },
  {
    id: 5,
    type: "trend_alert",
    message: "Spike detected: Critical bugs increased 28% in last 48 hours",
    time: "5 hr ago",
    icon: "trending",
  },
  {
    id: 6,
    type: "fix_suggested",
    message: "Fix confidence score for BUG-087 reached 94%",
    time: "8 hr ago",
    icon: "lightbulb",
  },
];

export const categoryBreakdown = [
  { name: "Authentication", count: 14, color: "#10b981" },
  { name: "Performance", count: 9, color: "#8b5cf6" },
  { name: "Security", count: 6, color: "#f59e0b" },
  { name: "UI / Rendering", count: 11, color: "#6b7280" },
  { name: "Backend / API", count: 8, color: "#10b981" },
  { name: "Data / DB", count: 5, color: "#f59e0b" },
];

// ─── BUGS ────────────────────────────────────────────────────────────────────
export const BUGS = [
  {
    id: "BUG-1042",
    title: "Memory leak in WebSocket connection handler",
    description:
      "The WebSocket connection handler does not properly clean up event listeners when the component unmounts, causing significant memory leaks in long-running sessions. Profiler shows ~12MB growth per minute.",
    status: "in_progress",
    priority: "critical",
    severity: "blocker",
    project: "CoreEngine",
    module: "Networking",
    assignee: { id: "u1", name: "Alex Mercer", avatar: "AM", color: "#6366f1" },
    reporter: { id: "u3", name: "Sara Lin", avatar: "SL", color: "#ec4899" },
    createdAt: "2025-05-20T09:14:00Z",
    updatedAt: "2025-05-26T17:45:00Z",
    dueDate: "2025-05-28T00:00:00Z",
    tags: ["memory", "websocket", "performance"],
    comments: 8,
    attachments: 3,
    stepsToReproduce: [
      "Open the app and navigate to the dashboard",
      "Open browser DevTools > Memory tab",
      "Take a heap snapshot",
      "Stay on dashboard for 5 minutes",
      "Take another snapshot and compare",
    ],
    expectedBehavior: "Memory usage should remain stable after initial load.",
    actualBehavior: "Memory grows ~12MB per minute due to uncleaned listeners.",
    aiSuggestion: {
      confidence: 94,
      summary: "Add cleanup function in useEffect to remove all WS listeners",
      codeSnippet: `useEffect(() => {
  const socket = new WebSocket(WS_URL);
  const handleMessage = (e) => dispatch(setMessage(e.data));
  const handleError  = (e) => console.error('WS error', e);

  socket.addEventListener('message', handleMessage);
  socket.addEventListener('error',   handleError);

  // ✅ Cleanup prevents the memory leak
  return () => {
    socket.removeEventListener('message', handleMessage);
    socket.removeEventListener('error',   handleError);
    socket.close();
  };
}, []);`,
      references: [
        "MDN: EventTarget.removeEventListener()",
        "React Docs: useEffect cleanup",
      ],
    },
    history: [
      { action: "created", user: "Sara Lin", ts: "2025-05-20T09:14:00Z" },
      { action: "assigned to Alex Mercer", user: "Sam Park", ts: "2025-05-20T10:00:00Z" },
      { action: "status → in_progress", user: "Alex Mercer", ts: "2025-05-21T08:30:00Z" },
      { action: "comment added", user: "Alex Mercer", ts: "2025-05-23T14:12:00Z" },
    ],
  },
  {
    id: "BUG-1038",
    title: "Auth token not refreshed on 401 response",
    description:
      "When the backend returns a 401, the frontend should silently refresh the access token via the refresh endpoint. Currently the user is immediately logged out.",
    status: "open",
    priority: "high",
    severity: "major",
    project: "AuthService",
    module: "Authentication",
    assignee: { id: "u1", name: "Alex Mercer", avatar: "AM", color: "#6366f1" },
    reporter: { id: "u4", name: "Dev Ops", avatar: "DO", color: "#f59e0b" },
    createdAt: "2025-05-18T11:00:00Z",
    updatedAt: "2025-05-25T09:00:00Z",
    dueDate: "2025-05-30T00:00:00Z",
    tags: ["auth", "jwt", "api"],
    comments: 4,
    attachments: 1,
    stepsToReproduce: [
      "Log in and wait for access token to expire (~15 min)",
      "Perform any API request",
      "Observe immediate logout instead of token refresh",
    ],
    expectedBehavior: "Silent token refresh, request retried automatically.",
    actualBehavior: "User is logged out and redirected to /login.",
    aiSuggestion: {
      confidence: 88,
      summary: "Implement Axios response interceptor to handle 401 with token refresh",
      codeSnippet: `axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { data } = await axios.post('/auth/refresh');
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + data.accessToken;
      return axios(original);
    }
    return Promise.reject(error);
  }
);`,
      references: ["Axios Interceptors Docs", "RFC 6749 – OAuth 2.0 Token Refresh"],
    },
    history: [
      { action: "created", user: "Dev Ops", ts: "2025-05-18T11:00:00Z" },
      { action: "assigned to Alex Mercer", user: "Sam Park", ts: "2025-05-19T08:00:00Z" },
    ],
  },
  {
    id: "BUG-1029",
    title: "Dashboard charts fail on Safari 16",
    description:
      "Chart.js canvases are blank on Safari 16.x. The issue is related to missing ResizeObserver polyfill and Safari's stricter canvas security.",
    status: "review",
    priority: "medium",
    severity: "minor",
    project: "Dashboard",
    module: "Analytics",
    assignee: { id: "u1", name: "Alex Mercer", avatar: "AM", color: "#6366f1" },
    reporter: { id: "u5", name: "QA Bot", avatar: "QB", color: "#10b981" },
    createdAt: "2025-05-12T14:22:00Z",
    updatedAt: "2025-05-24T16:00:00Z",
    dueDate: "2025-06-01T00:00:00Z",
    tags: ["safari", "canvas", "charts"],
    comments: 6,
    attachments: 2,
    stepsToReproduce: [
      "Open app in Safari 16.x",
      "Navigate to Analytics dashboard",
      "Charts canvas is blank / white",
    ],
    expectedBehavior: "Charts render correctly across all major browsers.",
    actualBehavior: "Charts are blank on Safari 16.",
    aiSuggestion: {
      confidence: 79,
      summary: "Add ResizeObserver polyfill and configure Chart.js for Safari compatibility",
      codeSnippet: `// vite.config.js
import resizeObserverPolyfill from 'resize-observer-polyfill';

// main.jsx – before app mount
if (!window.ResizeObserver) {
  window.ResizeObserver = resizeObserverPolyfill;
}

// Chart initialization
const chart = new Chart(ctx, {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // disable for Safari
  }
});`,
      references: ["Chart.js Safari Issues #8616", "CanIUse – ResizeObserver"],
    },
    history: [
      { action: "created", user: "QA Bot", ts: "2025-05-12T14:22:00Z" },
      { action: "status → review", user: "Alex Mercer", ts: "2025-05-22T09:00:00Z" },
    ],
  },
  {
    id: "BUG-1021",
    title: "File upload silently fails above 10MB",
    description:
      "Files larger than 10MB are silently dropped by the upload handler. No error message shown to the user.",
    status: "resolved",
    priority: "high",
    severity: "major",
    project: "FileManager",
    module: "Upload",
    assignee: { id: "u1", name: "Alex Mercer", avatar: "AM", color: "#6366f1" },
    reporter: { id: "u3", name: "Sara Lin", avatar: "SL", color: "#ec4899" },
    createdAt: "2025-05-08T10:00:00Z",
    updatedAt: "2025-05-19T11:00:00Z",
    dueDate: "2025-05-20T00:00:00Z",
    tags: ["upload", "ux", "files"],
    comments: 5,
    attachments: 0,
    stepsToReproduce: [
      "Click 'Upload File' in the File Manager",
      "Select a file > 10MB",
      "Observe — no error, file not uploaded",
    ],
    expectedBehavior: "Clear error message shown when file exceeds 10MB limit.",
    actualBehavior: "Silent failure — user has no idea what happened.",
    aiSuggestion: {
      confidence: 97,
      summary: "Validate file size before upload and show toast notification",
      codeSnippet: `const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > MAX_SIZE) {
    toast.error(\`File too large (\${(file.size/1e6).toFixed(1)} MB). Max is 10 MB.\`);
    return;
  }
  uploadFile(file);
};`,
      references: ["MDN: File.size", "UX Pattern: Inline Validation"],
    },
    history: [
      { action: "created", user: "Sara Lin", ts: "2025-05-08T10:00:00Z" },
      { action: "status → resolved", user: "Alex Mercer", ts: "2025-05-19T11:00:00Z" },
    ],
  },
  {
    id: "BUG-1015",
    title: "Dark mode flicker on initial page load",
    description:
      "When the app first loads with dark mode saved in localStorage, there is a visible white flash before the theme is applied.",
    status: "open",
    priority: "low",
    severity: "trivial",
    project: "Dashboard",
    module: "Theme",
    assignee: { id: "u1", name: "Alex Mercer", avatar: "AM", color: "#6366f1" },
    reporter: { id: "u3", name: "Sara Lin", avatar: "SL", color: "#ec4899" },
    createdAt: "2025-05-01T08:00:00Z",
    updatedAt: "2025-05-15T10:00:00Z",
    dueDate: "2025-06-10T00:00:00Z",
    tags: ["dark-mode", "ux", "flicker"],
    comments: 2,
    attachments: 1,
    stepsToReproduce: [
      "Enable dark mode",
      "Hard-refresh the page",
      "Notice white flash before dark theme applies",
    ],
    expectedBehavior: "Theme applied immediately with no visible flash.",
    actualBehavior: "White flash (~200ms) before dark theme applies.",
    aiSuggestion: {
      confidence: 91,
      summary: "Apply theme class synchronously in <head> before React hydration",
      codeSnippet: `// index.html – inside <head>, before any <script>
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(theme);
  })();
</script>`,
      references: ["Josh Comeau: The Quest for the Perfect Dark Mode"],
    },
    history: [
      { action: "created", user: "Sara Lin", ts: "2025-05-01T08:00:00Z" },
    ],
  },
  {
    id: "BUG-1009",
    title: "Pagination resets on browser back navigation",
    description:
      "When a user navigates to page 5 of results and clicks a result, then clicks browser back, the list resets to page 1.",
    status: "open",
    priority: "medium",
    severity: "minor",
    project: "DataGrid",
    module: "Pagination",
    assignee: { id: "u1", name: "Alex Mercer", avatar: "AM", color: "#6366f1" },
    reporter: { id: "u5", name: "QA Bot", avatar: "QB", color: "#10b981" },
    createdAt: "2025-04-28T15:00:00Z",
    updatedAt: "2025-05-10T09:00:00Z",
    dueDate: "2025-06-05T00:00:00Z",
    tags: ["pagination", "routing", "ux"],
    comments: 3,
    attachments: 0,
    stepsToReproduce: [
      "Go to any paginated list",
      "Navigate to page 5",
      "Click any item",
      "Click browser back button",
      "Page resets to 1",
    ],
    expectedBehavior: "Page state preserved in URL and restored on back navigation.",
    actualBehavior: "Page resets to 1 on back navigation.",
    aiSuggestion: {
      confidence: 85,
      summary: "Sync pagination state with URL search params using useSearchParams",
      codeSnippet: `const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get('page') || 1);

const handlePageChange = (newPage) => {
  setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
};`,
      references: ["React Router: useSearchParams", "URL as State Pattern"],
    },
    history: [
      { action: "created", user: "QA Bot", ts: "2025-04-28T15:00:00Z" },
    ],
  },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: "n1", type: "bug_assigned", title: "New bug assigned to you", body: "BUG-1042: Memory leak in WebSocket handler", ts: "2025-05-27T08:00:00Z", read: false },
  { id: "n2", type: "comment", title: "Sara Lin commented on BUG-1038", body: '"Any update on the token refresh fix?"', ts: "2025-05-26T17:30:00Z", read: false },
  { id: "n3", type: "status_change", title: "BUG-1029 moved to Review", body: "QA Bot changed status to Review", ts: "2025-05-26T14:00:00Z", read: false },
  { id: "n4", type: "ai_suggestion", title: "AI fix suggestion ready", body: "BUG-1042 has a 94% confidence fix available", ts: "2025-05-25T10:00:00Z", read: true },
  { id: "n5", type: "due_soon", title: "BUG-1042 due tomorrow", body: "Critical bug due 2025-05-28", ts: "2025-05-25T09:00:00Z", read: true },
  { id: "n6", type: "resolved", title: "BUG-1021 resolved", body: "File upload bug marked as resolved", ts: "2025-05-19T11:00:00Z", read: true },
];

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
export const ACTIVITY = [
  { id: "a1", user: { name: "Alex Mercer", avatar: "AM", color: "#6366f1" }, action: "updated status of BUG-1029 to", target: "Review", ts: "2025-05-26T16:00:00Z", type: "status" },
  { id: "a2", user: { name: "Sara Lin", avatar: "SL", color: "#ec4899" }, action: "commented on", target: "BUG-1038", ts: "2025-05-26T14:30:00Z", type: "comment" },
  { id: "a3", user: { name: "Alex Mercer", avatar: "AM", color: "#6366f1" }, action: "applied AI fix suggestion to", target: "BUG-1021", ts: "2025-05-25T11:00:00Z", type: "ai" },
  { id: "a4", user: { name: "QA Bot", avatar: "QB", color: "#10b981" }, action: "assigned", target: "BUG-1042", detail: "to Alex Mercer", ts: "2025-05-24T09:00:00Z", type: "assign" },
  { id: "a5", user: { name: "Alex Mercer", avatar: "AM", color: "#6366f1" }, action: "resolved", target: "BUG-1021", ts: "2025-05-19T11:00:00Z", type: "resolve" },
  { id: "a6", user: { name: "Sam Park", avatar: "SP", color: "#f59e0b" }, action: "created", target: "BUG-1009", ts: "2025-05-10T15:00:00Z", type: "create" },
];

// ─── CHAT ─────────────────────────────────────────────────────────────────────
export const CHAT_CONTACTS = [
  { id: "c1", name: "Sara Lin", role: "QA Lead", avatar: "SL", color: "#ec4899", status: "online", unread: 2 },
  { id: "c2", name: "Sam Park", role: "Project Manager", avatar: "SP", color: "#f59e0b", status: "online", unread: 0 },
  { id: "c3", name: "QA Bot", role: "Automated QA", avatar: "QB", color: "#10b981", status: "online", unread: 1 },
  { id: "c4", name: "Dev Ops", role: "Infrastructure", avatar: "DO", color: "#3b82f6", status: "away", unread: 0 },
  { id: "c5", name: "Maria Chen", role: "Frontend Lead", avatar: "MC", color: "#8b5cf6", status: "offline", unread: 0 },
  { id: "c6", name: "Team #bugs", role: "Group Channel", avatar: "TB", color: "#6366f1", status: "online", unread: 5, isGroup: true },
];

export const CHAT_MESSAGES = {
  c1: [
    { id: "m1", senderId: "c1", text: "Hey, any update on the WebSocket memory leak fix?", ts: "2025-05-27T09:00:00Z", status: "read" },
    { id: "m2", senderId: "me", text: "Working on it now. The cleanup function approach looks solid — about 80% done.", ts: "2025-05-27T09:05:00Z", status: "read" },
    { id: "m3", senderId: "c1", text: "Great! The AI suggestion was really helpful I assume?", ts: "2025-05-27T09:06:00Z", status: "read" },
    { id: "m4", senderId: "me", text: "Yeah, 94% confidence and the code snippet was basically production-ready. Just needed minor adjustments for our event system.", ts: "2025-05-27T09:10:00Z", status: "read" },
    { id: "m5", senderId: "c1", text: "Perfect. I'll move the ticket to review once you push. 🚀", ts: "2025-05-27T09:11:00Z", status: "read" },
    { id: "m6", senderId: "c1", text: "Also — can you check BUG-1038? The token refresh is blocking several users in prod.", ts: "2025-05-27T09:45:00Z", status: "delivered" },
    { id: "m7", senderId: "c1", text: "Priority just got bumped to critical by Sam.", ts: "2025-05-27T09:46:00Z", status: "delivered" },
  ],
  c2: [
    { id: "m10", senderId: "c2", text: "Sprint review is moved to Friday 3PM.", ts: "2025-05-26T15:00:00Z", status: "read" },
    { id: "m11", senderId: "me", text: "Got it, I'll have BUG-1042 and BUG-1038 closed by then.", ts: "2025-05-26T15:05:00Z", status: "read" },
    { id: "m12", senderId: "c2", text: "Awesome. Stakeholders are watching those two closely 👀", ts: "2025-05-26T15:06:00Z", status: "read" },
  ],
  c3: [
    { id: "m20", senderId: "c3", text: "Automated scan complete. 3 new regressions detected in build #1204.", ts: "2025-05-27T07:00:00Z", status: "read" },
    { id: "m21", senderId: "me", text: "Can you link the regression report?", ts: "2025-05-27T07:30:00Z", status: "read" },
    { id: "m22", senderId: "c3", text: "Report attached: regression-1204.pdf", ts: "2025-05-27T07:31:00Z", status: "read", attachment: { name: "regression-1204.pdf", size: "245 KB" } },
    { id: "m23", senderId: "c3", text: "New bug: Dashboard charts fail on Safari 16 — flagged as BUG-1029.", ts: "2025-05-27T08:00:00Z", status: "delivered" },
  ],
  c4: [],
  c5: [],
  c6: [
    { id: "m30", senderId: "c1", text: "BUG-1042 is a blocker for the release. All eyes on Alex!", ts: "2025-05-27T08:30:00Z", status: "read" },
    { id: "m31", senderId: "c2", text: "Alex, do you need any help?", ts: "2025-05-27T08:32:00Z", status: "read" },
    { id: "m32", senderId: "me", text: "I've got it — will push the fix this afternoon.", ts: "2025-05-27T08:35:00Z", status: "read" },
    { id: "m33", senderId: "c3", text: "AI confidence score: 94%. Go get it Alex 💪", ts: "2025-05-27T08:36:00Z", status: "read" },
    { id: "m34", senderId: "c4", text: "Infra is ready for the hotfix deploy whenever.", ts: "2025-05-27T08:40:00Z", status: "read" },
    { id: "m35", senderId: "c5", text: "Let me know if you need a code review before merge.", ts: "2025-05-27T08:41:00Z", status: "delivered" },
  ],
};

// ─── STATS ────────────────────────────────────────────────────────────────────
export const DEV_STATS = {
  assigned: 6,
  inProgress: 2,
  resolved: 1,
  overdue: 1,
  aiFixesApplied: 3,
  avgResolutionDays: 2.4,
  weeklyTrend: [4, 6, 3, 7, 5, 8, 6],
};
// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import DeveloperLayout from "../modules/developer/components/DeveloperLayout";
import TesterLayout from "../modules/tester/components/layout/TesterLayout";

// Landing
import LandingPage from "../pages/landing/LandingPage";
import FeaturesPage from "../pages/landing/FeaturesPage";
import PricingPage from "../pages/landing/PricingPage";
import DocsPage from "../pages/landing/DocsPage";

// Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Admin pages
import DashboardPage from "../pages/dashboard/DashboardPage";
import BugManagementPage from "../pages/bugs/BugManagementPage";
import AnalyticsPage from "../pages/analytics/AnalyticsPage";
import AIAnalysisPage from "../pages/ai/AIAnalysisPage";
import WorkflowMonitoringPage from "../pages/workflow/WorkflowMonitoringPage";
import ReportsPage from "../pages/reports/ReportsPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import TeamManagementPage from "../pages/teams/TeamManagementPage";
import TeamChatPage from "../pages/chat/TeamChatPage";
import SettingsPage from "../pages/settings/SettingsPage";
import ProfilePage from "../pages/profile/ProfilePage";

// Developer pages
import DeveloperDashboard from "../modules/developer/pages/DeveloperDashboard";
import DeveloperMyBugsPage from "../modules/developer/pages/MyBugsPage";
import DeveloperBugDetailsPage from "../modules/developer/pages/BugDetailsPage";
import DeveloperActivityPage from "../modules/developer/pages/ActivityPage";
import DeveloperProfilePage from "../modules/developer/pages/ProfilePage";

// Tester pages
import TesterDashboard from "../modules/tester/components/pages/TesterDashboard";
import TesterMyBugsPage from "../modules/tester/components/pages/MyBugsPage";
import TesterBugDetailsPage from "../modules/tester/components/pages/BugDetailsPage";
import TesterReportBugPage from "../modules/tester/components/pages/ReportBugPage";
import TesterActivityPage from "../modules/tester/components/pages/ActivityPage";
import TesterProfilePage from "../modules/tester/components/pages/TesterProfilePage";

import { getDashboardRoute } from "../services/authService";

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* ── PUBLIC ─────────────────────────────────────────── */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing"  element={<PricingPage />} />
      <Route path="/docs"     element={<DocsPage />} />

      {/* ── AUTH ───────────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          isAuthenticated()
            ? <Navigate to={getDashboardRoute(user?.role)} replace />
            : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated()
            ? <Navigate to={getDashboardRoute(user?.role)} replace />
            : <RegisterPage />
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* ── ADMIN ──────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"       element={<DashboardPage />} />
          <Route path="bugs"            element={<BugManagementPage />} />
          <Route path="analytics"       element={<AnalyticsPage />} />
          <Route path="ai-analysis"     element={<AIAnalysisPage />} />
          <Route path="workflow"        element={<WorkflowMonitoringPage />} />
          <Route path="reports"         element={<ReportsPage />} />
          <Route path="notifications"   element={<NotificationsPage />} />
          <Route path="team-management" element={<TeamManagementPage />} />
          <Route path="team-chat"       element={<TeamChatPage />} />
          <Route path="settings"        element={<SettingsPage />} />
          <Route path="profile"         element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── DEVELOPER ──────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["DEVELOPER"]} />}>
        <Route path="/developer" element={<DeveloperLayout />}>
          <Route index element={<Navigate to="/developer/dashboard" replace />} />
          <Route path="dashboard"       element={<DeveloperDashboard />} />
          <Route path="my-bugs"         element={<DeveloperMyBugsPage />} />
          <Route path="bug-details/:id" element={<DeveloperBugDetailsPage />} />
          <Route path="activity"        element={<DeveloperActivityPage />} />
          <Route path="profile"         element={<DeveloperProfilePage />} />
        </Route>
      </Route>

      {/* ── TESTER ─────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={["TESTER"]} />}>
        <Route path="/tester" element={<TesterLayout />}>
          <Route index element={<Navigate to="/tester/dashboard" replace />} />
          <Route path="dashboard"       element={<TesterDashboard />} />
          <Route path="my-bugs"         element={<TesterMyBugsPage />} />
          <Route path="bug-details/:id" element={<TesterBugDetailsPage />} />
          <Route path="report-bug"      element={<TesterReportBugPage />} />
          <Route path="activity"        element={<TesterActivityPage />} />
          <Route path="profile"         element={<TesterProfilePage />} />
        </Route>
      </Route>

      {/* ── FALLBACK ───────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
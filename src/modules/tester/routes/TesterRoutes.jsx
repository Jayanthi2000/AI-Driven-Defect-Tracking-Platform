// src/modules/tester/routes/TesterRoutes.jsx
import { Navigate, Route } from 'react-router-dom';
import TesterLayout from '../components/layout/TesterLayout';
import TesterProtectedRoute from '../components/layout/TesterProtectedRoute';
import TesterDashboard from '../components/pages/TesterDashboard';
import MyBugsPage from '../components/pages/MyBugsPage';
import BugDetailsPage from '../components/pages/BugDetailsPage';
import ReportBugPage from '../components/pages/ReportBugPage';
import ActivityPage from '../components/pages/ActivityPage';
import TesterProfilePage from '../components/pages/TesterProfilePage';

const TesterRoutes = (
  <Route
    path="/tester"
    element={
      <TesterProtectedRoute>
        <TesterLayout />
      </TesterProtectedRoute>
    }
  >
    <Route index element={<Navigate to="/tester/dashboard" replace />} />
    <Route path="dashboard"        element={<TesterDashboard />} />
    <Route path="my-bugs"          element={<MyBugsPage />} />
    <Route path="bug-details/:id"  element={<BugDetailsPage />} />
    <Route path="report-bug"       element={<ReportBugPage />} />
    <Route path="activity"         element={<ActivityPage />} />
    <Route path="profile"          element={<TesterProfilePage />} />
  </Route>
);

export default TesterRoutes;


import { Navigate, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import TeamManagement from './pages/TeamManagement';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Export a function that returns JSX route elements to nest inside your Routes
// Usage in App.jsx:  {adminRoutes()}
export const adminRoutes = (ProtectedRoute) => (
  <Route
    path="/admin"
    element={ProtectedRoute ? <ProtectedRoute><AdminLayout /></ProtectedRoute> : <AdminLayout />}
  >
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="team-management" element={<TeamManagement />} />
    <Route path="notifications" element={<NotificationsPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);

export default adminRoutes;
// DeveloperRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import DeveloperLayout from '../components/DeveloperLayout';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import MyBugsPage from '../pages/MyBugsPage';
import BugDetailsPage from '../pages/BugDetailsPage';
import ActivityPage from '../pages/ActivityPage';
import ProfilePage from '../pages/ProfilePage';

// These routes are intended to be nested inside a ProtectedRoute in AppRoutes.jsx
// Usage in AppRoutes.jsx (already wired):
//   <Route element={<ProtectedRoute allowedRoles={["DEVELOPER"]} />}>
//     <Route path="/developer" element={<DeveloperLayout />}>
//       ...
//     </Route>
//   </Route>

export const developerRoutes = (
  <Route path="/developer" element={<DeveloperLayout />}>
  <Route index element={<DeveloperDashboard />} />
  <Route path="dashboard" element={<DeveloperDashboard />} />
  <Route path="my-bugs" element={<MyBugsPage />} />
  <Route path="bug-details/:id" element={<BugDetailsPage />} />
  <Route path="activity" element={<ActivityPage />} />
  <Route path="profile" element={<ProfilePage />} />
</Route>
);

export default developerRoutes;

// DeveloperProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const DeveloperProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('defectai_token');
  const raw   = localStorage.getItem('defectai_currentUser');

  if (!token || !raw) {
    return <Navigate to="/login" replace />;
  }

  let currentUser = null;
  try { currentUser = JSON.parse(raw); } catch { /* ignore */ }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const role = currentUser.role?.toUpperCase();

  if (role !== 'DEVELOPER') {
    if (role === 'ADMIN')  return <Navigate to="/admin/dashboard"  replace />;
    if (role === 'TESTER') return <Navigate to="/tester/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DeveloperProtectedRoute;
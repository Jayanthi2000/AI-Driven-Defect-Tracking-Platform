// TesterProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { validateToken, getDashboardRoute } from '../../../../services/authService';

export default function TesterProtectedRoute({ children }) {
  const { valid, user } = validateToken();

  if (!valid || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toUpperCase();

  if (role !== 'TESTER') {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }

  return children;
}
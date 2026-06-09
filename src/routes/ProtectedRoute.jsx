import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardRoute } from "../services/authService";

// Maps each role to the URL prefix it owns.
const ROLE_PREFIX = {
  ADMIN:     "/admin",
  DEVELOPER: "/developer",
  TESTER:    "/tester",
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#22c55e] text-sm font-mono tracking-widest">AUTHENTICATING…</p>
        </div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.role;

  // Role-based mismatch: redirect to the user's own dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to={getDashboardRoute(currentRole)} replace />;
  }

  // Path prefix check — catches e.g. a DEVELOPER hitting /admin/anything
  const pathname = location.pathname;
  for (const [role, prefix] of Object.entries(ROLE_PREFIX)) {
    if (pathname.startsWith(prefix) && currentRole !== role) {
      return <Navigate to={getDashboardRoute(currentRole)} replace />;
    }
  }

  // Render child routes via Outlet (layout route pattern)
  return <Outlet />;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Prevent flash or premature redirection while restoring session
  if (isLoading) {
    return <LoadingSpinner message="Verifying session credentials..." />;
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'superadmin') {
    // If unauthorized for this route, redirect to their role's canonical dashboard
    if (user.role === 'admin') {
      return <Navigate to="/lms/admin" replace />;
    }
    if (user.role === 'instructor') {
      return <Navigate to="/instructor" replace />;
    }
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
};

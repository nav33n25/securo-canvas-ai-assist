
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthenticationGuardProps {
  children: ReactNode;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading indicator while checking authentication
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default AuthenticationGuard;


import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth-types';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, loading, role, hasPermission, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);
  
  // Set a short timeout to prevent flashing of loading state
  // for quick authentications
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowLoader(true);
      }
    }, 300);
    
    if (!loading) {
      setShowLoader(false);
    }
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Handle redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to /auth', { location: location.pathname });
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [loading, isAuthenticated, navigate, location]);

  // Show loading indicator
  if (loading || showLoader) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            animate={{ 
              rotate: 360,
              transition: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
            className="mb-4"
          >
            <Shield className="h-12 w-12 text-secure opacity-80" />
          </motion.div>
          <p className="text-lg font-medium text-muted-foreground">Loading SecureCanvas...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Check for role verification
  if (requiredRoles.length > 0) {
    // If roles are required but we don't have a role yet
    if (!role) {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <p className="text-lg font-medium text-muted-foreground">Verifying permissions...</p>
          </motion.div>
        </div>
      );
    }

    // If user doesn't have required role
    if (!requiredRoles.includes(role)) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center"
        >
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your current role ({role}) doesn't have permission to access this page.
            It requires one of the following roles: {requiredRoles.join(', ')}.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.history.back()}
              className="rounded bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
            >
              Go Back
            </button>
            <a
              href="/dashboard"
              className="rounded bg-secure px-4 py-2 text-sm font-medium text-white hover:bg-secure-darker"
            >
              Return to Dashboard
            </a>
          </div>
        </motion.div>
      );
    }
  }

  // User is authenticated and has required permissions
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;

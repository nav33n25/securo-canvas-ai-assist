import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, loading, role, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return (
      <Navigate 
        to={{
          pathname: "/unauthorized",
          search: `?requiredRole=${requiredRoles.join(',')}&currentRole=${role}`
        }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

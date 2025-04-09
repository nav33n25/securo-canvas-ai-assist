import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  // Parse query parameters to get required roles
  const searchParams = new URLSearchParams(location.search);
  const requiredRolesParam = searchParams.get('requiredRole') || '';
  const currentRole = searchParams.get('currentRole') || role || 'unknown';
  
  const requiredRoles = requiredRolesParam.split(',').filter(Boolean) as UserRole[];
  
  // Format role names for display
  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  useEffect(() => {
    console.error(
      "403 Error: User attempted to access restricted route:",
      location.pathname,
      "Required roles:", requiredRoles,
      "Current role:", currentRole
    );
  }, [location.pathname, requiredRoles, currentRole]);

  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-card rounded-lg border shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-md p-4 mb-6">
            <h2 className="font-medium mb-2">Required Permission Level</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {requiredRoles.map((role, index) => (
                <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  {formatRole(role)}
                </div>
              ))}
            </div>
            
            <h2 className="font-medium mb-2">Your Current Role</h2>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1" />
              {formatRole(currentRole)}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {currentRole !== 'administrator' && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Need access? Contact your administrator to upgrade your permissions.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Unauthorized; 
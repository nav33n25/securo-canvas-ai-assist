
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const location = useLocation();
  const { role, subscriptionPlan } = useAuth();
  
  // Extract required role from URL params
  const searchParams = new URLSearchParams(location.search);
  const requiredRoles = searchParams.get('requiredRole')?.split(',') as UserRole[] || [];
  
  // Get highest required role for display
  const highestRequiredRole = requiredRoles.length > 0 
    ? requiredRoles[requiredRoles.length - 1] 
    : null;
  
  // Get readable role names
  const getRoleName = (role: UserRole) => {
    switch(role) {
      case 'individual': return 'Individual';
      case 'team_member': return 'Team Member';
      case 'team_manager': return 'Team Manager';
      case 'administrator': return 'Administrator';
      default: return role;
    }
  };
  
  // Get current role name
  const currentRoleName = role ? getRoleName(role) : 'Unknown';
  
  // Get required role name
  const requiredRoleName = highestRequiredRole ? getRoleName(highestRequiredRole) : 'higher permission';
  
  // Get subscription plan name
  const getSubscriptionName = (plan: string) => {
    switch(plan) {
      case 'free': return 'Free';
      case 'pro': return 'Pro';
      case 'team': return 'Team';
      case 'enterprise': return 'Enterprise';
      default: return plan;
    }
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
                <Lock className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-center text-xl font-bold">Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                <p className="text-sm font-medium">Permission Required</p>
              </div>
              <p className="text-muted-foreground text-sm">
                This page requires <span className="font-medium">{requiredRoleName}</span> access or higher
              </p>
            </div>
            
            <div>
              <p className="mb-1">Your current role: <span className="font-medium">{currentRoleName}</span></p>
              <p className="text-sm text-muted-foreground mb-4">
                Your current subscription: {getSubscriptionName(subscriptionPlan || 'free')}
              </p>
              
              <div className="flex items-center justify-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <p className="text-sm text-amber-500">
                  You don't have sufficient permissions to access this feature
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="default" className="w-full" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/auth">
                Change Account
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Unauthorized;

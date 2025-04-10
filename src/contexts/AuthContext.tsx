
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserRole, 
  CombinedUserRole, 
  SubscriptionTier, 
  SubscriptionPlan,
  ProfileUpdateParams,
  RegisterParams,
  rolePermissions
} from '@/types/auth-types';
import { User } from '@/types/common';

// Use export type for re-exports when isolatedModules is enabled
export type { UserRole, SubscriptionPlan, ProfileUpdateParams, RegisterParams };

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (params: ProfileUpdateParams) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  checkRole: (roles: UserRole | UserRole[]) => boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    role?: UserRole;
    subscriptionTier?: SubscriptionTier;
    jobTitle?: string;
  };
  role?: UserRole; // Add role property
  subscriptionTier?: SubscriptionTier; // Add subscriptionTier property
  subscriptionPlan?: SubscriptionPlan;
  setUserRole: (role: UserRole) => Promise<void>; // Add setUserRole method
  setUserPlan: (plan: SubscriptionPlan) => void;
  signOut: () => Promise<void>; // Alias for logout for compatibility
}

// Create the context with a default empty value
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('free');
  const [profile, setProfile] = useState<AuthContextType['profile']>();
  const [currentRole, setCurrentRole] = useState<UserRole>('individual');
  const [currentSubscriptionTier, setCurrentSubscriptionTier] = useState<SubscriptionTier>('free');

  // Initialize auth state
  useEffect(() => {
    // Simulate checking for an existing session
    const checkAuth = async () => {
      try {
        // Mock implementation - in a real app, this would check a token in localStorage
        // or make an API call to validate the current session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Set role from user data
          if (parsedUser.role) {
            setCurrentRole(parsedUser.role);
          }
          
          // Set profile data if available
          if (parsedUser.first_name || parsedUser.last_name) {
            setProfile({
              firstName: parsedUser.first_name,
              lastName: parsedUser.last_name,
              email: parsedUser.email,
              avatarUrl: parsedUser.avatar_url,
              role: parsedUser.role || 'individual',
              subscriptionTier: parsedUser.subscription_tier || 'free'
            });
            
            // Set subscription tier from profile
            if (parsedUser.subscription_tier) {
              setCurrentSubscriptionTier(parsedUser.subscription_tier);
            }
          }
          
          // Set subscription plan
          setSubscriptionPlan(parsedUser.subscription_plan || 'free');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock implementation - in a real app, this would call an authentication API
      // Simulate successful login with a demo user
      const demoUser: User = {
        id: 'user-001',
        email: email,
        first_name: 'Demo',
        last_name: 'User',
        avatar_url: 'https://ui-avatars.com/api/?name=Demo+User',
        role: 'administrator',
        team_id: 'team-001'
      };
      
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Set role from user data
      if (demoUser.role) {
        setCurrentRole(demoUser.role);
      }
      
      // Set profile data
      setProfile({
        firstName: demoUser.first_name,
        lastName: demoUser.last_name,
        email: demoUser.email,
        avatarUrl: demoUser.avatar_url,
        role: demoUser.role,
        subscriptionTier: 'enterprise'
      });
      
      // Set subscription tier
      setCurrentSubscriptionTier('enterprise');
      
      // Set subscription plan
      setSubscriptionPlan('enterprise');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Mock implementation - in a real app, this would call a logout API
      localStorage.removeItem('user');
      setUser(null);
      setProfile(undefined);
      setSubscriptionPlan('free');
      setCurrentRole('individual');
      setCurrentSubscriptionTier('free');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (params: RegisterParams) => {
    setLoading(true);
    try {
      // Mock implementation - in a real app, this would call a registration API
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: params.email,
        first_name: params.firstName,
        last_name: params.lastName,
        avatar_url: `https://ui-avatars.com/api/?name=${params.firstName}+${params.lastName}`,
        role: params.role || 'individual',
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Set role from user data
      if (newUser.role) {
        setCurrentRole(newUser.role);
      }
      
      // Set profile data
      setProfile({
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        avatarUrl: newUser.avatar_url,
        role: newUser.role,
        subscriptionTier: params.subscriptionTier || 'free'
      });
      
      // Set subscription tier
      if (params.subscriptionTier) {
        setCurrentSubscriptionTier(params.subscriptionTier);
      }
      
      // Set subscription plan based on subscription tier
      let plan: SubscriptionPlan = 'free';
      if (params.subscriptionTier === 'professional' || params.subscriptionTier === 'pro') {
        plan = 'pro';
      } else if (params.subscriptionTier === 'smb' || params.subscriptionTier === 'team') {
        plan = 'team';
      } else if (params.subscriptionTier === 'enterprise') {
        plan = 'enterprise';
      }
      setSubscriptionPlan(plan);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Set user role function
  const setUserRole = async (role: UserRole) => {
    try {
      if (!user) throw new Error('No user is logged in');
      
      // Update the user's role
      const updatedUser: User = {
        ...user,
        role: role
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update current role state
      setCurrentRole(role);
      
      // Update profile data
      setProfile({
        ...profile,
        role: role
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Set user role error:', error);
      return Promise.reject(error);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      // Mock implementation - in a real app, this would call a password reset API
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Confirm password reset function
  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      // Mock implementation - in a real app, this would call a confirm password reset API
      console.log(`Password reset confirmed with token ${token}`);
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (params: ProfileUpdateParams) => {
    try {
      if (!user) throw new Error('No user is logged in');
      
      // Mock implementation - in a real app, this would call a profile update API
      const updatedUser: User = {
        ...user,
        first_name: params.firstName ?? user.first_name,
        last_name: params.lastName ?? user.last_name,
        avatar_url: params.avatarUrl ?? user.avatar_url,
        role: params.role ?? user.role,
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update role if changed
      if (params.role) {
        setCurrentRole(params.role);
      }
      
      // Update subscription tier if changed
      if (params.subscriptionTier) {
        setCurrentSubscriptionTier(params.subscriptionTier);
      }
      
      // Update profile data
      setProfile({
        ...profile,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        avatarUrl: updatedUser.avatar_url,
        role: updatedUser.role,
        jobTitle: params.jobTitle ?? profile?.jobTitle,
        subscriptionTier: params.subscriptionTier || profile?.subscriptionTier || 'free'
      });
      
      // Update subscription plan if subscription tier changed
      if (params.subscriptionTier) {
        let plan: SubscriptionPlan = 'free';
        if (params.subscriptionTier === 'professional' || params.subscriptionTier === 'pro') {
          plan = 'pro';
        } else if (params.subscriptionTier === 'smb' || params.subscriptionTier === 'team') {
          plan = 'team';
        } else if (params.subscriptionTier === 'enterprise') {
          plan = 'enterprise';
        }
        setSubscriptionPlan(plan);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Convenience function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    const userPermissions = rolePermissions[user.role as CombinedUserRole] || [];
    return userPermissions.includes(permission);
  };

  // Convenience function to check if user has one of the specified roles
  const checkRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user || !user.role) return false;
    
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role as UserRole);
  };

  // Set user subscription plan
  const setUserPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlan(plan);
  };

  const signOut = logout; // Alias for compatibility

  // Create the context value object
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    confirmPasswordReset,
    updateProfile,
    hasPermission,
    checkRole,
    profile,
    role: currentRole,
    subscriptionTier: currentSubscriptionTier,
    subscriptionPlan,
    setUserRole,
    setUserPlan,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

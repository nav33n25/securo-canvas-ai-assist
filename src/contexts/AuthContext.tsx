
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { SubscriptionTier, CombinedUserRole, rolePermissions, UserRole, SubscriptionPlan } from '@/types/auth-types';

export { UserRole, SubscriptionPlan };

export interface ProfileUpdateParams {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  avatarUrl?: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  subscriptionTier?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: CombinedUserRole | null;
  profile: any | null;
  subscriptionTier: SubscriptionTier | null;
  subscriptionPlan: SubscriptionPlan | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string | string[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  updateProfile: (params: ProfileUpdateParams) => Promise<void>;
  setUserRole: (role: CombinedUserRole) => Promise<void>;
  setUserPlan: (plan: SubscriptionPlan) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<CombinedUserRole | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Don't make additional Supabase calls directly in the callback
        // to avoid potential deadlocks
        if (session?.user?.id) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setProfile(null);
          setSubscriptionTier(null);
          setSubscriptionPlan(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user?.id) {
          await fetchUserRole(data.session.user.id);
          await fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, subscription_tier, subscription_plan')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setRole(data?.role as CombinedUserRole || 'individual');
      setSubscriptionTier(data?.subscription_tier as SubscriptionTier || 'individual');
      setSubscriptionPlan(data?.subscription_plan as SubscriptionPlan || 'free');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setRole('individual');
      setSubscriptionTier('individual');
      setSubscriptionPlan('free');
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive',
      });
    }
  };

  // Alias for logout for compatibility
  const signOut = logout;

  const register = async (params: RegisterParams) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            first_name: params.firstName,
            last_name: params.lastName,
            role: params.role || 'individual',
            subscription_tier: params.subscriptionTier || 'individual'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created successfully',
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProfile = async (params: ProfileUpdateParams) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: params.firstName,
          last_name: params.lastName,
          job_title: params.jobTitle,
          avatar_url: params.avatarUrl,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update the profile state
      setProfile(prev => ({
        ...prev,
        first_name: params.firstName || prev?.first_name,
        last_name: params.lastName || prev?.last_name,
        job_title: params.jobTitle || prev?.job_title,
        avatar_url: params.avatarUrl || prev?.avatar_url,
      }));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: 'Profile update failed',
        description: error.message || 'An error occurred updating your profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const setUserRole = async (newRole: CombinedUserRole) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setRole(newRole);
      
      toast({
        title: 'Role updated',
        description: `Your role has been updated to ${newRole}`,
      });
      
    } catch (error: any) {
      console.error('Role update error:', error);
      toast({
        title: 'Role update failed',
        description: error.message || 'An error occurred updating your role',
        variant: 'destructive',
      });
    }
  };

  const setUserPlan = async (newPlan: SubscriptionPlan) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: newPlan })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setSubscriptionPlan(newPlan);
      
      toast({
        title: 'Subscription plan updated',
        description: `Your subscription plan has been updated to ${newPlan}`,
      });
      
    } catch (error: any) {
      console.error('Subscription plan update error:', error);
      toast({
        title: 'Subscription plan update failed',
        description: error.message || 'An error occurred updating your subscription plan',
        variant: 'destructive',
      });
    }
  };

  const hasPermission = (requiredPermission: string | string[]) => {
    if (!role) return false;
    
    const userPermissions = rolePermissions[role] || [];
    
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some(permission => userPermissions.includes(permission));
    }
    
    return userPermissions.includes(requiredPermission);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    session,
    loading,
    role,
    profile,
    subscriptionTier,
    subscriptionPlan,
    isAuthenticated,
    hasPermission,
    login,
    logout,
    signOut,
    register,
    updateProfile,
    setUserRole,
    setUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

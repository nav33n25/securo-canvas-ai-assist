import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define user role types based on platform structure
export type UserRole = 'individual' | 'team_member' | 'team_manager' | 'administrator';

// Define subscription plan types
export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise';

// Define a proper interface for the user profile
interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  avatar_url?: string | null;
  job_title?: string | null;
  role?: UserRole;
  subscription_plan?: SubscriptionPlan;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  redirectTo: string | null;
  role: UserRole | null;
  subscriptionPlan: SubscriptionPlan | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (options: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    plan?: SubscriptionPlan;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  setUserPlan: (plan: SubscriptionPlan) => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define role hierarchy for permission checks
const roleHierarchy: Record<UserRole, number> = {
  'individual': 1,
  'team_member': 2,
  'team_manager': 3,
  'administrator': 4
};

// Define allowed roles for each subscription plan
export const planRoles: Record<SubscriptionPlan, UserRole[]> = {
  'free': ['individual'],
  'pro': ['individual', 'team_member'],
  'team': ['individual', 'team_member', 'team_manager'],
  'enterprise': ['individual', 'team_member', 'team_manager', 'administrator']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const navigate = useNavigate();

  // Computed property to check if authenticated
  const isAuthenticated = !!session && !!user;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile information if user is logged in
        if (session?.user) {
          fetchProfile(session.user.id);
          
          // Redirect to dashboard if not already there
          if (window.location.pathname === '/auth') {
            navigate('/dashboard');
          }
        } else {
          setProfile(null);
          setRole(null);
          setSubscriptionPlan(null);
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Profile Error",
          description: "Failed to load your profile information. Please refresh and try again.",
        });
        setLoading(false);
        return;
      }
      
      try {
        // Add email from the user object if available
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          const profileWithEmail = {
            ...(profileData as UserProfile),
            email: data.user.email
          };
          setProfile(profileWithEmail);
          
          // Set user role from profile if available
          if (profileData.role) {
            setRole(profileData.role as UserRole);
          } else {
            // Default to individual if no role is set
            setRole('individual');
            // Update the profile with the default role
            await supabase
              .from('profiles')
              .update({ role: 'individual' })
              .eq('id', userId);
          }
          
          // Set subscription plan from profile if available
          if (profileData.subscription_plan) {
            setSubscriptionPlan(profileData.subscription_plan as SubscriptionPlan);
          } else {
            // Default to free plan if no plan is set
            setSubscriptionPlan('free');
            // Update the profile with the default plan
            await supabase
              .from('profiles')
              .update({ subscription_plan: 'free' })
              .eq('id', userId);
          }
        } else {
          setProfile(profileData as UserProfile);
          
          // Set user role from profile if available
          if (profileData.role) {
            setRole(profileData.role as UserRole);
          } else {
            // Default to individual if no role is set
            setRole('individual');
            // Update the profile with the default role
            await supabase
              .from('profiles')
              .update({ role: 'individual' })
              .eq('id', userId);
          }
          
          // Set subscription plan from profile if available
          if (profileData.subscription_plan) {
            setSubscriptionPlan(profileData.subscription_plan as SubscriptionPlan);
          } else {
            // Default to free plan if no plan is set
            setSubscriptionPlan('free');
            // Update the profile with the default plan
            await supabase
              .from('profiles')
              .update({ subscription_plan: 'free' })
              .eq('id', userId);
          }
        }
      } catch (userError) {
        console.error('Error getting user email:', userError);
        setProfile(profileData as UserProfile);
        
        // Still set the role and plan
        if (profileData.role) {
          setRole(profileData.role as UserRole);
        } else {
          setRole('individual');
        }
        
        if (profileData.subscription_plan) {
          setSubscriptionPlan(profileData.subscription_plan as SubscriptionPlan);
        } else {
          setSubscriptionPlan('free');
        }
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Profile Error",
        description: "Unexpected error while loading profile data.",
      });
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message,
        });
        return;
      }
      
      if (data?.user) {
        // Explicitly fetch the user profile to ensure it's loaded
        await fetchProfile(data.user.id);
        
        // Use navigate directly instead of relying on the effect
        navigate('/dashboard');
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    role = 'individual',
    plan = 'free'
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    plan?: SubscriptionPlan;
  }) => {
    setLoading(true);
    
    try {
      // In development mode, all plans are free
      // No payment processing needed
      
      // Create the user in Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
            subscription_plan: plan
          }
        }
      });

      if (error) throw error;
      
      if (authData.user) {
        // Update the profile with additional information
        await supabase.from('profiles').update({
          first_name: firstName,
          last_name: lastName,
          role,
          subscription_plan: plan
        }).eq('id', authData.user.id);

        // Set the user data
        setUser(authData.user);
        setSession(authData.session);
        
        // Set role and subscription plan
        setRole(role);
        setSubscriptionPlan(plan);
        
        toast({
          title: "Account created successfully",
          description: "Welcome to SecuroCanvas!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have successfully signed out.",
      });
      setRole(null);
      setSubscriptionPlan(null);
      navigate('/auth');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error.message || "Failed to update profile information.",
        });
        throw error;
      }

      setProfile(prev => {
        if (!prev) return null;
        const newProfile = { ...prev, ...data };
        
        // Update role state if role was changed
        if (data.role && data.role !== role) {
          setRole(data.role);
        }
        
        // Update subscription plan state if plan was changed
        if (data.subscription_plan && data.subscription_plan !== subscriptionPlan) {
          setSubscriptionPlan(data.subscription_plan);
        }
        
        return newProfile;
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An unexpected error occurred while updating your profile.",
      });
    }
  };
  
  const setUserRole = async (newRole: UserRole) => {
    if (!user || !subscriptionPlan) return;
    
    // Validate that the role is allowed for the current plan
    if (!planRoles[subscriptionPlan].includes(newRole)) {
      toast({
        variant: "destructive",
        title: "Role change failed",
        description: `The ${newRole.replace('_', ' ')} role is not available on your current plan.`,
      });
      return;
    }
    
    try {
      // Update the role in the database
      await updateProfile({ role: newRole });
      
      // Set the role in state
      setRole(newRole);
      
      toast({
        title: "Role Updated",
        description: `Your role has been updated to ${newRole.replace('_', ' ')}.`,
      });
      
      // Redirect to the dashboard to refresh the view
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  };
  
  const setUserPlan = async (newPlan: SubscriptionPlan) => {
    if (!user) return;
    
    try {
      // If current role is not allowed in the new plan, downgrade to the highest available role
      let updatedRole = role;
      if (role && !planRoles[newPlan].includes(role)) {
        updatedRole = planRoles[newPlan][planRoles[newPlan].length - 1];
      }
      
      // Update the plan in the database
      await updateProfile({ 
        subscription_plan: newPlan,
        role: updatedRole
      });
      
      // Set the plan and potentially new role in state
      setSubscriptionPlan(newPlan);
      if (updatedRole !== role) {
        setRole(updatedRole);
      }
      
      toast({
        title: "Subscription Updated",
        description: `Your subscription has been updated to the ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)} plan.`,
      });
      
      // Redirect to the dashboard to refresh the view
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting user plan:', error);
    }
  };
  
  // Check if user has permission based on their role
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!role) return false;
    
    // If required roles array is empty, allow access
    if (requiredRoles.length === 0) return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.some(requiredRole => {
      // Direct role match
      if (role === requiredRole) return true;
      
      // Administrator has access to everything
      if (role === 'administrator') return true;
      
      // Check role hierarchy - higher roles have access to lower role features
      return roleHierarchy[role] >= roleHierarchy[requiredRole];
    });
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated,
    redirectTo,
    role,
    subscriptionPlan,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setUserRole,
    setUserPlan,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

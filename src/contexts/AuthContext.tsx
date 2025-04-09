
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  LegacyUserRole, 
  legacyToNewRoleMap,
  rolePermissions
} from '@/types/common';

import { 
  UserProfile, 
  UserRole, 
  SubscriptionTier, 
  SubscriptionPlan,
  AuthContextType,
  tierToPlanMap
} from '@/types/auth-types';

import { DetailedUserRole } from '@/types/usoh';
import { useFeatureAccess } from '@/hooks/useSubscriptionFeatures';
import { useProfileManager } from '@/hooks/useProfileManager';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { getRoleCategory, getDetailedRole } from '@/utils/role-utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const navigate = useNavigate();

  // Computed property to check if authenticated
  const isAuthenticated = !!session && !!user;

  // Initialize hooks
  const { hasFeatureAccess } = useFeatureAccess({ user, subscriptionTier });
  const { hasPermission } = useUserPermissions(role);
  const { fetchProfile, updateProfile } = useProfileManager({
    user,
    setProfile,
    setRole,
    setSubscriptionTier,
    setSubscriptionPlan,
    setTeam,
    setLoading
  });
  const { joinTeam, leaveTeam } = useTeamManagement({
    user,
    setProfile,
    setTeam
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile information if user is logged in
        if (session?.user) {
          await fetchProfile(session.user.id);
          
          // Redirect to dashboard if not already there
          if (window.location.pathname === '/auth') {
            navigate('/dashboard');
          }
        } else {
          setProfile(null);
          setRole(null);
          setSubscriptionTier(null);
          setSubscriptionPlan(null);
          setTeam(null);
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
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
    role = 'individual_basic',
    subscriptionPlan = 'free',
    subscriptionTier = 'individual'
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole | LegacyUserRole;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionTier?: SubscriptionTier;
  }) => {
    try {
      setLoading(true);
      
      // Convert legacy role if needed
      let processedRole = role;
      if (Object.keys(legacyToNewRoleMap).includes(role as string)) {
        processedRole = legacyToNewRoleMap[role as LegacyUserRole];
      }
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        return;
      }

      if (data?.user) {
        // Create profile with appropriate role and subscription data
        try {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            role: processedRole,
            subscription_plan: subscriptionPlan,
            subscription_tier: subscriptionTier,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
  
          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast({
              variant: "destructive",
              title: "Profile creation failed",
              description: profileError.message,
            });
            return;
          }
        } catch (e) {
          console.error('Error upserting profile:', e);
          toast({
            variant: "destructive",
            title: "Profile creation failed",
            description: "Failed to create user profile",
          });
          return;
        }

        // Set context state
        setRole(processedRole as UserRole);
        setSubscriptionPlan(subscriptionPlan);
        setSubscriptionTier(subscriptionTier);
        setProfile({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: processedRole as UserRole,
          subscription_plan: subscriptionPlan,
          subscription_tier: subscriptionTier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "Account created",
          description: "Your account has been successfully created.",
        });
        
        // Log activity
        try {
          await supabase.rpc('log_security_audit', {
            p_user_id: data.user.id,
            p_action: 'CREATE',
            p_resource_type: 'user',
            p_resource_id: data.user.id,
            p_details: JSON.stringify({ 
              subscription_plan: subscriptionPlan, 
              subscription_tier: subscriptionTier, 
              role: processedRole 
            })
          });
        } catch (e) {
          console.error('Error logging audit activity:', e);
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign out failed",
          description: error.message,
        });
        return;
      }
      
      // Clear state
      setUser(null);
      setProfile(null);
      setRole(null);
      setSubscriptionTier(null);
      setSubscriptionPlan(null);
      setTeam(null);
      
      // Navigate to auth page
      navigate('/auth');
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const setUserRole = async (newRole: UserRole) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update your role.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Update the profile
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            role: newRole,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
  
        if (error) {
          toast({
            variant: "destructive",
            title: "Role update failed",
            description: error.message,
          });
          return;
        }
      } catch (e) {
        console.error('Error updating role:', e);
        toast({
          variant: "destructive",
          title: "Role update failed",
          description: "Failed to update role",
        });
        return;
      }

      // Update local state
      setRole(newRole);
      setProfile(prev => prev ? { ...prev, role: newRole } : null);

      toast({
        title: "Role updated",
        description: `Your role has been updated to ${newRole.replace('_', ' ')}.`,
      });
    } catch (error: any) {
      console.error('Role update error:', error);
      toast({
        variant: "destructive",
        title: "Role update failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const setUserPlan = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update your subscription plan.",
      });
      return;
    }

    try {
      // Map plan to tier for consistency
      let tier: SubscriptionTier = 'individual';
      switch (plan) {
        case 'pro':
          tier = 'professional';
          break;
        case 'team':
          tier = 'smb';
          break;
        case 'enterprise':
          tier = 'enterprise';
          break;
      }
      
      // Update both plan and tier
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_plan: plan,
            subscription_tier: tier,
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id);
  
        if (error) {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: error.message,
          });
          return;
        }
      } catch (e) {
        console.error('Error updating subscription plan:', e);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update subscription plan",
        });
        return;
      }

      // Update local state
      setSubscriptionPlan(plan);
      setSubscriptionTier(tier);
      setProfile(prev => prev ? { 
        ...prev, 
        subscription_plan: plan,
        subscription_tier: tier
      } : null);

      toast({
        title: "Subscription updated",
        description: `Your subscription has been updated to ${plan}.`,
      });
    } catch (error: any) {
      console.error('Error updating subscription plan:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update subscription plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const setUserSubscriptionTier = async (tier: SubscriptionTier) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update your subscription tier.",
      });
      return;
    }

    try {
      // Map tier to plan for backward compatibility
      const plan = tierToPlanMap[tier];
      
      // Update both tier and plan
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            subscription_tier: tier,
            subscription_plan: plan,
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id);
  
        if (error) {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: error.message,
          });
          return;
        }
      } catch (e) {
        console.error('Error updating subscription tier:', e);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Failed to update subscription tier",
        });
        return;
      }

      // Update local state
      setSubscriptionTier(tier);
      setSubscriptionPlan(plan);
      setProfile(prev => prev ? { 
        ...prev, 
        subscription_tier: tier,
        subscription_plan: plan
      } : null);

      toast({
        title: "Subscription updated",
        description: `Your subscription has been updated to ${tier}.`,
      });
    } catch (error: any) {
      console.error('Error updating subscription tier:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update subscription tier.",
      });
    }
  };

  // Check if user can use a specific feature
  const canUseFeature = async (featureKey: string): Promise<boolean> => {
    return await hasFeatureAccess(featureKey);
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      isAuthenticated,
      redirectTo,
      role,
      subscriptionPlan,
      subscriptionTier,
      team,
      hasPermission,
      canUseFeature,
      signIn,
      signUp,
      signOut,
      updateProfile,
      setUserRole,
      setUserPlan,
      setUserSubscriptionTier,
      joinTeam,
      leaveTeam,
      getRoleCategory: () => getRoleCategory(role),
      getDetailedRole: () => getDetailedRole(role, subscriptionTier)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export types for use in other files
export type { UserRole, SubscriptionPlan, SubscriptionTier, UserProfile };

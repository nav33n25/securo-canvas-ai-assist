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
  BasicUserRole, 
  DetailedUserRole, 
  SubscriptionTier,
  CombinedUserRole
} from '@/types/usoh';

// Update the UserRole type to use the combined user role
export type UserRole = CombinedUserRole;

// Export subscription plan type (for backward compatibility)
export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise';

// Update the planRoles to include the detailed roles
export const planRoles: Record<SubscriptionPlan, CombinedUserRole[]> = {
  'free': ['individual', 'individual_basic'],
  'pro': ['individual', 'individual_professional'],
  'team': [
    'team_member', 'team_analyst', 'team_hunter', 'team_researcher',
    'team_red', 'team_blue', 'team_lead'
  ],
  'enterprise': [
    'team_member', 'team_manager', 'administrator',
    'team_analyst', 'team_hunter', 'team_researcher',
    'team_red', 'team_blue', 'team_lead',
    'security_manager', 'ciso_director',
    'platform_admin', 'knowledge_admin'
  ]
};

// Add a function to check feature access
export const useFeatureAccess = () => {
  const { subscriptionPlan, user } = useAuth();
  
  const hasFeatureAccess = async (featureKey: string): Promise<boolean> => {
    if (!user || !subscriptionPlan) {
      return false;
    }

    try {
      // Check if feature is enabled based on subscription plan
      // This is a simplified check - in a real application, 
      // you would query a feature table in your database
      const featureEnabled = subscriptionPlan !== 'free';
      return featureEnabled;
    } catch (error) {
      console.error('Error in hasFeatureAccess:', error);
      return false;
    }
  };

  return { hasFeatureAccess };
};

// Update the user profile interface
interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  avatar_url?: string | null;
  job_title?: string | null;
  role?: UserRole;
  subscription_plan?: SubscriptionPlan;
  subscription_tier?: SubscriptionTier;
  team_id?: string;
  expertise_areas?: string[];
  bio?: string;
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
  subscriptionTier: SubscriptionTier | null;
  team: string | null;
  hasPermission: (requiredPermissions: string[]) => boolean;
  canUseFeature: (featureKey: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (options: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole | LegacyUserRole;
    subscriptionPlan?: SubscriptionPlan;
    subscriptionTier?: SubscriptionTier;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  setUserPlan: (plan: SubscriptionPlan) => Promise<void>;
  setUserSubscriptionTier: (tier: SubscriptionTier) => Promise<void>;
  joinTeam: (teamId: string, role?: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  getRoleCategory: () => 'individual' | 'team' | 'management' | 'administrative';
  getDetailedRole: () => DetailedUserRole | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define subscription tier hierarchy
const subscriptionTierHierarchy: Record<SubscriptionTier, number> = {
  'individual': 1,
  'professional': 2,
  'smb': 3,
  'enterprise': 4
};

// Map subscription tier to subscription plan for backward compatibility
const tierToPlanMap: Record<SubscriptionTier, SubscriptionPlan> = {
  'individual': 'free',
  'professional': 'pro',
  'smb': 'team',
  'enterprise': 'enterprise'
};

// Define role hierarchy based on categories
const roleHierarchy: Record<string, number> = {
  // Basic roles
  'individual': 5,
  'team_member': 15,
  'team_manager': 65,
  'administrator': 95,
  
  // Individual roles
  'individual_basic': 10,
  'individual_professional': 20,
  
  // Team roles
  'team_analyst': 30,
  'team_hunter': 35,
  'team_researcher': 40,
  'team_red': 45,
  'team_blue': 50,
  'team_lead': 60,
  
  // Management roles
  'security_manager': 70,
  'ciso_director': 80,
  
  // Administrative roles
  'knowledge_admin': 90,
  'platform_admin': 100
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const navigate = useNavigate();

  // Computed property to check if authenticated
  const isAuthenticated = !!session && !!user;

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
          setSubscriptionPlan(null);
          setSubscriptionTier(null);
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

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch user profile
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
      
      // Fetch team membership if applicable
      if (profileData && profileData.team_id) {
        try {
          // Only attempt to fetch team if there's a team_id
          const { data: teamData } = await supabase
            .rpc('get_team_name', { team_id: profileData.team_id });
            
          if (teamData) {
            setTeam(teamData);
          } else {
            setTeam(null);
          }
        } catch (teamError) {
          console.error('Error fetching team:', teamError);
          setTeam(null);
        }
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
          
          // Handle role and subscription tier
          handleUserRoleAndPlan(profileWithEmail, userId);
        } else {
          setProfile(profileData as UserProfile);
          
          // Handle role and subscription tier
          handleUserRoleAndPlan(profileData, userId);
        }
      } catch (userError) {
        console.error('Error getting user email:', userError);
        setProfile(profileData as UserProfile);
        
        // Handle role and subscription tier even without email
        handleUserRoleAndPlan(profileData, userId);
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
  
  // Helper to handle user role and subscription tier/plan
  const handleUserRoleAndPlan = async (profileData: any, userId: string) => {
    // Process role - handle legacy roles as well
    if (profileData.role) {
      if (Object.keys(legacyToNewRoleMap).includes(profileData.role as string)) {
        // Convert legacy role to new role
        const newRole = legacyToNewRoleMap[profileData.role as LegacyUserRole];
        setRole(newRole);
        
        // Update profile with new role format
        try {
          await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);
        } catch (e) {
          console.error('Error updating role:', e);
        }
      } else {
        // Set directly if already using new role format
        setRole(profileData.role as UserRole);
      }
    } else {
      // Default to individual_basic if no role is set
      setRole('individual_basic');
      
      // Update the profile with the default role
      try {
        await supabase
          .from('profiles')
          .update({ role: 'individual_basic' })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default role:', e);
      }
    }
    
    // Process subscription plan (older field)
    if (profileData.subscription_plan) {
      setSubscriptionPlan(profileData.subscription_plan as SubscriptionPlan);
    } else {
      // Default to free if no subscription plan is set
      setSubscriptionPlan('free');
      
      // Update the profile with the default subscription plan
      try {
        await supabase
          .from('profiles')
          .update({ subscription_plan: 'free' })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default subscription plan:', e);
      }
    }
    
    // Process subscription tier (newer field)
    if (profileData.subscription_tier) {
      setSubscriptionTier(profileData.subscription_tier as SubscriptionTier);
      // Also update the plan for backward compatibility
      setSubscriptionPlan(tierToPlanMap[profileData.subscription_tier as SubscriptionTier]);
    } else if (profileData.subscription_plan) {
      // If we have a plan but no tier, set a default tier based on the plan
      let tier: SubscriptionTier = 'individual';
      switch (profileData.subscription_plan) {
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
      setSubscriptionTier(tier);
      
      // Update the profile with the default subscription tier
      try {
        await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default subscription tier:', e);
      }
    } else {
      // No plan or tier, set defaults
      setSubscriptionTier('individual');
      setSubscriptionPlan('free');
      
      try {
        await supabase
          .from('profiles')
          .update({ 
            subscription_tier: 'individual',
            subscription_plan: 'free'
          })
          .eq('id', userId);
      } catch (e) {
        console.error('Error setting default subscription:', e);
      }
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
      setSubscriptionPlan(null);
      setSubscriptionTier(null);
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

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Prepare update data, removing any undefined fields
      const updateData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      // Add updated timestamp
      updateData.updated_at = new Date().toISOString();
      
      // Update the profile
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
  
        if (error) {
          toast({
            variant: "destructive",
            title: "Profile update failed",
            description: error.message,
          });
          return;
        }
      } catch (e) {
        console.error('Error updating profile:', e);
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: "Failed to update profile",
        });
        return;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      // Update role if it's being changed
      if (data.role) {
        // Convert legacy role if needed
        let processedRole = data.role;
        if (Object.keys(legacyToNewRoleMap).includes(data.role as string)) {
          processedRole = legacyToNewRoleMap[data.role as LegacyUserRole];
        }
        setRole(processedRole as UserRole);
      }
      
      // Update subscription plan if it's being changed
      if (data.subscription_plan) {
        setSubscriptionPlan(data.subscription_plan);
      }
      
      // Update subscription tier if it's being changed
      if (data.subscription_tier) {
        setSubscriptionTier(data.subscription_tier);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Profile update failed",
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

  const joinTeam = async (teamId: string, role = 'member') => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to join a team.",
      });
      return;
    }

    try {
      // Check if already a member using RPC instead of direct table access
      try {
        const { data: isMember } = await supabase
          .rpc('check_team_membership', { 
            p_user_id: user.id, 
            p_team_id: teamId 
          });
          
        if (isMember) {
          toast({
            title: "Already a member",
            description: "You are already a member of this team.",
          });
          return;
        }
      } catch (e) {
        console.error('Error checking team membership:', e);
      }

      // Join the team using RPC
      try {
        await supabase.rpc('join_team', { 
          p_user_id: user.id, 
          p_team_id: teamId,
          p_role: role
        });
      } catch (e) {
        console.error('Error joining team:', e);
        toast({
          variant: "destructive",
          title: "Join failed",
          description: "Failed to join team",
        });
        return;
      }

      // Update profile with team ID
      try {
        await supabase
          .rpc('update_user_team', { 
            p_user_id: user.id, 
            p_team_id: teamId 
          });
      } catch (e) {
        console.error('Error updating user team:', e);
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, team_id: teamId } : null);
      
      // Get team name
      try {
        const { data: teamName } = await supabase
          .rpc('get_team_name', { team_id: teamId });
          
        if (teamName) {
          setTeam(teamName);
        }
      } catch (e) {
        console.error('Error getting team name:', e);
      }

      toast({
        title: "Team joined",
        description: "You have successfully joined the team.",
      });
    } catch (error: any) {
      console.error('Error joining team:', error);
      toast({
        variant: "destructive",
        title: "Join failed",
        description: error.message || "Failed to join team.",
      });
    }
  };

  const leaveTeam = async (teamId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to leave a team.",
      });
      return;
    }

    try {
      // Leave team using RPC
      try {
        await supabase.rpc('leave_team', { 
          p_user_id: user.id, 
          p_team_id: teamId 
        });
      } catch (e) {
        console.error('Error leaving team:', e);
        toast({
          variant: "destructive",
          title: "Leave failed",
          description: "Failed to leave team",
        });
        return;
      }

      // Update profile to remove team ID if it matches
      try {
        await supabase.rpc('remove_user_team', { 
          p_user_id: user.id, 
          p_team_id: teamId 
        });
      } catch (e) {
        console.error('Error removing team from user:', e);
      }

      // Update local state
      setTeam(null);
      setProfile(prev => prev && prev.team_id === teamId ? 
        { ...prev, team_id: undefined } : 
        prev
      );

      toast({
        title: "Team left",
        description: "You have successfully left the team.",
      });
    } catch (error: any) {
      console.error('Error leaving team:', error);
      toast({
        variant: "destructive",
        title: "Leave failed",
        description: error.message || "Failed to leave team.",
      });
    }
  };

  // Function to check if user has a specific permission based on role
  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!role) return false;
    
    // Get the permissions for the user's role
    const userPermissions = rolePermissions[role] || [];
    
    // Check if the user has all required permissions
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  };
  
  // Function to check subscription feature access
  const canUseFeature = async (featureKey: string): Promise<boolean> => {
    if (!subscriptionPlan) return false;
    
    try {
      // Simple implementation - free tier can't access premium features
      if (subscriptionPlan === 'free' && featureKey.startsWith('premium_')) {
        return false;
      }
      
      // Pro tier can access most features except enterprise ones
      if (subscriptionPlan === 'pro' && featureKey.startsWith('enterprise_')) {
        return false;
      }
      
      // Team tier can access most features except some enterprise ones
      if (subscriptionPlan === 'team' && 
          (featureKey.startsWith('enterprise_advanced_') || 
           featureKey === 'enterprise_unlimited_users')) {
        return false;
      }
      
      // Enterprise has access to all features
      return true;
    } catch (error) {
      console.error('Feature check error:', error);
      return false;
    }
  };
  
  // Function to get role category
  const getRoleCategory = (): 'individual' | 'team' | 'management' | 'administrative' => {
    if (!role) return 'individual';
    
    if (role.startsWith('individual_'))

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

// Update the planRoles to include the detailed roles
export const planRoles: Record<SubscriptionTier, CombinedUserRole[]> = {
  'individual': ['individual', 'individual_basic'],
  'professional': ['individual', 'individual_professional'],
  'smb': [
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
  const { subscriptionTier, user } = useAuth();
  
  const hasFeatureAccess = async (featureKey: string): Promise<boolean> => {
    if (!user || !subscriptionTier) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('subscription_features')
        .select('is_enabled, max_usage')
        .eq('subscription_tier', subscriptionTier)
        .eq('feature_key', featureKey)
        .single();

      if (error || !data) {
        console.error('Error checking feature access:', error);
        return false;
      }

      // Feature is enabled in general
      if (!data.is_enabled) {
        return false;
      }

      // If no usage limit, access is granted
      if (data.max_usage === null) {
        return true;
      }

      // Check usage against limit
      // For this example, we're not implementing the actual usage tracking
      // In a real implementation, you would query a usage table
      return true;
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
  role?: CombinedUserRole;
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
  role: CombinedUserRole | null;
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
    role?: CombinedUserRole | LegacyUserRole;
    subscriptionTier?: SubscriptionTier;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserRole: (role: CombinedUserRole) => Promise<void>;
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
  const [role, setRole] = useState<CombinedUserRole | null>(null);
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
      if (profileData.team_id) {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('id, name')
          .eq('id', profileData.team_id)
          .single();
          
        if (!teamError && teamData) {
          setTeam(teamData.name);
        } else {
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
          handleUserRoleAndTier(profileWithEmail, userId);
        } else {
          setProfile(profileData as UserProfile);
          
          // Handle role and subscription tier
          handleUserRoleAndTier(profileData, userId);
        }
      } catch (userError) {
        console.error('Error getting user email:', userError);
        setProfile(profileData as UserProfile);
        
        // Handle role and subscription tier even without email
        handleUserRoleAndTier(profileData, userId);
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
  
  // Helper to handle user role and subscription tier
  const handleUserRoleAndTier = async (profileData: any, userId: string) => {
    // Process role - handle legacy roles as well
    if (profileData.role) {
      if (Object.keys(legacyToNewRoleMap).includes(profileData.role as string)) {
        // Convert legacy role to new role
        const newRole = legacyToNewRoleMap[profileData.role as LegacyUserRole];
        setRole(newRole);
        
        // Update profile with new role format
        await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);
      } else {
        // Set directly if already using new role format
        setRole(profileData.role as CombinedUserRole);
      }
    } else {
      // Default to individual_basic if no role is set
      setRole('individual_basic');
      
      // Update the profile with the default role
      await supabase
        .from('profiles')
        .update({ role: 'individual_basic' })
        .eq('id', userId);
    }
    
    // Process subscription tier
    if (profileData.subscription_tier) {
      setSubscriptionTier(profileData.subscription_tier as SubscriptionTier);
    } else {
      // Default to individual if no subscription tier is set
      setSubscriptionTier('individual');
      
      // Update the profile with the default subscription tier
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'individual' })
        .eq('id', userId);
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
    subscriptionTier = 'individual'
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: CombinedUserRole | LegacyUserRole;
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
        // Create profile with appropriate role and subscription tier
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          role: processedRole,
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

        // Set context state
        setRole(processedRole as CombinedUserRole);
        setSubscriptionTier(subscriptionTier);
        setProfile({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          role: processedRole as CombinedUserRole,
          subscription_tier: subscriptionTier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "Account created",
          description: "Your account has been successfully created.",
        });
        
        // Log activity
        await supabase.from('security_audit_log').insert({
          user_id: data.user.id,
          action: 'CREATE',
          resource_type: 'user',
          resource_id: data.user.id,
          details: { subscription_tier: subscriptionTier, role: processedRole }
        });
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
      
      // Update the profile
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: error.message,
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
        setRole(processedRole as CombinedUserRole);
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

  const setUserRole = async (newRole: CombinedUserRole) => {
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
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', user.id);

      if (error) throw error;

      setSubscriptionTier(tier);

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
      // Check if already a member
      const { data: existingMembership, error: checkError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingMembership) {
        toast({
          title: "Already a member",
          description: "You are already a member of this team.",
        });
        return;
      }

      // Join the team
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: role
        });

      if (error) throw error;

      // Update profile with team ID
      await supabase
        .from('profiles')
        .update({ team_id: teamId })
        .eq('id', user.id);

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
      // Remove team membership
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update profile to remove team ID if it matches
      await supabase
        .from('profiles')
        .update({ team_id: null })
        .eq('id', user.id)
        .eq('team_id', teamId);

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
    if (!subscriptionTier) return false;
    
    try {
      // Query the subscription_features table
      const { data, error } = await supabase
        .from('subscription_features')
        .select('is_enabled, max_usage')
        .eq('subscription_tier', subscriptionTier)
        .eq('feature_key', featureKey)
        .single();
        
      if (error || !data) {
        return false;
      }
      
      // Check if feature is enabled
      if (!data.is_enabled) {
        return false;
      }
      
      // If there's a usage limit, we'd need to check usage analytics
      // For now, just return true if enabled
      return true;
    } catch (error) {
      console.error('Feature check error:', error);
      return false;
    }
  };
  
  // Function to get role category
  const getRoleCategory = (): 'individual' | 'team' | 'management' | 'administrative' => {
    if (!role) return 'individual';
    
    if (role.startsWith('individual_')) {
      return 'individual';
    } else if (role.startsWith('team_')) {
      return 'team';
    } else if (role === 'security_manager' || role === 'ciso_director') {
      return 'management';
    } else {
      return 'administrative';
    }
  };

  // Function to get the detailed role
  const getDetailedRole = (): DetailedUserRole | null => {
    if (!role) return null;
    
    // If the role is already a detailed role, return it
    if (role !== 'individual' && 
        role !== 'team_member' && 
        role !== 'team_manager' && 
        role !== 'administrator') {
      return role as DetailedUserRole;
    }
    
    // Otherwise map from basic role to detailed role based on subscription tier
    if (role === 'individual') {
      return subscriptionTier === 'professional' ? 'individual_professional' : 'individual_basic';
    }
    
    // Default fallbacks for other roles
    return null;
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
      subscriptionTier,
      team,
      hasPermission,
      canUseFeature,
      signIn,
      signUp,
      signOut,
      updateProfile,
      setUserRole,
      setUserSubscriptionTier,
      joinTeam,
      leaveTeam,
      getRoleCategory,
      getDetailedRole
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
export type { CombinedUserRole as UserRole, SubscriptionTier };

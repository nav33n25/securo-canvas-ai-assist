
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole, SubscriptionTier, AuthContextType } from '@/types/auth-types';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useFeatureAccess } from '@/hooks/useSubscriptionFeatures';
import { useProfileManager } from '@/hooks/useProfileManager';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { getRoleCategory, getDetailedRole } from '@/utils/role-utils';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for auth data
  const [user, setUser] = useState(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [team, setTeam] = useState<string | null>(null);

  // Custom hooks for various functionality
  const { hasPermission } = useUserPermissions(role);
  const { hasFeatureAccess } = useFeatureAccess({ user, subscriptionTier });
  const { updateProfile, setUserRole, setUserSubscriptionTier } = useProfileManager({ 
    user, 
    setProfile, 
    setRole, 
    setSubscriptionTier 
  });
  const { joinTeam, leaveTeam } = useTeamManagement({ user, setProfile, setTeam });
  
  // Check feature access
  const canUseFeature = async (featureKey: string) => {
    return await hasFeatureAccess(featureKey);
  };

  // Authentication methods
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (options: { 
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role?: UserRole,
    subscriptionTier?: SubscriptionTier
  }) => {
    try {
      // Sign up the user
      const { error } = await supabase.auth.signUp({
        email: options.email,
        password: options.password,
        options: {
          data: {
            first_name: options.firstName,
            last_name: options.lastName,
            role: options.role || 'individual',
            subscription_tier: options.subscriptionTier || 'individual'
          }
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear state
      setUser(null);
      setProfile(null);
      setSession(null);
      setRole(null);
      setSubscriptionTier(null);
      setTeam(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Load user profile and session on mount and auth state change
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Load profile when session changes
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setSubscriptionTier(null);
          setTeam(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Load profile for existing session
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setRole(data.role || 'individual');
      setSubscriptionTier(data.subscription_tier || 'individual');
      
      // Look up team name if team_id exists
      if (data.team_id) {
        try {
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('name')
            .eq('id', data.team_id)
            .single();
            
          if (teamError) throw teamError;
          
          if (teamData) {
            setTeam(teamData.name);
          }
        } catch (err) {
          console.error('Error loading team:', err);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate if user is authenticated
  const isAuthenticated = !!user && !!profile;

  // Get role category
  const getRoleCategoryFn = useCallback(() => {
    return getRoleCategory(role);
  }, [role]);
  
  // Get detailed role
  const getDetailedRoleFn = useCallback(() => {
    return getDetailedRole(role, subscriptionTier);
  }, [role, subscriptionTier]);

  // Compute subscription plan from tier for backward compatibility
  const subscriptionPlan = subscriptionTier ? 
    subscriptionTier === 'individual' ? 'free' : 
    subscriptionTier === 'professional' ? 'pro' :
    subscriptionTier === 'smb' ? 'team' : 'enterprise' 
    : null;

  // Context value
  const contextValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isAuthenticated,
    redirectTo,
    role,
    subscriptionTier,
    subscriptionPlan,
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
    getRoleCategory: getRoleCategoryFn,
    getDetailedRole: getDetailedRoleFn
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export for compatibility
export { UserRole, SubscriptionTier };

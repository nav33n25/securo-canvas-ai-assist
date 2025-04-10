
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import and re-export the UserRole type
import { 
  UserRole, 
  SubscriptionPlan, 
  CombinedUserRole, 
  SubscriptionTier,
  rolePermissions
} from '@/types/auth-types';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Re-export for backward compatibility
export type { UserRole, SubscriptionPlan };

// AuthContext type definition
export interface AuthContextType {
  user: any | null;
  profile: any | null;
  role: UserRole | null;
  detailedRole: CombinedUserRole | null;
  subscriptionTier: SubscriptionTier | null;
  subscriptionPlan: SubscriptionPlan | null; // For backward compatibility
  loading: boolean;
  isAuthenticated: boolean;
  team: any | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
  register: (userData: RegisterUserData) => Promise<any>;
  updateProfile: (data: Partial<any>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  setDetailedRole: (role: CombinedUserRole) => Promise<void>;
  setSubscriptionTier: (tier: SubscriptionTier) => Promise<void>;
  setUserPlan: (plan: SubscriptionPlan) => Promise<void>; // For backward compatibility
  hasPermission: (permissions: string | string[]) => boolean;
  refreshUserData: () => Promise<void>;
  signIn?: (provider: string) => Promise<void>; // Added for Auth.tsx
  signUp?: (data: any) => Promise<any>; // Added for Auth.tsx
  redirectTo?: string; // Added for Auth.tsx
}

// User registration interface
interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole | CombinedUserRole;
  subscriptionTier?: SubscriptionTier;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component implementation
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [detailedRole, setDetailedRole] = useState<CombinedUserRole | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [team, setTeam] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchProfile(session.user.id);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          // Skip initial session event
          return;
        }
        
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
          setDetailedRole(null);
          setSubscriptionTier(null);
          setSubscriptionPlan(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);
      
      // Set legacy role for backward compatibility
      const legacyRole = profileData?.role;
      if (legacyRole) {
        const newRole = (legacyRole === 'admin') ? 'administrator' : 'individual';
        setRole(newRole as UserRole);
      }
      
      // Set detailed role
      if (profileData?.combined_role) {
        setDetailedRole(profileData.combined_role as CombinedUserRole);
      }
      
      // Set subscription tier
      if (profileData?.subscription_tier) {
        setSubscriptionTier(profileData.subscription_tier as SubscriptionTier);
      }

      // Set subscription plan for backward compatibility
      if (profileData?.subscription_plan) {
        setSubscriptionPlan(profileData.subscription_plan as SubscriptionPlan);
      }

      // Fetch team data if applicable
      if (profileData?.team_id) {
        try {
          const { data: teamData } = await supabase
            .from('teams')
            .select('*')
            .eq('id', profileData.team_id)
            .single();

          if (teamData) {
            setTeam({
              id: teamData.id,
              name: teamData.name,
              ...teamData
            });
          }
        } catch (teamError) {
          console.error('Error fetching team:', teamError);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setIsAuthenticated(true);
      setUser(data.user);
      await fetchProfile(data.user?.id as string);
      navigate('/dashboard');
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterUserData) => {
    try {
      setLoading(true);
      const { email, password, firstName, lastName, role: initialRole, subscriptionTier: initialTier } = userData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: initialRole || 'user',
            combined_role: initialRole || 'individual_basic',
            subscription_tier: initialTier || 'free'
          }
        }
      });

      if (error) {
        throw error;
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: initialRole || 'user',
            combined_role: initialRole || 'individual_basic',
            subscription_tier: initialTier || 'free'
          });

        if (profileError) {
          throw profileError;
        }
      }

      setIsAuthenticated(true);
      setUser(data.user);
      if (data.user) {
        await fetchProfile(data.user.id);
      }
      navigate('/dashboard');
      return data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRole(null);
      setDetailedRole(null);
      setSubscriptionTier(null);
      setSubscriptionPlan(null);
      setIsAuthenticated(false);
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<any>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await fetchProfile(user?.id as string);
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setUserRole = async (newRole: UserRole) => {
    try {
      setLoading(true);
      setRole(newRole);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await fetchProfile(user?.id as string);
    } catch (error) {
      console.error('Set user role failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const handleDetailedRoleChange = async (newDetailedRole: CombinedUserRole) => {
    try {
      setLoading(true);
      setDetailedRole(newDetailedRole);

      const { error } = await supabase
        .from('profiles')
        .update({ combined_role: newDetailedRole })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await fetchProfile(user?.id as string);
    } catch (error) {
      console.error('Set detailed role failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubscriptionTierChange = async (newTier: SubscriptionTier) => {
    try {
      setLoading(true);
      setSubscriptionTier(newTier);

      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: newTier })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await fetchProfile(user?.id as string);
    } catch (error) {
      console.error('Set subscription tier failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUserPlanChange = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);
      setSubscriptionPlan(plan);

      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: plan })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await fetchProfile(user?.id as string);
    } catch (error) {
      console.error('Set user plan failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissions: string | string[]): boolean => {
    if (!detailedRole) return false;

    const currentRolePermissions = rolePermissions[detailedRole] || [];

    if (typeof permissions === 'string') {
      return currentRolePermissions.includes(permissions);
    } else {
      return permissions.every(permission => currentRolePermissions.includes(permission));
    }
  };

  const refreshUserData = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    role,
    detailedRole,
    subscriptionTier,
    subscriptionPlan,
    loading,
    isAuthenticated,
    team,
    login,
    logout,
    signOut: logout, // Alias for logout
    register,
    updateProfile,
    setUserRole,
    setDetailedRole: handleDetailedRoleChange,
    setSubscriptionTier: handleSubscriptionTierChange,
    setUserPlan: handleUserPlanChange,
    hasPermission,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

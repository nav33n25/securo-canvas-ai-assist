import React, { createContext, useContext, useState, useEffect } from 'react';
// Import and re-export the UserRole type
import { UserRole, SubscriptionPlan, CombinedUserRole, SubscriptionTier } from '@/types/auth-types';
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
  loading: boolean;
  isAuthenticated: boolean;
  team: any | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (userData: RegisterUserData) => Promise<any>;
  updateProfile: (data: Partial<any>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  setDetailedRole: (role: CombinedUserRole) => Promise<void>;
  setSubscriptionTier: (tier: SubscriptionTier) => Promise<void>;
  hasPermission: (permissions: string | string[]) => boolean;
  refreshUserData: () => Promise<void>;
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
        setRole(newRole);
      }
      
      // Set detailed role
      if (profileData?.combined_role) {
        setDetailedRole(profileData.combined_role);
      }
      
      // Set subscription tier
      if (profileData?.subscription_tier) {
        setSubscriptionTier(profileData.subscription_tier);
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
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
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

      setIsAuthenticated(true);
      setUser(data.user);
      await fetchProfile(data.user?.id as string);
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
      
      // Map legacy role to combined role
      // const combinedRole = userRoleMap[newRole][0];
      // setDetailedRole(combinedRole);

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
  
  const setDetailedRole = async (newDetailedRole: CombinedUserRole) => {
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
  
  const setSubscriptionTier = async (newTier: SubscriptionTier) => {
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

  const hasPermission = (permissions: string | string[]): boolean => {
    if (!detailedRole) return false;

    const rolePermissionsList = (detailedRole && role) ? AuthContextType.rolePermissions[detailedRole] : [];

    if (typeof permissions === 'string') {
      return rolePermissionsList.includes(permissions);
    } else {
      return permissions.every(permission => rolePermissionsList.includes(permission));
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
    loading,
    isAuthenticated,
    team,
    login,
    logout,
    register,
    updateProfile,
    setUserRole,
    setDetailedRole,
    setSubscriptionTier,
    hasPermission,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.rolePermissions = {
  'individual': [
    'view_own_documents',
    'edit_own_documents',
    'use_basic_templates',
    'create_personal_tickets',
    'use_basic_ai'
  ],
  'individual_basic': [
    'view_own_documents',
    'edit_own_documents',
    'use_basic_templates',
    'create_personal_tickets',
    'use_basic_ai'
  ],
  'individual_professional': [
    'view_own_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_personal_tickets',
    'use_enhanced_ai'
  ],
  'team_member': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai'
  ],
  'team_analyst': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai',
    'view_analytics_data'
  ],
  'team_hunter': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai',
    'access_security_tools'
  ],
  'team_researcher': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai',
    'access_intel_database'
  ],
  'team_red': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai',
    'access_security_tools',
    'perform_security_testing'
  ],
  'team_blue': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai',
    'access_security_tools',
    'manage_security_alerts'
  ],
  'team_lead': [
    'view_team_documents',
    'edit_team_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai',
    'access_security_tools',
    'manage_team_projects'
  ],
  'team_manager': [
    'view_team_documents',
    'edit_team_documents',
    'approve_team_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'manage_team_tickets',
    'view_security_analytics',
    'use_enhanced_ai',
    'manage_team_members',
    'view_compliance_data'
  ],
  'security_manager': [
    'view_team_documents',
    'edit_team_documents',
    'approve_team_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'manage_team_tickets',
    'view_security_analytics',
    'use_enhanced_ai',
    'manage_team_members',
    'view_compliance_data',
    'manage_security_policies'
  ],
  'ciso_director': [
    'view_all_documents',
    'edit_team_documents',
    'approve_all_documents',
    'use_advanced_templates',
    'manage_all_tickets',
    'view_all_analytics',
    'use_enhanced_ai',
    'manage_users',
    'manage_teams',
    'manage_security_program'
  ],
  'administrator': [
    'view_all_documents',
    'edit_all_documents',
    'approve_all_documents',
    'manage_templates',
    'manage_all_tickets',
    'view_all_analytics',
    'use_enhanced_ai',
    'manage_users',
    'manage_teams',
    'manage_platform_settings',
    'view_audit_logs'
  ],
  'platform_admin': [
    'view_all_documents',
    'edit_all_documents',
    'approve_all_documents',
    'manage_templates',
    'manage_all_tickets',
    'view_all_analytics',
    'use_enhanced_ai',
    'manage_users',
    'manage_teams',
    'manage_platform_settings',
    'view_audit_logs',
    'manage_integrations'
  ],
  'knowledge_admin': [
    'view_all_documents',
    'edit_all_documents',
    'approve_all_documents',
    'manage_templates',
    'manage_knowledge_base',
    'use_enhanced_ai',
    'manage_document_structure',
    'control_document_access'
  ]
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

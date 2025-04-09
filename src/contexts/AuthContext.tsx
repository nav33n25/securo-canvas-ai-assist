import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define user role types based on platform structure
export type UserRole = 'individual' | 'team_member' | 'team_manager' | 'administrator';

// Define a proper interface for the user profile
interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string; // Making email optional since it might come from user object
  avatar_url?: string | null;
  job_title?: string | null;
  role?: UserRole;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  role: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile information if user is logged in
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
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
          const profileWithEmail: UserProfile = {
            ...(profileData as UserProfile),
            email: data.user.email
          };
          setProfile(profileWithEmail);
          
          // Set user role from profile
          if (profileWithEmail.role) {
            setRole(profileWithEmail.role as UserRole);
          } else {
            // Default to individual if no role is set
            setRole('individual');
            // Update the profile with the default role
            await supabase
              .from('profiles')
              .update({ role: 'individual' })
              .eq('id', userId);
          }
        } else {
          setProfile(profileData as UserProfile);
          
          // Set user role from profile
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
        }
      } catch (userError) {
        console.error('Error getting user email:', userError);
        setProfile(profileData as UserProfile);
        
        // Still set the role
        if (profileData.role) {
          setRole(profileData.role as UserRole);
        } else {
          setRole('individual');
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message,
        });
      } else {
        navigate('/');
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message,
      });
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole = 'individual') => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        });
      } else {
        // Create profile record
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              first_name: firstName,
              last_name: lastName,
              role: role
            });
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        }
        
        toast({
          title: "Registration successful",
          description: "Please check your email for confirmation.",
        });
        navigate('/auth?tab=signin');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
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

      const updatedProfile = prev => {
        if (!prev) return null;
        const newProfile = { ...prev, ...data };
        
        // Update role state if role was changed
        if (data.role && data.role !== role) {
          setRole(data.role);
        }
        
        return newProfile;
      };
      
      setProfile(updatedProfile);
      
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
    if (!user) return;
    
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
    role,
    signIn,
    signUp,
    signOut,
    updateProfile,
    setUserRole,
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

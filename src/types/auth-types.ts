
import { Session, User } from '@supabase/supabase-js';
import { 
  LegacyUserRole, 
  legacyToNewRoleMap,
  rolePermissions
} from '@/types/common';
import type { 
  BasicUserRole, 
  SubscriptionTier as UsohSubscriptionTier,
  DetailedUserRole as UsohDetailedUserRole,
  CombinedUserRole
} from '@/types/usoh';

// Export the combined user role type
export type UserRole = CombinedUserRole;

// Export SubscriptionTier type directly instead of re-exporting
export type SubscriptionTier = UsohSubscriptionTier;
export type DetailedUserRole = UsohDetailedUserRole;

// Define the subscription plan type (for backward compatibility)
export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise';

// Map subscription tier to subscription plan for backward compatibility
export const tierToPlanMap: Record<SubscriptionTier, SubscriptionPlan> = {
  'individual': 'free',
  'professional': 'pro',
  'smb': 'team',
  'enterprise': 'enterprise'
};

// Plan to role mapping for backward compatibility
export const planRoles: Record<SubscriptionTier, UserRole[]> = {
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

// User profile interface
export interface UserProfile {
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

// Auth context type definition
export type AuthContextType = {
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
    subscriptionTier?: SubscriptionTier;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  setUserSubscriptionTier: (tier: SubscriptionTier) => Promise<void>;
  joinTeam: (teamId: string, role?: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  getRoleCategory: () => 'individual' | 'team' | 'management' | 'administrative';
  getDetailedRole: () => DetailedUserRole | null;
};

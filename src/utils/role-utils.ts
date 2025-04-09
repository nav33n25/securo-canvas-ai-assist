
import { UserRole, SubscriptionTier } from '@/types/auth-types';
import { DetailedUserRole } from '@/types/usoh';

// Define subscription tier hierarchy
export const subscriptionTierHierarchy: Record<SubscriptionTier, number> = {
  'individual': 1,
  'professional': 2,
  'smb': 3,
  'enterprise': 4
};

// Define role hierarchy based on categories
export const roleHierarchy: Record<string, number> = {
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

// Function to get role category
export function getRoleCategory(role: UserRole | null): 'individual' | 'team' | 'management' | 'administrative' {
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
}

// Function to get detailed role
export function getDetailedRole(
  role: UserRole | null,
  subscriptionTier: SubscriptionTier | null
): DetailedUserRole | null {
  // If role is already a detailed role, return it
  if (role && Object.values(DetailedUserRole).includes(role as any)) {
    return role as DetailedUserRole;
  }
  
  // Map basic roles to the most appropriate detailed role
  if (!role) return null;
  
  switch (role) {
    case 'individual':
      return subscriptionTier === 'professional' ? 'individual_professional' : 'individual_basic';
    case 'team_member':
      return 'team_analyst';
    case 'team_manager':
      return 'team_lead';
    case 'administrator':
      return 'platform_admin';
    default:
      return null;
  }
}


// Define all authentication related type definitions

export type UserRole = 'individual' | 'team_member' | 'team_manager' | 'administrator';
export type CombinedUserRole = UserRole;
export type SubscriptionTier = 'individual' | 'professional' | 'smb' | 'enterprise' | 'free' | 'pro' | 'team';
export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise';

// Map subscription tiers to allowed roles
export const subscriptionTierRoleMap: Record<SubscriptionTier, CombinedUserRole[]> = {
  'individual': ['individual'],
  'professional': ['individual', 'team_member'],
  'smb': ['individual', 'team_member', 'team_manager'],
  'enterprise': ['individual', 'team_member', 'team_manager', 'administrator'],
  'free': ['individual'],
  'pro': ['individual', 'team_member'],
  'team': ['individual', 'team_member', 'team_manager'],
};

// Role permissions map
export const rolePermissions: Record<CombinedUserRole, string[]> = {
  'individual': ['create_document', 'edit_own_document', 'view_own_document'],
  'team_member': ['create_document', 'edit_own_document', 'view_own_document', 'view_team_document'],
  'team_manager': ['create_document', 'edit_document', 'view_document', 'manage_team', 'assign_tickets'],
  'administrator': ['create_document', 'edit_document', 'view_document', 'manage_team', 'assign_tickets', 'manage_workspace', 'manage_users']
};

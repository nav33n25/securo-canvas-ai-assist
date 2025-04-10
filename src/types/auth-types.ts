
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
  'team_member': ['create_document', 'edit_own_document', 'view_own_document', 'view_team_document', 'manage_team_tickets'],
  'team_manager': ['create_document', 'edit_document', 'view_document', 'manage_team', 'assign_tickets', 'manage_team_tickets', 'manage_all_tickets'],
  'administrator': ['create_document', 'edit_document', 'view_document', 'manage_team', 'assign_tickets', 'manage_workspace', 'manage_users', 'manage_all_tickets']
};

// Export proper TicketStatus and TicketPriority types to ensure consistency
export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed';
export type TicketStatusCapitalized = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketPriorityCapitalized = 'Low' | 'Medium' | 'High' | 'Critical';

// Mapping between lowercase and capitalized variants
export const statusMapping: Record<TicketStatusCapitalized, TicketStatus> = {
  'Open': 'open',
  'In Progress': 'in_progress',
  'Pending': 'review',
  'Resolved': 'resolved',
  'Closed': 'closed'
};

export const priorityMapping: Record<TicketPriorityCapitalized, TicketPriority> = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high',
  'Critical': 'critical'
};

// For ProfileUpdateParams
export interface ProfileUpdateParams {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: UserRole;
  subscriptionTier?: SubscriptionTier;
  jobTitle?: string; // Adding jobTitle to fix profile page errors
}

export interface RegisterParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier?: SubscriptionTier;
  role?: CombinedUserRole;
}

export interface TicketCreateData {
  title: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  ticket_type?: string;
  assignee_id?: string;
  due_date?: string | Date;
}

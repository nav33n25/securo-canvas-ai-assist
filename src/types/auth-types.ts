
// Re-export types from usoh.ts for auth context
import { 
  SubscriptionTier, 
  BasicUserRole, 
  DetailedUserRole, 
  CombinedUserRole 
} from './usoh';

export type { 
  SubscriptionTier, 
  BasicUserRole, 
  DetailedUserRole, 
  CombinedUserRole 
};

// Legacy type definitions for backward compatibility
export type UserRole = 'individual' | 'team_member' | 'team_manager' | 'administrator';
export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise';

// Map legacy roles to new roles
export const legacyToNewRoleMap: Record<string, UserRole> = {
  'user': 'individual',
  'admin': 'administrator'
};

// Permission definitions
export interface RolePermission {
  key: string;
  description: string;
}

// Map between legacy UserRole and combined roles
export const userRoleMap: Record<UserRole, CombinedUserRole[]> = {
  'individual': ['individual_basic', 'individual_professional'],
  'team_member': ['team_analyst', 'team_hunter', 'team_researcher', 'team_red', 'team_blue'],
  'team_manager': ['team_lead', 'team_manager', 'security_manager', 'ciso_director'],
  'administrator': ['platform_admin', 'knowledge_admin']
};

// Map between subscription tiers and allowed roles
export const subscriptionTierRoleMap: Record<SubscriptionTier, CombinedUserRole[]> = {
  'free': ['individual_basic'],
  'professional': ['individual_professional'],
  'team': ['team_analyst', 'team_hunter', 'team_researcher', 'team_lead', 'team_manager'],
  'enterprise': ['team_red', 'team_blue', 'security_manager', 'ciso_director', 'platform_admin', 'knowledge_admin']
};

export const rolePermissions: Record<string, string[]> = {
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

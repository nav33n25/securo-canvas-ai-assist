import { LucideIcon } from 'lucide-react';

// Common type definitions
export type IconType = LucideIcon;

// Menu item interfaces
export interface MenuItem {
  title: string;
  icon: string;
  path: string;
  roles: string[];
  iconComponent?: React.ComponentType<any>;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  visible?: boolean;
}

// USOH platform specific types
export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise';

export type UserRoleCategory = 
  'individual' | 
  'team' | 
  'management' | 
  'administrative';

export type UserRole = 'individual' | 'team_member' | 'team_manager' | 'administrator';

// Legacy roles - keep for backward compatibility
export type LegacyUserRole = 'user' | 'admin';

// Map legacy roles to new roles
export const legacyToNewRoleMap: Record<LegacyUserRole, UserRole> = {
  'user': 'individual',
  'admin': 'administrator'
};

// Security ticket related types
export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'vulnerability' | 'incident' | 'task' | 'project';

export interface RelatedDocument {
  id: string;
  title: string;
  url: string;
}

export interface SecurityTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  ticket_type: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assignee_id?: string;
  assignee_name?: string;
  assignee_email?: string;
  assignee_avatar?: string;
  related_documents?: RelatedDocument[];
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string;
}

export interface TicketDocumentRelation {
  id: string;
  ticket_id: string;
  document_id: string;
  relation_type: 'evidence' | 'reference' | 'attachment';
  created_by: string;
  created_at: string;
}

// Team management types
export type TeamType = 'red_team' | 'blue_team' | 'security_ops' | 'compliance' | 'general';
export type TeamMemberRole = 'member' | 'lead' | 'owner';

export interface TeamMember {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  joined_at: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  members: TeamMember[];
}

// Document security enhancements
export type DocumentSensitivity = 'public' | 'internal' | 'confidential' | 'restricted';

export interface EnhancedDocument extends Document {
  sensitivity: DocumentSensitivity;
  compliance_frameworks?: string[];
  team_id?: string;
  evidence_ids?: string[];
  mitre_attack_techniques?: string[];
}

// Integration types
export type IntegrationType = 'jira' | 'github' | 'slack' | 'burp_suite' | 'metasploit' | 'nessus';

export interface IntegrationConnection {
  id: string;
  user_id: string;
  integration_type: IntegrationType;
  connection_details: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  team_id?: string;
}

// Feature access control
export interface SubscriptionFeature {
  id: string;
  subscription_tier: SubscriptionTier;
  feature_key: string;
  is_enabled: boolean;
  max_usage?: number;
  created_at: string;
}

// Role permissions mapping
export const rolePermissions: Record<UserRole, string[]> = {
  'individual': [
    'view_own_documents',
    'edit_own_documents',
    'use_basic_templates',
    'create_personal_tickets',
    'use_basic_ai'
  ],
  'team_member': [
    'view_team_documents',
    'edit_own_documents',
    'use_advanced_templates',
    'create_team_tickets',
    'view_team_tickets',
    'use_enhanced_ai'
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
  ]
}; 
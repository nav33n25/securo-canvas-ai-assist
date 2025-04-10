// USOH Platform Types - Core type definitions for the Unified Security Operations Hub

// Document sensitivity levels
export type DocumentSensitivity = 'public' | 'internal' | 'confidential' | 'restricted';

// Enhanced User Role Types
export type BasicUserRole = 'individual' | 'team_member' | 'team_manager' | 'administrator';

// Expanded detailed roles for USOH
export type DetailedUserRole = 
  // Individual tier
  'individual_basic' | 'individual_professional' |
  // Team tier
  'team_analyst' | 'team_hunter' | 'team_researcher' | 
  'team_red' | 'team_blue' | 'team_lead' |
  // Management tier
  'security_manager' | 'ciso_director' |
  // Admin tier
  'platform_admin' | 'knowledge_admin';

// Combined user role type
export type CombinedUserRole = BasicUserRole | DetailedUserRole;

// Subscription tier types
export type SubscriptionTier = 'individual' | 'professional' | 'smb' | 'enterprise';

// Team types
export type TeamType = 'red_team' | 'blue_team' | 'security_ops' | 'compliance' | 'general';
export type TeamRole = 'member' | 'lead' | 'owner';

export interface Team {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
  team_type: TeamType;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  user?: UserProfile; // Populated via join
}

// Enhanced User Profile
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  avatar_url?: string | null;
  job_title?: string | null;
  role?: DetailedUserRole | BasicUserRole;
  subscription_tier?: SubscriptionTier;
  team_id?: string;
  organization_id?: string;
  expertise_areas?: string[];
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

// Ticketing System Types
export type TicketStatus = 'open' | 'in_progress' | 'review' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'vulnerability' | 'incident' | 'task' | 'project';

export interface SecurityTicket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee_id?: string;
  reporter_id: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  ticket_type: TicketType;
  labels: string[];
  external_references?: Record<string, any>;
  
  // Relations (populated via join)
  assignee?: UserProfile;
  reporter?: UserProfile;
  team?: Team;
  comments?: TicketComment[];
  documents?: TicketDocumentRelation[];
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string;
  
  // Relations
  user?: UserProfile;
  replies?: TicketComment[];
}

export type RelationType = 'evidence' | 'reference' | 'attachment';

export interface TicketDocumentRelation {
  id: string;
  ticket_id: string;
  document_id: string;
  relation_type: RelationType;
  created_by: string;
  created_at: string;
  
  // Relations
  document?: Document;
}

// Document activity types
export type DocumentActivityAction = 
  'create' | 
  'update' | 
  'view' | 
  'edit' | 
  'delete' | 
  'share' | 
  'upload_image' | 
  'export' | 
  'print' | 
  'ai_generation';

// Security compliance frameworks
export type ComplianceFramework = 
  'ISO27001' | 
  'NIST800-53' | 
  'SOC2' | 
  'HIPAA' | 
  'PCI-DSS' | 
  'GDPR' | 
  'CCPA';

// Security classifications
export type SecurityClassification = {
  sensitivity: DocumentSensitivity;
  complianceFrameworks?: ComplianceFramework[];
  retentionPeriod?: number; // In days
  dataOwner?: string;
  encryptionRequired?: boolean;
};

// Document interface with security features
export interface SecureDocument {
  id: string;
  title: string;
  content: any; // Usually JSON content for the editor
  html_content?: string; // HTML representation
  user_id: string;
  team_id?: string;
  is_template: boolean;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  version: number;
  sensitivity: DocumentSensitivity;
  compliance_frameworks?: ComplianceFramework[];
  mitre_attack_techniques?: string[];
  last_modified_by?: string;
  created_at: string;
  updated_at: string;
}

// Document activity logging
export interface DocumentActivity {
  id: string;
  user_id: string;
  document_id: string;
  action: DocumentActivityAction;
  details?: Record<string, any>;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

// AI completions logging
export interface AICompletion {
  id: string;
  user_id: string;
  prompt_length: number;
  sensitivity_level: DocumentSensitivity;
  completion_type?: 'document' | 'chat' | 'code';
  created_at: string;
}

// Security audit log
export interface SecurityAuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Integration Types
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

// Feature Management
export interface SubscriptionFeature {
  id: string;
  subscription_tier: SubscriptionTier;
  feature_key: string;
  is_enabled: boolean;
  max_usage?: number;
  created_at: string;
}

// Filter and Query Types
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assignee_id?: string;
  reporter_id?: string;
  team_id?: string;
  ticket_type?: TicketType[];
  labels?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface DocumentFilters {
  user_id?: string;
  team_id?: string;
  is_template?: boolean;
  status?: string;
  sensitivity?: DocumentSensitivity[];
  compliance_frameworks?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
}

// Analytics and Metrics
export interface OperationalMetrics {
  mttrData?: MTTRMetric[];
  vulnerabilityData?: VulnerabilityStatusMetric;
  teamData?: TeamPerformanceMetric[];
}

export interface MTTRMetric {
  period: string;
  average_hours: number;
  ticket_count: number;
}

export interface VulnerabilityStatusMetric {
  open: number;
  in_progress: number;
  review: number;
  closed: number;
  by_priority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface TeamPerformanceMetric {
  team_id: string;
  team_name: string;
  tickets_completed: number;
  average_resolution_time: number;
} 

// Common type definitions used across the application
import { 
  UserRole, 
  TicketStatus, 
  TicketPriority, 
  TicketStatusCapitalized, 
  TicketPriorityCapitalized 
} from './auth-types';

// Re-export ticket types to avoid import conflicts
export type {
  TicketStatus,
  TicketPriority,
  TicketStatusCapitalized,
  TicketPriorityCapitalized
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: UserRole;
  team_id?: string;
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
  reporter_id: string; // Used in place of reported_by
  assignee_id: string | null; // Used in place of assigned_to
  assignee_name?: string;
  assignee_avatar?: string;
  category?: string;
  due_date?: string;
  reported_by?: string; // Alias for reporter_id for backward compatibility
  assigned_to?: string | null; // Alias for assignee_id for backward compatibility
  labels?: string[];
  team_id?: string;
  assignee?: string; // Added for compatibility with components
  created_by?: string; // Added for compatibility with components
  related_assets?: string[]; // Added for compatibility with components
  related_cves?: string[]; // Added for compatibility with components
}

// Define specific asset types for proper type checking
export type AssetType = 'Server' | 'Workstation' | 'Mobile' | 'Network' | 'Service' | 'Application' | 'Other';

// Align CveEntry with the security.ts version
export interface CveEntry {
  id: string;
  cve_id?: string;
  description: string;
  severity: string;
  published_date: string;
  updated_date: string;
  status: string;
  affected_systems?: string[];
  references?: string[];
  mitigation?: string;
  cvss_score: number; // Changed to required
  last_modified: string; // Changed to required
  vulnerability_type: string; // Changed to required
}

// Align RedTeamOperation with the security.ts version
export interface RedTeamOperation {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  description: string;
  team_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  techniques: string[];
  targets: string[];
  severity: string;
  objective: string; // Changed to required
  targeted_systems: string[]; // Changed to required
  results?: string;
}

// Align Asset interface with the expected structure in assets/index.tsx
export interface Asset {
  id: string;
  name: string;
  type: AssetType; // Use the specific AssetType
  status?: string;
  ip?: string;
  ip_address?: string;
  mac_address?: string;
  os?: string;
  location?: string;
  owner?: string;
  criticality: string;
  security_score: number;
  last_scan: string;
  vulnerabilities: string[];
  risk_score?: number;
}

// Define specific client status types
export type ClientStatus = 'Active' | 'Prospect' | 'Inactive';

// Align Client and ClientProject interfaces with the client-portal page
export interface ClientProject {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date?: string;
  client_id?: string;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  status: ClientStatus; // Use the specific ClientStatus type
  projects: ClientProject[];
}

// Define specific severity types
export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

// SocAlert interface to match the structure used in soc/index.tsx
export interface SocAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity; // Use the specific AlertSeverity type
  status: string;
  source: string;
  detected_at: string;
  updated_at: string;
  assigned_to?: string;
  affected_assets?: string[];
  mitre_techniques?: string[];
  asset_id?: string;
  mitre_technique?: string;
  created_at?: string;
  details?: any;
}

// ThreatIntelFeed interface to match the structure used in threat-intel/index.tsx
export interface ThreatIntelFeed {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: AlertSeverity; // Use the specific AlertSeverity type
  published_date: string;
  affected_systems?: string[];
  indicators?: string[];
  mitre_techniques?: string[];
  name?: string;
  last_updated?: string;
  ioc_count?: number;
  status?: string;
}

export type IconType = React.ComponentType<{ className?: string }>;

// Fix the ticket analytics function for proper date handling
export const parseTicketDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString;
  }
  return new Date(dateString);
};

// Helper function to convert status between formats
export const normalizeTicketStatus = (status: TicketStatus | TicketStatusCapitalized): TicketStatus => {
  if (status === 'Open') return 'open';
  if (status === 'In Progress') return 'in_progress';
  if (status === 'Pending') return 'review';
  if (status === 'Resolved') return 'resolved';
  if (status === 'Closed') return 'closed';
  return status as TicketStatus;
};

// Helper function to convert priority between formats
export const normalizeTicketPriority = (priority: TicketPriority | TicketPriorityCapitalized): TicketPriority => {
  if (priority === 'Low') return 'low';
  if (priority === 'Medium') return 'medium';
  if (priority === 'High') return 'high';
  if (priority === 'Critical') return 'critical';
  return priority as TicketPriority;
};

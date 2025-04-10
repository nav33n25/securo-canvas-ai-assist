
// Common type definitions used across the application
import { UserRole } from './auth-types';

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

// Update the enums to match the string values used in the components
export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed' | 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface TicketCreateData {
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  ticket_type: string;
  assignee_id?: string;
  team_id?: string;
  due_date?: string;
  labels?: string[];
  category?: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface TicketActivity {
  id: string;
  ticket_id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
}

export type IconType = React.ComponentType<{ className?: string }>;

// Add additional types that are referenced in the components
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
}

export interface CveEntry {
  id: string;
  cve_id: string;
  description: string;
  severity: string;
  published_date: string;
  updated_date: string;
  status: string;
  affected_systems: string[];
  references: string[];
  mitigation: string;
}

// Fix the ticket analytics function for proper date handling
export const parseTicketDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString;
  }
  return new Date(dateString);
};

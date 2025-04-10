
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
}

export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

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

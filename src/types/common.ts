
// Common type definitions used across the application
import { UserRole } from './auth-types';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
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
  reporter_id: string; // Instead of reported_by
  assignee_id: string | null; // Instead of assigned_to
  assignee_name?: string;
  assignee_avatar?: string;
  category?: string;
  due_date?: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'review' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TicketCreateData {
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  ticket_type: string;
}

export type IconType = React.ComponentType<{ className?: string }>;

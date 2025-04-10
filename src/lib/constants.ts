
// Constants for ticket status display
export const TICKET_STATUS: Record<string, string> = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'review': 'In Review',
  'resolved': 'Resolved',
  'closed': 'Closed'
};

// Constants for ticket priority display
export const TICKET_PRIORITY: Record<string, string> = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'critical': 'Critical'
};

// Constants for ticket types
export const TICKET_TYPES: Record<string, string> = {
  'bug': 'Bug',
  'feature': 'Feature Request',
  'security': 'Security Issue',
  'incident': 'Incident',
  'task': 'Task',
  'general': 'General'
};

// Constants for user roles
export const USER_ROLES: Record<string, string> = {
  'individual': 'Individual User',
  'team_member': 'Team Member',
  'team_manager': 'Team Manager',
  'administrator': 'Administrator'
};

// Constants for subscription plans
export const SUBSCRIPTION_PLANS: Record<string, string> = {
  'free': 'Free Plan',
  'pro': 'Pro Plan',
  'team': 'Team Plan',
  'enterprise': 'Enterprise Plan'
};

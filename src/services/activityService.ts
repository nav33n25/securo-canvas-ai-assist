
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

// Define types for the activity data
export interface ActivityItem {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  created_at: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  } | null;
}

// Get user activities
export const getUserActivities = async (userId: string, limit = 10): Promise<ActivityItem[]> => {
  try {
    const { data, error } = await supabase
      .from('security_audit_log')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      action: item.action,
      resource_type: item.resource_type,
      resource_id: item.resource_id,
      details: item.details,
      created_at: item.created_at,
      user: item.profiles ? {
        id: item.profiles.id,
        name: `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim(),
        avatar: item.profiles.avatar_url
      } : null
    }));
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

// Get team activities
export const getTeamActivities = async (teamId: string, limit = 20): Promise<ActivityItem[]> => {
  try {
    // First get team members
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId);
    
    if (teamError) throw teamError;
    
    const userIds = teamMembers.map(member => member.user_id);
    
    if (userIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('security_audit_log')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      action: item.action,
      resource_type: item.resource_type,
      resource_id: item.resource_id,
      details: item.details,
      created_at: item.created_at,
      user: item.profiles ? {
        id: item.profiles.id,
        name: `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim(),
        avatar: item.profiles.avatar_url
      } : null
    }));
  } catch (error) {
    console.error('Error fetching team activities:', error);
    return [];
  }
};

// Format activity for display
export const formatActivity = (activity: ActivityItem): string => {
  const userName = activity.user?.name || 'A user';
  
  // Based on action type
  switch (activity.action) {
    case 'INSERT':
      return `${userName} created a new ${formatResourceType(activity.resource_type)}`;
    case 'UPDATE':
      return `${userName} updated a ${formatResourceType(activity.resource_type)}`;
    case 'DELETE':
      return `${userName} deleted a ${formatResourceType(activity.resource_type)}`;
    default:
      return `${userName} performed action ${activity.action} on ${formatResourceType(activity.resource_type)}`;
  }
};

// Format resource type for display
export const formatResourceType = (resourceType: string): string => {
  const typeMap: Record<string, string> = {
    'security_tickets': 'ticket',
    'documents': 'document',
    'comments': 'comment',
    'team_members': 'team member',
    'profiles': 'profile',
    // Add more mappings as needed
  };
  
  return typeMap[resourceType] || resourceType.replace(/_/g, ' ');
};

// Format activity date for display
export const formatActivityDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

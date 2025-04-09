
import { supabase } from '@/lib/supabase';

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  resource_id?: string;
  resource_type?: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  details?: any;
}

export interface ActivityFeedOptions {
  limit?: number;
  offset?: number;
  userId?: string;
  resourceType?: string;
}

// Fetch activity feed from the security_audit_log table
export const fetchActivityFeed = async (options: ActivityFeedOptions = {}): Promise<ActivityItem[]> => {
  const {
    limit = 20,
    offset = 0,
    userId,
    resourceType,
  } = options;

  let query = supabase
    .from('security_audit_log')
    .select(`
      id,
      action as type,
      resource_type,
      resource_id,
      created_at,
      user_id,
      details,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (resourceType) {
    query = query.eq('resource_type', resourceType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching activity feed:', error);
    return [];
  }

  // Transform data into ActivityItem format
  return data.map(item => ({
    id: item.id,
    type: item.type,
    title: generateActivityTitle(item),
    description: generateActivityDescription(item),
    created_at: item.created_at,
    user_id: item.user_id,
    resource_id: item.resource_id,
    resource_type: item.resource_type,
    profiles: item.profiles,
    details: item.details,
  }));
};

// Generate a human-readable title for an activity item
const generateActivityTitle = (activity: any): string => {
  const userName = activity.profiles ? 
    `${activity.profiles.first_name || ''} ${activity.profiles.last_name || ''}`.trim() || 'A user' : 
    'A user';
  
  const resourceType = activity.resource_type ? 
    activity.resource_type.replace(/_/g, ' ') : 
    'item';

  switch (activity.type) {
    case 'INSERT':
      return `${userName} created a new ${resourceType}`;
    case 'UPDATE':
      return `${userName} updated a ${resourceType}`;
    case 'DELETE':
      return `${userName} deleted a ${resourceType}`;
    default:
      return `${userName} performed an action on ${resourceType}`;
  }
};

// Generate a description for an activity item
const generateActivityDescription = (activity: any): string => {
  if (!activity.details) return '';
  
  try {
    // If we have structured details, we can create more specific descriptions
    if (typeof activity.details === 'object') {
      if (activity.type === 'UPDATE' && activity.details.old && activity.details.new) {
        const changedFields = Object.keys(activity.details.new).filter(
          key => JSON.stringify(activity.details.old[key]) !== JSON.stringify(activity.details.new[key])
        );
        
        if (changedFields.length > 0) {
          return `Changed fields: ${changedFields.join(', ')}`;
        }
      }
      
      // For custom actions
      if (activity.details.action) {
        return activity.details.message || activity.details.action;
      }
    }
    
    return '';
  } catch (e) {
    console.error('Error parsing activity details:', e);
    return '';
  }
};

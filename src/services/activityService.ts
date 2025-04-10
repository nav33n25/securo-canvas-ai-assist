import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  type: 'document_updated' | 'document_created' | 'comment_added' | 'role_changed' | 'joined';
  document_id?: string;
  document_title?: string;
  user_id: string;
  user_name?: string;
  created_at: string;
  content?: string;
}

export const fetchActivityFeed = async (userId: string): Promise<ActivityItem[]> => {
  try {
    // Add error handling if userId is not provided
    if (!userId) {
      console.warn('fetchActivityFeed called without userId');
      return [];
    }

    const { data, error } = await supabase
      .from('document_versions')
      .select(`
        id, 
        created_at, 
        change_summary,
        document_id,
        documents(title),
        profiles(first_name, last_name)
      `)
      .limit(10)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching activity feed:', error);
      throw error;
    }
    
    // Safely transform the data with proper null checks
    const transformedActivities: ActivityItem[] = (data || []).map(item => {
      let firstName = '';
      let lastName = '';
      
      // Fix the TypeScript errors by adding proper null checks
      if (item.profiles && typeof item.profiles === 'object') {
        // Access properties safely using optional chaining and nullish coalescing
        firstName = item.profiles?.first_name ?? '';
        lastName = item.profiles?.last_name ?? '';
      }
      
      // Safely extract document title
      const documentTitle = item.documents?.title || 'Untitled Document';
      
      return {
        id: item.id || `temp-${Date.now()}-${Math.random()}`,
        type: 'document_updated',
        document_id: item.document_id || undefined,
        document_title: documentTitle,
        user_id: userId,
        user_name: `${firstName} ${lastName}`.trim() || 'Unknown User',
        created_at: item.created_at || new Date().toISOString(),
        content: item.change_summary || 'Updated document'
      };
    });
    
    return transformedActivities;
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return [];
  }
};

export const formatActivityItems = (items: any[]) => {
  return items.map(item => {
    return {
      id: item.id || `temp-${Date.now()}-${Math.random()}`,
      type: 'document_updated',
      document_id: item.document_id || undefined,
      document_title: item.documents?.title || 'Untitled Document',
      user_id: item.user_id,
      user_name: item.profiles ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() : 'Unknown User',
      created_at: item.created_at || new Date().toISOString(),
      content: item.change_summary || 'Updated document',
      user: {
        name: item.profiles ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() : 'Unknown User',
        avatar: item.profiles ? item.profiles.avatar_url : null,
      }
    };
  });
};

export const getActivityFeed = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('activity_feed')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Format the data for the activity feed
    const formatted = data.map(item => ({
      id: item.id,
      action: item.action,
      resourceType: item.resource_type,
      resourceId: item.resource_id,
      details: item.details,
      createdAt: item.created_at,
      user: item.profiles ? {
        id: item.profiles.id,
        name: item.profiles ? `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() : 'Unknown User',
        avatar: item.profiles?.avatar_url || null
      } : null
    }));

    return formatted;
  } catch (error) {
    console.error('Failed to fetch activity feed:', error);
    return [];
  }
};

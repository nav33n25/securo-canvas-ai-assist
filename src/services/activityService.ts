
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

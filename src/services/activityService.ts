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
      
    if (error) throw error;
    
    const transformedActivities: ActivityItem[] = (data || []).map(item => {
      let firstName = '';
      let lastName = '';
      
      // Fix for TS18047: Add proper null checking for item.profiles
      if (item.profiles && 
          typeof item.profiles === 'object' && 
          item.profiles !== null) {
        // Extract profile data with proper type assertion
        const profileData = item.profiles as { first_name?: string; last_name?: string };
        firstName = profileData.first_name || '';
        lastName = profileData.last_name || '';
      }
      
      return {
        id: item.id,
        type: 'document_updated',
        document_id: item.document_id,
        document_title: item.documents?.title || 'Untitled Document',
        user_id: userId,
        user_name: `${firstName} ${lastName}`.trim() || 'Unknown User',
        created_at: item.created_at,
        content: item.change_summary || 'Updated document'
      };
    });
    
    return transformedActivities;
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return [];
  }
};

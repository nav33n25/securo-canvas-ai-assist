
import { supabase } from '@/integrations/supabase/client';

export interface RecentDocument {
  id: string;
  title: string;
  updated_at: string;
  status?: string;
}

export const fetchRecentDocuments = async (userId: string): Promise<RecentDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, updated_at, status')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    return [];
  }
};

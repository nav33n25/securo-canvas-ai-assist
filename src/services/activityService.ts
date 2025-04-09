import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface ActivityData {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  activityType: string;
  details: any;
  date: string;
  time: string;
  fullDate: Date;
}

// Make sure to add null check for item.profiles
export const formatActivityData = (data: any[]): ActivityData[] => {
  return data.map(item => {
    // Extract user information with null checks
    const firstName = item.profiles?.first_name || 'Unknown';
    const lastName = item.profiles?.last_name || 'User';
    const avatarUrl = item.profiles?.avatar_url || '';
    
    // Format date and time
    const date = new Date(item.created_at);
    const formattedDate = format(date, 'MMM d, yyyy');
    const formattedTime = format(date, 'h:mm a');
    
    // Return formatted activity data
    return {
      id: item.id,
      userId: item.user_id,
      userName: `${firstName} ${lastName}`,
      avatarUrl,
      activityType: item.activity_type,
      details: item.details,
      date: formattedDate,
      time: formattedTime,
      fullDate: date,
    };
  });
};

export const getActivityData = async (): Promise<ActivityData[]> => {
  try {
    // Fetch activity data from Supabase
    const { data, error } = await supabase
      .from('security_audit_log')
      .select(`
        id,
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        created_at,
        profiles (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }
    
    // Format the activity data
    const formattedData = formatActivityData(data);
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return [];
  }
};


import React from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface TicketActivityProps {
  ticketId: string;
}

const TicketActivity: React.FC<TicketActivityProps> = ({ ticketId }) => {
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase.rpc('get_ticket_activities', {
          p_ticket_id: ticketId
        });
        
        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching ticket activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (activities.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No activity recorded for this ticket yet.</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-l-2 border-muted pl-4">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{activity.activity_description}</p>
              <p className="text-sm text-muted-foreground">by {activity.user_name}</p>
            </div>
            <p className="text-sm text-muted-foreground">{activity.formatted_date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketActivity;

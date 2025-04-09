import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useUsers } from '@/hooks/useUsers';
import {
  AlertCircle,
  ArrowUpCircle,
  CheckCircle,
  Clock,
  FileEdit,
  MessageSquare,
  Tag,
  User,
} from 'lucide-react';

type TicketActivityProps = {
  ticketId: string;
};

type Activity = {
  id: string;
  ticket_id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
};

const TicketActivity = ({ ticketId }: TicketActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { users } = useUsers();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('ticket_activities')
          .select('*')
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: false })
          .limit(30);
        
        if (error) throw error;
        
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Subscribe to new activities
    const subscription = supabase
      .channel(`ticket-activity-${ticketId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ticket_activities',
        filter: `ticket_id=eq.${ticketId}`,
      }, (payload) => {
        setActivities(prev => [payload.new as Activity, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [ticketId]);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown user';
  };

  const getUserInitials = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return 'UN';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'created':
        return <FileEdit className="h-5 w-5 text-primary" />;
      case 'status_changed':
        return <Tag className="h-5 w-5 text-blue-500" />;
      case 'assigned':
        return <User className="h-5 w-5 text-indigo-500" />;
      case 'priority_changed':
        return <ArrowUpCircle className="h-5 w-5 text-yellow-500" />;
      case 'comment_added':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityDescription = (activity: Activity) => {
    const { activity_type, details } = activity;
    const userName = getUserName(activity.user_id);
    
    switch (activity_type) {
      case 'created':
        return `${userName} created this ticket`;
      
      case 'comment_added':
        return `${userName} added a comment`;
      
      case 'status_changed':
        return `${userName} changed status from "${
          details.old_value.charAt(0).toUpperCase() + details.old_value.slice(1).replace('_', ' ')
        }" to "${
          details.new_value.charAt(0).toUpperCase() + details.new_value.slice(1).replace('_', ' ')
        }"`;
      
      case 'assigned':
        if (!details.old_value && details.new_value) {
          return `${userName} assigned this ticket to ${getUserName(details.assignee_id)}`;
        } else if (details.old_value && !details.new_value) {
          return `${userName} unassigned this ticket`;
        } else {
          return `${userName} changed assignee from ${getUserName(details.old_value)} to ${getUserName(details.new_value)}`;
        }
      
      case 'priority_changed':
        return `${userName} changed priority from "${
          details.old_value.charAt(0).toUpperCase() + details.old_value.slice(1)
        }" to "${
          details.new_value.charAt(0).toUpperCase() + details.new_value.slice(1)
        }"`;
      
      case 'updated':
        return `${userName} updated the ${details.field.replace('_', ' ')}`;
      
      default:
        return `${userName} performed an action`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activity has been recorded for this ticket yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="mt-1 bg-muted rounded-full p-1.5">
            {getActivityIcon(activity.activity_type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={`/api/avatar?userId=${activity.user_id}`} />
                <AvatarFallback>{getUserInitials(activity.user_id)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{getActivityDescription(activity)}</p>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketActivity; 
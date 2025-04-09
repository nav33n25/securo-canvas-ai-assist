
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityItem } from '@/services/activityService';

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, isLoading }) => {
  return (
    <Card className="shadow-md border border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b last:border-0">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-muted rounded-full p-2 h-10 w-10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{activity.user_name || 'A user'}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.content} in {activity.document_id ? <Link to={`/document/${activity.document_id}`} className="text-secure hover:underline">{activity.document_title}</Link> : 'a document'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent activity to display</p>
            <p className="text-sm text-slate-400 mt-1">Your recent actions will appear here</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-slate-50 border-t border-slate-100">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/documents">
            View All Documents
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityFeed;

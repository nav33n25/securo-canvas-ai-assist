
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock, User } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { SecurityTicket } from '@/types/common';

interface TicketListProps {
  tickets: SecurityTicket[];
  isLoading?: boolean;
  error?: Error | null;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, isLoading = false, error }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'high':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load tickets. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No tickets found</h3>
        <p className="text-muted-foreground mt-1">Create a new ticket to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>
                    {ticket.status === 'in_progress' ? 'In Progress' : 
                      ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {ticket.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {ticket.assignee_name || 'Unassigned'}
                  </div>
                </div>
                
                <Link to={`/tickets/${ticket.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;

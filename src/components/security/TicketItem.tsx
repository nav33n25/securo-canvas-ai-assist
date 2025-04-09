import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { SecurityTicket, TicketStatus, TicketPriority } from '@/types/common';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  ArrowRightCircle,
  ClipboardList,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/useToast';

export interface TicketItemProps {
  ticket: SecurityTicket;
  compact?: boolean;
  onStatusChange?: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
  onAssign?: (ticketId: string, userId: string) => Promise<void>;
}

const statusConfig: Record<TicketStatus, { color: string; icon: React.ReactNode; label: string }> = {
  open: { 
    color: 'bg-green-100 text-green-800 hover:bg-green-200', 
    icon: <Clock className="h-3.5 w-3.5 mr-1" />, 
    label: 'Open' 
  },
  in_progress: { 
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
    icon: <ClipboardList className="h-3.5 w-3.5 mr-1" />, 
    label: 'In Progress' 
  },
  review: { 
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200', 
    icon: <Eye className="h-3.5 w-3.5 mr-1" />, 
    label: 'In Review' 
  },
  resolved: { 
    color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200', 
    icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />, 
    label: 'Resolved' 
  },
  closed: { 
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
    icon: <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />, 
    label: 'Closed' 
  },
};

const priorityConfig: Record<TicketPriority, { color: string; icon: React.ReactNode; label: string }> = {
  low: { 
    color: 'bg-blue-100 text-blue-800', 
    icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />, 
    label: 'Low' 
  },
  medium: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />, 
    label: 'Medium' 
  },
  high: { 
    color: 'bg-orange-100 text-orange-800', 
    icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />, 
    label: 'High' 
  },
  critical: { 
    color: 'bg-red-100 text-red-800', 
    icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />, 
    label: 'Critical' 
  },
};

export const TicketItem: React.FC<TicketItemProps> = ({ 
  ticket, 
  compact = false,
  onStatusChange,
  onAssign
}) => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();

  const canManageTickets = hasPermission('manage_team_tickets') || 
                          hasPermission('manage_all_tickets');
  
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!onStatusChange) return;
    
    try {
      await onStatusChange(ticket.id, newStatus);
      toast({
        title: "Status updated",
        description: `Ticket status changed to ${statusConfig[newStatus].label}`,
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "There was an error updating the ticket status.",
        variant: "destructive",
      });
    }
  };

  const handleAssignToMe = async () => {
    if (!onAssign || !user) return;
    
    try {
      await onAssign(ticket.id, user.id);
      toast({
        title: "Ticket assigned",
        description: "Ticket has been assigned to you",
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "There was an error assigning the ticket.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = () => {
    navigate(`/security/tickets/${ticket.id}`);
  };

  if (compact) {
    return (
      <Card className="w-full mb-3 hover:shadow-md transition-shadow">
        <CardContent className="pt-4 pb-2 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-1">{ticket.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={priorityConfig[ticket.priority].color}>
                  <span className="flex items-center text-xs">
                    {priorityConfig[ticket.priority].icon}
                    {priorityConfig[ticket.priority].label}
                  </span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {ticket.ticket_type}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={priorityConfig[ticket.priority].color}>
              <span className="flex items-center">
                {priorityConfig[ticket.priority].icon}
                {priorityConfig[ticket.priority].label}
              </span>
            </Badge>
            <Badge className={statusConfig[ticket.status].color}>
              <span className="flex items-center">
                {statusConfig[ticket.status].icon}
                {statusConfig[ticket.status].label}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-sm text-gray-700 mb-3 line-clamp-2">
          {ticket.description}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {format(new Date(ticket.created_at), 'MMM d, yyyy')}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {format(new Date(ticket.updated_at), 'MMM d, yyyy')}
          </div>
          <div>
            <span className="font-medium">Type:</span>{' '}
            {ticket.ticket_type}
          </div>
          <div>
            <span className="font-medium">Assignee:</span>{' '}
            {ticket.assignee_name ? (
              <span className="flex items-center">
                <Avatar className="h-4 w-4 mr-1">
                  <AvatarImage src={ticket.assignee_avatar} />
                  <AvatarFallback>{ticket.assignee_name.charAt(0)}</AvatarFallback>
                </Avatar>
                {ticket.assignee_name}
              </span>
            ) : (
              'Unassigned'
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex gap-2">
          {canManageTickets && ticket.status !== 'closed' && (
            <>
              {!ticket.assignee_id && (
                <Button variant="outline" size="sm" onClick={handleAssignToMe}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Assign to me
                </Button>
              )}
              
              {ticket.status === 'open' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange('in_progress')}
                >
                  Start Work
                </Button>
              )}
              
              {ticket.status === 'in_progress' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange('review')}
                >
                  Submit for Review
                </Button>
              )}
              
              {ticket.status === 'review' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange('resolved')}
                >
                  Mark Resolved
                </Button>
              )}
              
              {ticket.status === 'resolved' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleStatusChange('closed')}
                >
                  Close Ticket
                </Button>
              )}
            </>
          )}
        </div>
        <Button onClick={handleViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketItem; 
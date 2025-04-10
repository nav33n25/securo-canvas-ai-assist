
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUsers } from '@/hooks/useUsers';
import TicketActivity from './TicketActivity';
import TicketComments from './TicketComments';
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Edit,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Tag,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SecurityTicket } from '@/types/common';

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users } = useUsers();
  const [ticket, setTicket] = useState<SecurityTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedTicket, setEditedTicket] = useState<Partial<SecurityTicket>>({});

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('security_tickets')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setTicket(data);
        setEditedTicket(data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast({
          title: 'Error',
          description: 'Failed to load ticket details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();

    // Set up real-time subscription for ticket updates
    const channel = supabase
      .channel(`ticket-${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_tickets',
        filter: `id=eq.${id}`,
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setTicket(payload.new as SecurityTicket);
          setEditedTicket(payload.new as SecurityTicket);
        } else if (payload.eventType === 'DELETE') {
          navigate('/ticketing');
          toast({
            title: 'Ticket Deleted',
            description: 'This ticket has been deleted',
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, navigate]);

  const handleSaveChanges = async () => {
    if (!ticket || !user) return;
    
    try {
      const changes: Record<string, { old: any; new: any }> = {};
      for (const [key, value] of Object.entries(editedTicket)) {
        if (key in ticket && ticket[key as keyof SecurityTicket] !== value) {
          changes[key] = {
            old: ticket[key as keyof SecurityTicket],
            new: value,
          };
        }
      }

      const { error } = await supabase
        .from('security_tickets')
        .update(editedTicket)
        .eq('id', id);
      
      if (error) throw error;
      
      // Add activity log for the changes
      const activityPromises = Object.entries(changes).map(([field, change]) => {
        let activityType: string;
        let details: any = { field, old_value: change.old, new_value: change.new };
        
        switch (field) {
          case 'status':
            activityType = 'status_changed';
            break;
          case 'assignee_id':
            activityType = 'assigned';
            details.assignee_id = change.new;
            break;
          case 'priority':
            activityType = 'priority_changed';
            break;
          default:
            activityType = 'updated';
        }
        
        return supabase
          .from('ticket_activities')
          .insert({
            ticket_id: id,
            user_id: user.id,
            activity_type: activityType,
            details,
          });
      });
      
      await Promise.all(activityPromises);
      
      setEditMode(false);
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!id || !user) return;
    
    try {
      const { error } = await supabase
        .from('security_tickets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      navigate('/ticketing');
      toast({
        title: 'Success',
        description: 'Ticket deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete ticket',
        variant: 'destructive',
      });
    }
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown user';
  };

  const getUserInitials = (userId: string | null) => {
    if (!userId) return 'NA';
    const user = users.find(u => u.id === userId);
    if (!user) return 'UN';
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'secondary'; // Changed from 'success' to 'secondary'
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
        return 'destructive'; // Changed from 'warning' to 'destructive'
      case 'critical':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/ticketing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Ticket not found. It may have been deleted or you don't have permission to view it.
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/ticketing')}
          >
            Return to Tickets
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/ticketing')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">{ticket.title}</h1>
        
        <div className="flex gap-2">
          {!editMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Ticket</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this ticket? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Clock className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editedTicket.title || ''}
                          onChange={(e) => setEditedTicket({...editedTicket, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editedTicket.description || ''}
                          onChange={(e) => setEditedTicket({...editedTicket, description: e.target.value})}
                          className="min-h-[200px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                        <div className="text-sm whitespace-pre-wrap">
                          {ticket.description || 'No description provided.'}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <TicketActivity ticketId={id || ''} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <TicketComments ticketId={id || ''} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                {editMode ? (
                  <Select
                    value={editedTicket.status || ''}
                    onValueChange={(value) => setEditedTicket({...editedTicket, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>
                    {ticket.status === 'in_progress' ? 'In Progress' : 
                      ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                {editMode ? (
                  <Select
                    value={editedTicket.priority || ''}
                    onValueChange={(value) => setEditedTicket({...editedTicket, priority: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                {editMode ? (
                  <Select
                    value={editedTicket.category || ''}
                    onValueChange={(value) => setEditedTicket({...editedTicket, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="incident">Security Incident</SelectItem>
                      <SelectItem value="vulnerability">Vulnerability</SelectItem>
                      <SelectItem value="compliance">Compliance Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>
                      {ticket.category === 'bug' ? 'Bug' : 
                       ticket.category === 'feature' ? 'Feature Request' :
                       ticket.category === 'incident' ? 'Security Incident' :
                       ticket.category === 'vulnerability' ? 'Vulnerability' :
                       ticket.category === 'compliance' ? 'Compliance Issue' : 'Other'}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Assignee</h3>
                {editMode ? (
                  <Select
                    value={editedTicket.assignee_id || ''}
                    onValueChange={(value) => setEditedTicket({...editedTicket, assignee_id: value || null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {`${user.first_name} ${user.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/api/avatar?userId=${ticket.assignee_id}`} />
                      <AvatarFallback>{getUserInitials(ticket.assignee_id)}</AvatarFallback>
                    </Avatar>
                    <span>{getUserName(ticket.assignee_id)}</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Reporter</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/api/avatar?userId=${ticket.reporter_id}`} />
                    <AvatarFallback>{getUserInitials(ticket.reporter_id)}</AvatarFallback>
                  </Avatar>
                  <span>{getUserName(ticket.reporter_id)}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <Link to={`/tickets/${id}/edit`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Advanced Edit
                  </Button>
                </Link>
              </div>
              
              <div>
                <Link to={`/ticketing`} className="w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    View All Tickets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;

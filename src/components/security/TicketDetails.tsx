
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ClipboardEdit,
  FileText,
  LinkIcon,
  MessageSquare,
  PaperclipIcon,
  Shield,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SecurityTicket, TicketStatus, TicketPriority } from '@/types/usoh';
import { useAuth } from '@/hooks/useAuth';

interface CommentType {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'U';
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
};

const TicketPriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const priorityStyles = {
    'critical': 'bg-red-600',
    'high': 'bg-orange-500',
    'medium': 'bg-yellow-500 text-black',
    'low': 'bg-blue-500'
  };

  return <Badge className={priorityStyles[priority] || 'bg-gray-500'}>{priority}</Badge>;
};

const TicketStatusBadge = ({ status }: { status: TicketStatus }) => {
  switch (status) {
    case 'open':
      return <Badge variant="outline" className="border-blue-500 text-blue-500"><AlertCircle className="h-3 w-3 mr-1" /> Open</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
    case 'review':
      return <Badge variant="outline" className="border-purple-500 text-purple-500"><ClipboardEdit className="h-3 w-3 mr-1" /> Review</Badge>;
    case 'closed':
      return <Badge variant="outline" className="border-green-500 text-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [newComment, setNewComment] = useState('');

  // Mock data for development - will be replaced with actual API call
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      // This would be replaced with an actual API call
      return {
        id: id || '1',
        title: 'Critical XSS Vulnerability in User Profile',
        description: 'A stored XSS vulnerability was discovered in the user profile page that allows attackers to inject malicious JavaScript. This could lead to session hijacking and data theft.',
        status: 'in_progress' as TicketStatus,
        priority: 'high' as TicketPriority,
        assignee_id: '123',
        reporter_id: '456',
        created_at: '2023-10-15T09:00:00Z',
        updated_at: '2023-10-16T14:30:00Z',
        due_date: '2023-10-20T23:59:59Z',
        labels: ['web', 'vulnerability', 'XSS'],
        ticket_type: 'vulnerability',
        assignee: {
          id: '123',
          first_name: 'Jane',
          last_name: 'Smith',
          avatar_url: null
        },
        reporter: {
          id: '456',
          first_name: 'John',
          last_name: 'Doe',
          avatar_url: null
        },
        team: {
          id: '789',
          name: 'Web Security Team'
        }
      } as SecurityTicket;
    },
    enabled: !!id
  });

  // Mock comments data
  const comments: CommentType[] = [
    {
      id: '1',
      user_id: '456',
      content: 'I discovered this vulnerability while testing the new profile picture upload feature.',
      created_at: '2023-10-15T09:30:00Z',
      user: {
        first_name: 'John',
        last_name: 'Doe',
        avatar_url: null
      }
    },
    {
      id: '2',
      user_id: '123',
      content: "I've reproduced the issue and started working on a fix. We'll need to implement better input sanitization.",
      created_at: '2023-10-16T11:45:00Z',
      user: {
        first_name: 'Jane',
        last_name: 'Smith',
        avatar_url: null
      }
    }
  ];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // In a real implementation, this would call an API to save the comment
    toast({
      title: "Comment added",
      description: "Your comment has been added to the ticket."
    });
    
    setNewComment('');
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    // This would update the ticket status via API
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${newStatus}`
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Ticket</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't load the requested ticket. It may not exist or you don't have permission to view it.
        </p>
        <Button onClick={() => navigate('/ticketing')}>Return to Tickets</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/ticketing')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-secure" />
              Ticket #{id}
            </h1>
            <p className="text-muted-foreground">
              Viewing security ticket details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/tickets/${id}/edit`} className="inline-flex">
            <Button variant="outline">
              <ClipboardEdit className="h-4 w-4 mr-2" />
              Edit Ticket
            </Button>
          </Link>
          <Button className="bg-secure hover:bg-secure-darker">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <CardTitle className="text-xl">{ticket.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-md">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="whitespace-pre-line text-sm">{ticket.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {ticket.labels?.map((label, index) => (
                      <Badge key={index} variant="secondary">{label}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Ticket Type</h3>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="capitalize">{ticket.ticket_type}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="flex items-center">
                        <TicketStatusBadge status={ticket.status} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                      <div className="flex items-center">
                        <TicketPriorityBadge priority={ticket.priority} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {ticket.due_date ? new Date(ticket.due_date).toLocaleDateString() : 'No due date'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Team</h3>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        {ticket.team?.name || 'Unassigned'}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Status Management</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant={ticket.status === 'open' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('open')}>Open</Button>
                      <Button variant={ticket.status === 'in_progress' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('in_progress')}>In Progress</Button>
                      <Button variant={ticket.status === 'review' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('review')}>Review</Button>
                      <Button variant={ticket.status === 'closed' ? 'default' : 'outline'} size="sm" onClick={() => handleStatusChange('closed')}>Close</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments" className="space-y-4">
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-muted/30 rounded-md p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={comment.user?.avatar_url || ''} />
                            <AvatarFallback>{getInitials(comment.user?.first_name, comment.user?.last_name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{comment.user?.first_name} {comment.user?.last_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm whitespace-pre-line">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Add a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4">
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Activity Timeline</h3>
                    <p className="text-muted-foreground">
                      The complete activity history for this ticket will be displayed here.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments" className="space-y-4">
                  <div className="text-center py-8">
                    <PaperclipIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Attachments</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload and manage evidence files related to this security issue.
                    </p>
                    <Button>
                      <PaperclipIcon className="h-4 w-4 mr-2" />
                      Upload Attachment
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={ticket.assignee?.avatar_url || ''} />
                  <AvatarFallback>{getInitials(ticket.assignee?.first_name, ticket.assignee?.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {ticket.assignee ? `${ticket.assignee.first_name} ${ticket.assignee.last_name}` : 'Unassigned'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {ticket.assignee ? 'Security Analyst' : 'Not assigned yet'}
                  </div>
                </div>
              </div>
              {!ticket.assignee && (
                <Button variant="outline" className="mt-4 w-full">
                  <User className="h-4 w-4 mr-2" />
                  Assign Ticket
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reported By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={ticket.reporter?.avatar_url || ''} />
                  <AvatarFallback>{getInitials(ticket.reporter?.first_name, ticket.reporter?.last_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {ticket.reporter ? `${ticket.reporter.first_name} ${ticket.reporter.last_name}` : 'System'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Linked Documents</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>No documents linked yet</span>
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <LinkIcon className="h-3 w-3 mr-2" />
                  Link Document
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">CVE References</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="border-red-500 text-red-500">CVE-2021-44228</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-secure hover:bg-secure-darker">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Link to={`/tickets/${id}/edit`} className="inline-flex w-full">
                <Button variant="outline" className="w-full">
                  <ClipboardEdit className="h-4 w-4 mr-2" />
                  Edit Ticket
                </Button>
              </Link>
              <Button variant="secondary" className="w-full">
                <LinkIcon className="h-4 w-4 mr-2" />
                Create Related Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;

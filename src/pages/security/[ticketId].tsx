import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User, Shield, MessageSquare, History } from 'lucide-react';
import Layout from '@/components/layout';
import TicketActivity from '@/components/security/TicketActivity';
import TicketComments from '@/components/security/TicketComments';
import UpdateTicketModal from '@/components/security/UpdateTicketModal';
import { TICKET_PRIORITY, TICKET_STATUS } from '@/lib/constants';
import { useUsers } from '@/hooks/useUsers';
import { SecurityTicket } from '@/types/common';

const TicketDetailsPage: React.FC = () => {
  const router = useRouter();
  const { ticketId } = router.query;
  const [ticket, setTicket] = useState<SecurityTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { toast } = useToast();
  const { users } = useUsers();

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const { data, error } = await supabase
          .from('security_tickets')
          .select('*')
          .eq('id', ticketId)
          .single();

        if (error) throw error;
        setTicket(data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast({
          title: 'Error loading ticket',
          description: 'Could not load the ticket details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();

    // Subscribe to ticket updates
    const subscription = supabase
      .channel(`ticket-updates:${ticketId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'security_tickets',
        filter: `id=eq.${ticketId}`,
      }, (payload) => {
        setTicket(payload.new as SecurityTicket);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [ticketId, toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getAssigneeName = (assigneeId: string | null) => {
    if (!assigneeId) return 'Unassigned';
    const user = users.find(u => u.id === assigneeId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown user';
  };

  const getReporterName = (reporterId: string) => {
    const user = users.find(u => u.id === reporterId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown user';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.push('/security')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-32 w-full mt-6" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/security')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Ticket not found or you don't have permission to view it.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/security')}>
                  Return to Security Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push('/security')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
          <Button onClick={() => setShowUpdateModal(true)}>
            Update Ticket
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={getStatusBadgeVariant(ticket.status)}>
                {TICKET_STATUS[ticket.status]}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                {TICKET_PRIORITY[ticket.priority]}
              </Badge>
              {ticket.category && (
                <Badge variant="outline">{ticket.category}</Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{ticket.title}</CardTitle>
            <CardDescription>Ticket ID: {ticket.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created
                </p>
                <p className="font-medium">
                  {format(new Date(ticket.created_at), 'PPP')}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Last Updated
                </p>
                <p className="font-medium">
                  {format(new Date(ticket.updated_at), 'PPP')}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Reported By
                </p>
                <p className="font-medium">
                  {getReporterName(ticket.reported_by)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Assigned To
                </p>
                <p className="font-medium">
                  {getAssigneeName(ticket.assigned_to)}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap text-sm">
                {ticket.description || 'No description provided.'}
              </div>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="comments">
                <TabsList>
                  <TabsTrigger value="comments" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="comments" className="mt-4">
                  <TicketComments ticketId={ticket.id} />
                </TabsContent>
                
                <TabsContent value="activity" className="mt-4">
                  <TicketActivity ticketId={ticket.id} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        {showUpdateModal && (
          <UpdateTicketModal
            ticket={ticket}
            open={showUpdateModal}
            onClose={() => setShowUpdateModal(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default TicketDetailsPage;

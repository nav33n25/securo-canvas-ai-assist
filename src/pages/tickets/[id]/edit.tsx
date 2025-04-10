
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useTickets } from '@/hooks/useTickets';
import { useToast } from '@/hooks/use-toast';
import { SecurityTicket } from '@/types/common';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TicketForm from '@/components/tickets/TicketForm';

const EditTicketPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicketById, updateTicket } = useTickets();
  const [ticket, setTicket] = useState<SecurityTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedTicket = await getTicketById(id);
        setTicket(fetchedTicket);
        setError(null);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch ticket'));
        toast({
          title: 'Error',
          description: 'Failed to load ticket',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicket();
  }, [id, getTicketById, toast]);
  
  const handleUpdateTicket = async (updatedTicket: Partial<SecurityTicket>) => {
    if (!id || !ticket) return;
    
    try {
      await updateTicket(id, updatedTicket);
      
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
      
      navigate(`/tickets/${id}`);
    } catch (err) {
      console.error('Error updating ticket:', err);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Button>
          </div>
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (error || !ticket) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Button>
          </div>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-2">Error Loading Ticket</h2>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'Could not find the requested ticket.'}
            </p>
            <Button 
              onClick={() => navigate('/tickets')}
              variant="default"
            >
              Return to Tickets
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => navigate("/tickets")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <TicketForm 
            ticket={ticket} 
            isEditMode={true} 
            onSubmit={handleUpdateTicket}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditTicketPage;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useTickets } from '@/hooks/useTickets';
import { useToast } from '@/components/ui/use-toast';
import { SecurityTicket } from '@/types/common';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TicketForm from '@/components/tickets/TicketForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
        const data = await getTicketById(id);
        setTicket(data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setError(error instanceof Error ? error : new Error('Failed to load ticket'));
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
  }, [id, getTicketById, toast]);
  
  const handleUpdateTicket = async (updatedTicket: Partial<SecurityTicket>) => {
    if (!id) return;
    
    try {
      await updateTicket(id, updatedTicket);
      toast({
        title: 'Success',
        description: 'Ticket updated successfully',
      });
      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate(`/tickets/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Ticket
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Edit Ticket
        </h1>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load ticket details. Please try again later.
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => navigate('/tickets')}
              >
                Return to Tickets
              </Button>
            </AlertDescription>
          </Alert>
        ) : ticket ? (
          <TicketForm 
            ticket={ticket} 
            isEditMode={true} 
            onSubmit={handleUpdateTicket}
          />
        ) : (
          <Alert>
            <AlertTitle>Ticket not found</AlertTitle>
            <AlertDescription>
              The ticket you're looking for doesn't exist or you don't have permission to view it.
              <Button 
                variant="outline" 
                className="mt-2" 
                onClick={() => navigate('/tickets')}
              >
                Return to Tickets
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AppLayout>
  );
};

export default EditTicketPage;

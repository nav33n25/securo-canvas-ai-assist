
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SecurityTicket } from '@/types/common';
import { TicketCreateData, TicketStatus } from '@/types/auth-types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useTickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getTickets = async (): Promise<SecurityTicket[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as SecurityTicket[];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTicketById = async (id: string): Promise<SecurityTicket | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as SecurityTicket;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: TicketCreateData): Promise<SecurityTicket> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error('User must be logged in to create a ticket');
      
      const newTicket = {
        ...ticketData,
        status: ticketData.status || 'open',
        priority: ticketData.priority || 'medium',
        reporter_id: user.id
      };
      
      const { data, error } = await supabase
        .from('security_tickets')
        .insert([newTicket])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Ticket Created',
        description: 'Your new security ticket has been created successfully.'
      });
      
      return data as SecurityTicket;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      
      toast({
        title: 'Error',
        description: 'Failed to create ticket. Please try again.',
        variant: 'destructive'
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (id: string, updates: Partial<SecurityTicket>): Promise<SecurityTicket> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Ticket Updated',
        description: 'The security ticket has been updated successfully.'
      });
      
      return data as SecurityTicket;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      
      toast({
        title: 'Error',
        description: 'Failed to update ticket. Please try again.',
        variant: 'destructive'
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id: string, status: TicketStatus): Promise<SecurityTicket> => {
    return updateTicket(id, { status });
  };

  const assignTicket = async (id: string, userId: string): Promise<SecurityTicket> => {
    return updateTicket(id, { assignee_id: userId });
  };

  const deleteTicket = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('security_tickets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Ticket Deleted',
        description: 'The security ticket has been deleted successfully.'
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      
      toast({
        title: 'Error',
        description: 'Failed to delete ticket. Please try again.',
        variant: 'destructive'
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getTickets,
    getTicketById,
    createTicket,
    updateTicket,
    updateTicketStatus,
    assignTicket,
    deleteTicket
  };
}

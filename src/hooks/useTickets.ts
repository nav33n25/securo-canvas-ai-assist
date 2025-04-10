
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SecurityTicket, TicketCreateData } from '@/types/common';
import { useAuth } from './useAuth';

// Re-export the types from common
export type { SecurityTicket as Ticket };
export type { TicketStatus, TicketPriority } from '@/types/common';

export function useTickets() {
  const [tickets, setTickets] = useState<SecurityTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('security_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      
      setTickets(data || []);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const createTicket = async (ticketData: TicketCreateData): Promise<any> => {
    try {
      // Add ticket_type as a default value if not present
      const data = {
        ...ticketData,
        ticket_type: ticketData.ticket_type || 'general',
        reporter_id: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newTicket, error } = await supabase
        .from('security_tickets')
        .insert(data)
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      setTickets(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (err: any) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  };

  const updateTicket = async (id: string, updates: Partial<SecurityTicket>): Promise<SecurityTicket> => {
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      setTickets(prev => prev.map(ticket => ticket.id === id ? data : ticket));
      return data;
    } catch (err: any) {
      console.error('Error updating ticket:', err);
      throw err;
    }
  };

  const deleteTicket = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('security_tickets')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
    } catch (err: any) {
      console.error('Error deleting ticket:', err);
      throw err;
    }
  };

  const getTicketById = async (id: string): Promise<SecurityTicket> => {
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (err: any) {
      console.error('Error fetching ticket by ID:', err);
      throw err;
    }
  };

  const filterTickets = (status?: string, priority?: string, search?: string) => {
    return tickets.filter(ticket => {
      const matchesStatus = !status || status === 'all' || ticket.status === status;
      const matchesPriority = !priority || priority === 'all' || ticket.priority === priority;
      const matchesSearch = !search || 
        ticket.title.toLowerCase().includes(search.toLowerCase()) || 
        (ticket.description && ticket.description.toLowerCase().includes(search.toLowerCase()));
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  };

  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    filterTickets
  };
}

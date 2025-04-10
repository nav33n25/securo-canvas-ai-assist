
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SecurityTicket, TicketCreateData } from '@/types/common';
import { useToast } from './use-toast';

export function useTickets() {
  const [tickets, setTickets] = useState<SecurityTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data, error } = await supabase
          .from('security_tickets')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setTickets(data || []);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error instanceof Error ? error : new Error('Failed to load tickets'));
        toast({
          title: 'Error',
          description: 'Failed to load tickets',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
    
    // Subscribe to changes
    const channel = supabase
      .channel('security_tickets_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_tickets'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTickets(prev => [payload.new as SecurityTicket, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setTickets(prev => 
            prev.map(ticket => 
              ticket.id === payload.new.id ? payload.new as SecurityTicket : ticket
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setTickets(prev => 
            prev.filter(ticket => ticket.id !== payload.old.id)
          );
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  // Add the missing methods
  const createTicket = async (ticketData: TicketCreateData): Promise<SecurityTicket> => {
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .insert([ticketData])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  };
  
  const updateTicket = async (id: string, ticketData: Partial<SecurityTicket>): Promise<SecurityTicket> => {
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .update(ticketData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  };
  
  const getTicketById = async (id: string): Promise<SecurityTicket> => {
    try {
      const { data, error } = await supabase
        .from('security_tickets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  };
  
  // Return all the necessary properties and methods
  return { 
    tickets, 
    loading, 
    isLoading: loading, // Alias for compatibility 
    error,
    createTicket,
    updateTicket,
    getTicketById
  };
}

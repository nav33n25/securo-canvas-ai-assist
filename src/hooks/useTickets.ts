
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SecurityTicket } from '@/types/common';
import { useToast } from './use-toast';

export function useTickets() {
  const [tickets, setTickets] = useState<SecurityTicket[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  return { tickets, loading };
}

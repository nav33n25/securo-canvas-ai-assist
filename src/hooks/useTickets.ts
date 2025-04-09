import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

export type TicketStatus = 'new' | 'in_progress' | 'in_review' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  workspace_id: string;
}

export interface TicketCreateData {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to?: string;
}

export interface TicketFilter {
  status?: TicketStatus | 'all';
  priority?: TicketPriority | 'all';
  searchTerm?: string;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const { user, workspace } = useUser();

  // Fetch all tickets for the current workspace
  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!workspace?.id) {
        throw new Error('No workspace selected');
      }

      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tickets. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new ticket
  const createTicket = async (ticketData: TicketCreateData) => {
    try {
      if (!user?.id || !workspace?.id) {
        throw new Error('User or workspace not found');
      }

      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          created_by: user.id,
          workspace_id: workspace.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update local state with the new ticket
      setTickets((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  };

  // Update an existing ticket
  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update ticket in local state
      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === id ? { ...ticket, ...data } : ticket))
      );
      
      return data;
    } catch (err) {
      console.error('Error updating ticket:', err);
      throw err;
    }
  };

  // Delete a ticket
  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove ticket from local state
      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    } catch (err) {
      console.error('Error deleting ticket:', err);
      throw err;
    }
  };

  // Get a single ticket by ID
  const getTicketById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error getting ticket:', err);
      throw err;
    }
  };

  // Filter tickets based on criteria
  const filterTickets = (filters: TicketFilter): Ticket[] => {
    return tickets.filter((ticket) => {
      const matchesStatus = !filters.status || filters.status === 'all' 
        ? true 
        : ticket.status === filters.status;
        
      const matchesPriority = !filters.priority || filters.priority === 'all' 
        ? true 
        : ticket.priority === filters.priority;
        
      const matchesSearch = !filters.searchTerm 
        ? true 
        : ticket.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
          ticket.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
          
      return matchesStatus && matchesPriority && matchesSearch;
    });
  };

  // Load tickets when workspace changes
  useEffect(() => {
    if (workspace?.id) {
      fetchTickets();
    }
  }, [workspace?.id]);

  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    filterTickets,
  };
}; 
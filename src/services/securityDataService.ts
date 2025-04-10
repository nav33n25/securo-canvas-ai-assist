
import { supabase } from '@/lib/supabase';
import { SecurityTicket } from '@/types/common';

export async function getSecurityTickets(): Promise<SecurityTicket[]> {
  const { data, error } = await supabase
    .from('security_tickets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching security tickets:', error);
    throw error;
  }
  
  return data || [];
}

export async function getSecurityTicketById(id: string): Promise<SecurityTicket> {
  const { data, error } = await supabase
    .from('security_tickets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching security ticket:', error);
    throw error;
  }
  
  return data;
}

export async function createSecurityTicket(ticket: Partial<SecurityTicket>): Promise<SecurityTicket> {
  const { data, error } = await supabase
    .from('security_tickets')
    .insert([ticket])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating security ticket:', error);
    throw error;
  }
  
  return data;
}

export async function updateSecurityTicket(id: string, updates: Partial<SecurityTicket>): Promise<SecurityTicket> {
  const { data, error } = await supabase
    .from('security_tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating security ticket:', error);
    throw error;
  }
  
  return data;
}

export async function deleteSecurityTicket(id: string): Promise<void> {
  const { error } = await supabase
    .from('security_tickets')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting security ticket:', error);
    throw error;
  }
}

export async function getTicketActivities(ticketId: string) {
  const { data, error } = await supabase
    .from('ticket_activities')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching ticket activities:', error);
    throw error;
  }
  
  return data || [];
}

export async function getTicketComments(ticketId: string) {
  const { data, error } = await supabase
    .from('ticket_comments')
    .select(`
      *,
      user:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching ticket comments:', error);
    throw error;
  }
  
  return data || [];
}

export async function addTicketComment(ticketId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('ticket_comments')
    .insert([
      {
        ticket_id: ticketId,
        user_id: userId,
        content
      }
    ])
    .select();
  
  if (error) {
    console.error('Error adding ticket comment:', error);
    throw error;
  }
  
  return data[0];
}

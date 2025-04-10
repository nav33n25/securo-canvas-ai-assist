
import { supabase } from '@/integrations/supabase/client';

// This is a placeholder API endpoint for document operations
// In a real implementation, you would implement proper CRUD operations

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .single();
      
    if (error) throw error;
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('documents')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return new Response(JSON.stringify({ error: 'Failed to update document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', params.id);
      
    if (error) throw error;
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

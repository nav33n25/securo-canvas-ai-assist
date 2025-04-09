
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface Document {
  id: string;
  title: string;
  content: any[];
  created_at: string;
  updated_at: string;
  user_id: string;
  is_template: boolean;
  template_category?: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  content: any[];
  category: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Document[];
}

export async function getDocument(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching document:', error);
    throw new Error(error.message);
  }

  // Ensure we have valid content structure
  if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
    console.warn('Document had invalid content, setting default content');
    data.content = [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  
  console.log('Retrieved document:', data);
  return data as Document;
}

export async function createDocument(document: Omit<Partial<Document>, 'title'> & { title: string }) {
  // Ensure we have valid content structure
  if (!document.content || !Array.isArray(document.content) || document.content.length === 0) {
    document.content = [{ type: 'paragraph', children: [{ text: '' }] }];
  }

  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();

  if (error) {
    console.error('Error creating document:', error);
    throw new Error(error.message);
  }
  
  console.log('Created document:', data);
  return data as Document;
}

export async function updateDocument(id: string, document: Partial<Document>) {
  // Validate content before saving
  if (document.content !== undefined) {
    if (!Array.isArray(document.content) || document.content.length === 0) {
      document.content = [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    
    // Deep clone the content to ensure we're not affected by reference issues
    document.content = JSON.parse(JSON.stringify(document.content));
  }
  
  console.log('Updating document with content:', document.content);

  // Get current user to ensure proper RLS policy compliance
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  
  if (!userId) {
    throw new Error("Authentication required to update documents");
  }
  
  try {
    // First, get current document
    const currentDoc = await getDocument(id);
    
    // Create version with explicit user_id to satisfy RLS policies
    await supabase
      .from('document_versions')
      .insert({
        document_id: id,
        content: currentDoc.content,
        version: currentDoc.version,
        user_id: userId,
        change_summary: document.title ? `Updated title to ${document.title}` : 'Updated document content'
      });
    
    // Now update the document
    const { data, error } = await supabase
      .from('documents')
      .update({
        ...document,
        version: currentDoc.version + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      throw new Error(error.message);
    }

    console.log('Document updated successfully:', data);
    return data as Document;
  } catch (error: any) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getDocumentVersions(documentId: string) {
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTemplates() {
  const { data, error } = await supabase
    .from('document_templates')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as DocumentTemplate[];
}

export async function getTemplate(id: string) {
  const { data, error } = await supabase
    .from('document_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DocumentTemplate;
}

export async function createDocumentFromTemplate(templateId: string, title: string, userId: string) {
  // Get the template
  const template = await getTemplate(templateId);
  
  // Create new document from template
  const newDocument = {
    title,
    content: template.content,
    user_id: userId,
    is_template: false,
    template_category: template.category,
    version: 1,
    status: 'draft' as const
  };
  
  return createDocument(newDocument);
}


import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { CustomElement } from '@/types/slate';

export interface Document {
  id: string;
  title: string;
  content: CustomElement[];
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
  content: CustomElement[];
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
  console.log('getDocument called for id:', id);
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching document:', error);
    throw new Error(error.message || 'Failed to fetch document');
  }

  if (!data) {
    throw new Error('Document not found');
  }

  console.log('Raw document content from database:', data.content);
  
  // Ensure we have valid content structure using our sanitize function
  const content = data.content as unknown as CustomElement[];
  data.content = sanitizeContent(content);
  
  console.log('Document after sanitization:', {
    id: data.id,
    title: data.title,
    contentLength: Array.isArray(data.content) ? data.content.length : 0,
    version: data.version,
    firstNodeType: Array.isArray(data.content) && data.content.length > 0 ? 
      (data.content[0] as CustomElement).type : 'none'
  });
  
  return data as Document;
}

export async function createDocument(document: Omit<Partial<Document>, 'title'> & { title: string }) {
  // Ensure we have valid content structure
  if (!document.content || !Array.isArray(document.content) || document.content.length === 0) {
    document.content = [{ type: 'paragraph', children: [{ text: '' }] }] as CustomElement[];
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

// Helper function to ensure content is properly structured
function sanitizeContent(content: any): CustomElement[] {
  console.log('Sanitizing content:', typeof content);
  
  // If content isn't an array or is null/undefined, create a default empty document
  if (!content || !Array.isArray(content) || content.length === 0) {
    console.log('Content is invalid, returning default paragraph');
    return [{ type: 'paragraph', children: [{ text: '' }] }] as CustomElement[];
  }

  try {
    // First convert to string and back to lose any non-serializable artifacts
    const contentString = JSON.stringify(content);
    let parsed = JSON.parse(contentString);
    
    // Ensure the result is an array
    if (!Array.isArray(parsed)) {
      console.error('Content is not an array after parsing:', parsed);
      return [{ type: 'paragraph', children: [{ text: '' }] }] as CustomElement[];
    }
    
    // Validate and fix each node in the content
    parsed = parsed.map((node: any) => {
      // Ensure node is an object
      if (typeof node !== 'object' || node === null) {
        return { type: 'paragraph', children: [{ text: '' }] };
      }
      
      // Ensure node has a type
      if (typeof node.type !== 'string') {
        return { type: 'paragraph', children: [{ text: '' }] };
      }
      
      // Ensure children array exists and has at least one text node
      if (!Array.isArray(node.children)) {
        return { ...node, children: [{ text: '' }] };
      }
      
      // Validate children
      const safeChildren = node.children.map((child: any) => {
        if (typeof child !== 'object' || child === null) {
          return { text: '' };
        }
        
        // If it's a text node
        if (typeof child.text === 'string') {
          return child;
        }
        
        // If it's a nested element
        if (typeof child.type === 'string' && Array.isArray(child.children)) {
          const grandchildren = child.children.map((gc: any) => {
            return typeof gc === 'object' && gc !== null && typeof gc.text === 'string'
              ? gc
              : { text: '' };
          });
          return { ...child, children: grandchildren };
        }
        
        return { text: '' };
      });
      
      return { ...node, children: safeChildren };
    });
    
    // One last check to ensure we have content
    if (parsed.length === 0) {
      return [{ type: 'paragraph', children: [{ text: '' }] }] as CustomElement[];
    }
    
    console.log('Sanitized content successfully, nodes count:', parsed.length);
    return parsed as CustomElement[];
  } catch (error) {
    console.error('Error sanitizing content:', error);
    return [{ type: 'paragraph', children: [{ text: '' }] }] as CustomElement[];
  }
}

export async function updateDocument(id: string, document: Partial<Document>) {
  console.log('updateDocument called with:', { id, documentTitle: document.title });
  
  if (document.content) {
    const content = document.content as CustomElement[];
    console.log('Content length to save:', content.length);
    console.log('First node type:', content[0]?.type || 'unknown');
  }
  
  // Clone document to avoid mutating the original
  const documentToUpdate = { ...document };
  
  // Validate content before saving
  if (documentToUpdate.content !== undefined) {
    try {
      // Make sure content is properly serialized to avoid any reference issues
      const contentCopy = JSON.parse(JSON.stringify(documentToUpdate.content));
      
      // Sanitize the content to ensure it's valid
      const sanitizedContent = sanitizeContent(contentCopy);
      
      if (sanitizedContent.length === 0) {
        throw new Error('Invalid document content: Empty after sanitization');
      }
      
      // Log sample of the content for debugging
      console.log('Content to save:', 
        sanitizedContent.slice(0, 2),
        `(${sanitizedContent.length} nodes total)`
      );
      
      documentToUpdate.content = sanitizedContent;
    } catch (error) {
      console.error('Content validation error:', error);
      throw new Error('Failed to prepare document content for saving');
    }
  }

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
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: id,
        content: currentDoc.content,
        version: currentDoc.version,
        user_id: userId,
        change_summary: document.title ? `Updated title to ${document.title}` : 'Updated document content'
      });
      
    if (versionError) {
      console.error('Error creating document version:', versionError);
      // Continue with the update even if versioning fails
    }
    
    // Now update the document
    const { data, error } = await supabase
      .from('documents')
      .update({
        ...documentToUpdate,
        version: currentDoc.version + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      throw new Error(error.message || 'Failed to update document');
    }

    if (!data) {
      throw new Error('No data returned from update operation');
    }

    console.log('Document updated successfully:', {
      id: data.id,
      title: data.title,
      contentLength: Array.isArray(data.content) ? (data.content as CustomElement[]).length : 0,
      version: data.version
    });
    
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


import { supabase } from '@/integrations/supabase/client';
import { Descendant } from 'slate';
import { Json } from '@/integrations/supabase/types';

export interface RecentDocument {
  id: string;
  title: string;
  updated_at: string;
  status?: string;
}

export interface Document {
  id: string;
  title: string;
  content: Descendant[];
  user_id?: string;
  created_at: string;
  updated_at: string;
  status: string;
  version: number;
  tags?: string[];
  is_template?: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: Descendant[];
}

export interface CreateDocumentInput {
  title: string;
  content: Descendant[];
  user_id: string;
  status?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: Descendant[];
  status?: string;
}

export const fetchRecentDocuments = async (userId: string): Promise<RecentDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, updated_at, status')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent documents:', error);
    return [];
  }
};

export const getDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('is_template', false)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Type cast content from Json to Descendant[]
    return (data || []).map(doc => ({
      ...doc,
      content: doc.content as unknown as Descendant[]
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

export const getDocument = async (id: string): Promise<Document | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    // Type cast content from Json to Descendant[]
    return {
      ...data,
      content: data.content as unknown as Descendant[]
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('Failed to load document');
  }
};

export const createDocument = async (input: CreateDocumentInput): Promise<Document> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title: input.title,
        content: input.content,
        user_id: input.user_id,
        status: input.status || 'draft'
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) {
      throw new Error('No data returned from document creation');
    }
    
    // Type cast content from Json to Descendant[]
    return {
      ...data,
      content: data.content as unknown as Descendant[]
    };
  } catch (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
};

export const updateDocument = async (id: string, input: UpdateDocumentInput): Promise<Document> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update({
        ...(input.title && { title: input.title }),
        ...(input.content && { content: input.content }),
        ...(input.status && { status: input.status }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) {
      throw new Error('No data returned from document update');
    }
    
    // Type cast content from Json to Descendant[]
    return {
      ...data,
      content: data.content as unknown as Descendant[]
    };
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
};

export const getTemplates = async (): Promise<DocumentTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('document_templates')
      .select('id, name, description, category, content');
      
    if (error) throw error;
    
    // Type cast content from Json to Descendant[]
    return (data || []).map(template => ({
      ...template,
      content: template.content as unknown as Descendant[]
    }));
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

export const createDocumentFromTemplate = async (
  templateId: string, 
  title: string, 
  userId: string
): Promise<Document> => {
  try {
    // First, fetch the template
    const { data: template, error: templateError } = await supabase
      .from('document_templates')
      .select('content')
      .eq('id', templateId)
      .single();
      
    if (templateError) throw templateError;
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Then create a new document based on the template
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title,
        content: template.content,
        user_id: userId,
        status: 'draft'
      }])
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) {
      throw new Error('No data returned from document creation');
    }
    
    // Type cast content from Json to Descendant[]
    return {
      ...data,
      content: data.content as unknown as Descendant[]
    };
  } catch (error) {
    console.error('Error creating document from template:', error);
    throw new Error('Failed to create document from template');
  }
};

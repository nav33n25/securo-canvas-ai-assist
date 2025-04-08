
import { supabase } from '@/integrations/supabase/client';

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
    throw new Error(error.message);
  }

  return data as Document;
}

export async function createDocument(document: Partial<Document>) {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Document;
}

export async function updateDocument(id: string, document: Partial<Document>) {
  // First, create a version record
  const currentDoc = await getDocument(id);
  
  await supabase
    .from('document_versions')
    .insert({
      document_id: id,
      content: currentDoc.content,
      version: currentDoc.version,
      user_id: currentDoc.user_id,
      change_summary: 'Document updated'
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
    throw new Error(error.message);
  }

  return data as Document;
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
    status: 'draft'
  };
  
  return createDocument(newDocument as Partial<Document>);
}

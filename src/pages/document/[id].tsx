
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocument, updateDocument } from '@/services/documentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import DocumentEditor from '@/components/editor/DocumentEditor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Descendant } from 'slate';
import { ArrowLeft, Save } from 'lucide-react';

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [documentTitle, setDocumentTitle] = useState('');
  const [editorContent, setEditorContent] = useState<Descendant[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Get document query
  const { data: document, isLoading, error, refetch } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocument(id!),
    enabled: !!id && !!user,
    retry: 1,
  });

  // Update document mutation
  const { mutate: saveDocument, isPending: isSaving } = useMutation({
    mutationFn: () => updateDocument(id!, {
      title: documentTitle,
      content: editorContent,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
      setHasChanges(false);
    },
    onError: (error: any) => {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to save document. Please try again.",
      });
    }
  });

  // Set initial document data
  useEffect(() => {
    if (document) {
      setDocumentTitle(document.title);
      
      // Ensure document content is valid
      if (Array.isArray(document.content) && document.content.length > 0) {
        setEditorContent(document.content);
      } else {
        // Set default content if the document content is invalid
        setEditorContent([{ type: 'paragraph', children: [{ text: '' }] }]);
      }
      setHasChanges(false);
    }
  }, [document]);

  // Handle content changes
  const handleContentChange = useCallback((newContent: Descendant[]) => {
    if (Array.isArray(newContent) && newContent.length > 0) {
      setEditorContent(newContent);
      setHasChanges(true);
    }
  }, []);

  // Handle saving the document
  const handleSave = useCallback(() => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to save documents.",
      });
      return;
    }

    if (!Array.isArray(editorContent) || editorContent.length === 0) {
      console.error("Invalid editor content:", editorContent);
      toast({
        variant: "destructive",
        title: "Cannot save",
        description: "The document content is invalid. Please refresh and try again.",
      });
      return;
    }

    saveDocument();
  }, [user, saveDocument, editorContent]);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
    setHasChanges(true);
  };

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Document Error</h1>
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            Error loading document. It may have been deleted or you don't have permission to view it.
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/documents')}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-4">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/documents')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {isLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <div className="flex-1 flex justify-between items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={documentTitle}
                  onChange={handleTitleChange}
                  className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                  placeholder="Document Title"
                />
              </div>
              <Button 
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-secure hover:bg-secure-darker"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
              </Button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <DocumentEditor 
            initialValue={editorContent} 
            onChange={handleContentChange}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default DocumentPage;

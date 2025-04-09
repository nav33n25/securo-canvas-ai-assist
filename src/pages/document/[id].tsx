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
import { ArrowLeft } from 'lucide-react';

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [documentTitle, setDocumentTitle] = useState('');
  const [editorContent, setEditorContent] = useState<Descendant[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Get document query
  const { data: document, isLoading, error, refetch } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocument(id!),
    enabled: !!id && !!user,
    retry: 1,
  });

  // Update document mutation
  const { mutate: saveDocument, isPending: isSaving } = useMutation({
    mutationFn: () => {
      // Create a deep copy of the content to ensure we're not affected by references
      const contentCopy = JSON.parse(JSON.stringify(editorContent));
      
      console.log('Saving document with deep copied content:', contentCopy);
      return updateDocument(id!, {
        title: documentTitle,
        content: contentCopy,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Document saved",
        description: "Your security document has been saved successfully.",
      });
      setHasChanges(false);
      setLastSaved(new Date());
      console.log('Document saved successfully:', data);
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
      console.log('Document loaded:', document);
      setDocumentTitle(document.title);
      
      // Ensure document content is valid
      if (Array.isArray(document.content) && document.content.length > 0) {
        console.log('Setting editor content:', document.content);
        setEditorContent(document.content);
      } else {
        // Set default content if the document content is invalid
        console.warn('Invalid document content, setting default');
        setEditorContent([{ type: 'paragraph', children: [{ text: '' }] }]);
      }
      
      // If the document has an updated_at timestamp, use that for last saved
      if (document.updated_at) {
        setLastSaved(new Date(document.updated_at));
      }
      
      setHasChanges(false);
    }
  }, [document]);

  // Handle content changes
  const handleContentChange = useCallback((newContent: Descendant[]) => {
    if (Array.isArray(newContent) && newContent.length > 0) {
      console.log('Content changed in document page, length:', newContent.length);
      
      // Ensure we're setting a new reference to trigger state updates
      const contentCopy = JSON.parse(JSON.stringify(newContent));
      setEditorContent(contentCopy);
      setHasChanges(true);
    } else {
      console.error('Invalid content received from editor:', newContent);
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

    // Log the content being saved
    console.log('Saving document, content length:', editorContent.length);
    console.log('Content sample:', editorContent[0]);
    
    try {
      // Make sure we can stringify and parse the content before saving
      const contentCopy = JSON.parse(JSON.stringify(editorContent));
      
      // Use mutate to save the document with the content copy
      saveDocument();
    } catch (err) {
      console.error('Error preparing content for save:', err);
      toast({
        variant: "destructive",
        title: "Save error",
        description: "There was an error preparing your document for saving. Please try again.",
      });
    }
  }, [user, saveDocument, editorContent]);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
    setHasChanges(true);
  };

  // Prompt before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        return e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

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
        <div className="flex items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/documents')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={documentTitle}
                onChange={handleTitleChange}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Document Title"
              />
            </div>
            <DocumentEditor 
              initialValue={editorContent} 
              onChange={handleContentChange}
              title={documentTitle || "Untitled Security Document"}
              onSave={handleSave}
              isSaving={isSaving}
              lastSaved={lastSaved}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DocumentPage;

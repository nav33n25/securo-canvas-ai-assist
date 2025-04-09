
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { CustomElement } from '@/types/slate';

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [documentTitle, setDocumentTitle] = useState('');
  const [editorContent, setEditorContent] = useState<Descendant[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  const initialLoadCompleted = useRef(false);
  
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
      try {
        console.log('Preparing to save document', {
          id,
          title: documentTitle,
          contentLength: editorContent?.length || 0
        });
        
        if (!editorContent || !Array.isArray(editorContent) || editorContent.length === 0) {
          console.error('Invalid editor content to save:', editorContent);
          throw new Error('Cannot save empty content');
        }
        
        // Create a deep copy to ensure we're not affected by references
        const contentCopy = JSON.parse(JSON.stringify(editorContent)) as CustomElement[];
        
        return updateDocument(id!, {
          title: documentTitle,
          content: contentCopy,
        });
      } catch (err) {
        console.error('Error preparing content for save:', err);
        throw new Error('Failed to prepare document for saving');
      }
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
    if (document && !initialLoadCompleted.current) {
      console.log('Document loaded, setting initial data:', {
        id: document.id,
        title: document.title,
        contentExists: !!document.content,
        contentIsArray: Array.isArray(document.content),
        contentLength: document.content?.length || 0,
        version: document.version
      });
      
      setDocumentTitle(document.title);
      
      // Ensure document content is valid
      if (Array.isArray(document.content) && document.content.length > 0) {
        console.log('Setting editor content:', 
          document.content.slice(0, 2), 
          `(${document.content.length} nodes total)`
        );
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
      initialLoadCompleted.current = true;
    }
  }, [document]);

  // Clear auto-save timer when component unmounts
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current !== null) {
        window.clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Setup auto-save functionality
  const setupAutoSave = useCallback(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current !== null) {
      window.clearTimeout(autoSaveTimerRef.current);
    }
    
    // Only set up auto-save if there are changes to save
    if (hasChanges && user && id) {
      console.log('Setting up auto-save timer');
      autoSaveTimerRef.current = window.setTimeout(() => {
        console.log('Auto-saving document');
        saveDocument();
      }, 60000); // Auto-save after 60 seconds of inactivity
    }
  }, [hasChanges, user, id, saveDocument]);

  // Set up auto-save whenever hasChanges changes
  useEffect(() => {
    setupAutoSave();
  }, [hasChanges, setupAutoSave]);

  // Handle content changes
  const handleContentChange = useCallback((newContent: Descendant[]) => {
    console.log('Content changed in document page');
    
    if (!Array.isArray(newContent)) {
      console.error('Received non-array content:', newContent);
      return;
    }
    
    if (newContent.length === 0) {
      console.warn('Received empty content array, adding default paragraph');
      newContent = [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    
    console.log('Setting editor content with length:', newContent.length);
    
    // Ensure we're setting a new reference to trigger state updates
    setEditorContent([...newContent]);
    setHasChanges(true);
    
    // Reset auto-save timer
    setupAutoSave();
  }, [setupAutoSave]);

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

    if (!editorContent || !Array.isArray(editorContent)) {
      console.error("Invalid editor content:", editorContent);
      toast({
        variant: "destructive",
        title: "Cannot save",
        description: "The document content is invalid. Please refresh and try again.",
      });
      return;
    }

    if (editorContent.length === 0) {
      console.warn("Empty editor content, adding default paragraph");
      setEditorContent([{ type: 'paragraph', children: [{ text: '' }] }]);
    }

    // Log the content being saved
    console.log('Manual save triggered, content length:', editorContent.length);
    
    // Clear auto-save timer when manually saving
    if (autoSaveTimerRef.current !== null) {
      window.clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    
    saveDocument();
  }, [user, saveDocument, editorContent]);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
    setHasChanges(true);
    setupAutoSave();
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
      <div className="container mx-auto py-4 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/documents')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {!isLoading && (
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="bg-blue-500 hover:bg-blue-600"
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
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

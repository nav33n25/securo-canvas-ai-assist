
import React, { useState, useCallback } from 'react';
import { Descendant } from 'slate';
import SecurityEditor from './SecurityEditor';
import { Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DocumentEditorProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
  title?: string;
  onSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  readOnly?: boolean;
}

// Default valid empty content
const emptyEditorContent: Descendant[] = [{ 
  type: 'paragraph' as const, 
  children: [{ text: '' }] 
}];

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  initialValue, 
  onChange, 
  title = "Untitled Security Document",
  onSave,
  isSaving = false,
  lastSaved = null,
  readOnly = false
}) => {
  console.log('DocumentEditor render with initialValue length:', 
    Array.isArray(initialValue) ? initialValue.length : 'not an array');
  
  // Convert Slate format to Novel format (simplified for example)
  const convertToNovelFormat = (slateContent: Descendant[]) => {
    // In a real implementation, you would need to convert Slate's format to Novel's format
    // This is a simplification
    return {
      type: 'doc',
      content: slateContent.map(node => {
        let type = 'paragraph';
        if ((node as any).type === 'heading-one') type = 'heading';
        if ((node as any).type === 'heading-two') type = 'heading';
        if ((node as any).type === 'heading-three') type = 'heading';
        if ((node as any).type === 'bulleted-list') type = 'bulletList';
        if ((node as any).type === 'numbered-list') type = 'orderedList';
        
        return {
          type,
          content: [{
            type: 'text',
            text: (node as any).children?.map((child: any) => child.text).join('') || ''
          }]
        };
      })
    };
  };

  // Convert Novel format to Slate format (simplified for example)
  const convertToSlateFormat = (novelContent: any): Descendant[] => {
    // In a real implementation, you would need to convert Novel's format to Slate's format
    // This is a simplification
    if (!novelContent || !novelContent.content) {
      return emptyEditorContent;
    }
    
    return novelContent.content.map((node: any) => {
      let type = 'paragraph';
      if (node.type === 'heading') type = 'heading-two';
      if (node.type === 'bulletList') type = 'bulleted-list';
      if (node.type === 'orderedList') type = 'numbered-list';
      
      return {
        type: type as any,
        children: [{ 
          text: node.content?.[0]?.text || '' 
        }]
      };
    }) as Descendant[];
  };

  // Default value using the convert function
  const defaultNovelValue = convertToNovelFormat(
    Array.isArray(initialValue) && initialValue.length > 0 ? initialValue : emptyEditorContent
  );
  
  // Handle content changes with debounce
  const handleContentChange = useCallback((newContent: any) => {
    console.log('Novel editor content changed');
    
    try {
      // Convert content from Novel format to Slate format
      const slateContent = convertToSlateFormat(newContent);
      onChange(slateContent);
    } catch (err) {
      console.error('Error processing content change:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem updating the document content.",
      });
    }
  }, [onChange]);

  // Force content sync before save
  const handleSave = useCallback(() => {
    if (onSave) {
      console.log('Saving document content');
      onSave();
    }
  }, [onSave]);

  return (
    <SecurityEditor
      initialContent={defaultNovelValue}
      title={title}
      onSave={handleSave}
      onContentChange={handleContentChange}
      isSaving={isSaving}
      lastSaved={lastSaved}
      readOnly={readOnly}
    />
  );
};

export default DocumentEditor;

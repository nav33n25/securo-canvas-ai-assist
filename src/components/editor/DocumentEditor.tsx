
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { renderElement, renderLeaf } from './RenderElements';
import { Card, CardContent } from '@/components/ui/card';
import { withSecurityBlocks } from './withSecurityBlocks';
import { Shield } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import { toast } from '@/components/ui/use-toast';
import { CustomElement } from '@/types/slate';

interface DocumentEditorProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
}

// Default valid empty slate content
const emptyEditorContent: Descendant[] = [{ 
  type: 'paragraph' as const, 
  children: [{ text: '' }] 
}];

const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialValue, onChange }) => {
  // Use initialValue from props, but fallback to empty content if it's empty or invalid
  const defaultValue = useMemo(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      // Validate that content elements have proper type strings that match our CustomElement types
      const isValid = initialValue.every(node => 
        typeof (node as any).type === 'string' && Array.isArray((node as any).children)
      );
      return isValid ? initialValue : emptyEditorContent;
    }
    return emptyEditorContent;
  }, [initialValue]);
  
  const [value, setValue] = useState<Descendant[]>(defaultValue);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const editor = useMemo(() => {
    return withSecurityBlocks(withHistory(withReact(createEditor())));
  }, []);

  // If initialValue changes (e.g., when document is loaded), update the editor
  useEffect(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      // Additional validation to ensure content conforms to expected types
      try {
        setValue(initialValue);
      } catch (error) {
        console.error('Error setting editor value:', error);
        toast({
          variant: "destructive",
          title: "Editor Error",
          description: "There was an issue loading the document content.",
        });
      }
    }
  }, [initialValue]);

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  const handleChange = useCallback((newValue: Descendant[]) => {
    // Validate the value to ensure it's properly structured
    if (Array.isArray(newValue) && newValue.length > 0) {
      setValue(newValue);
      onChange(newValue);
    } else {
      console.error('Invalid editor value:', newValue);
      // Prevent saving invalid content that could break the editor
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card className="shadow-md border-secure/20 dark:bg-background/95">
        <CardContent className="p-0">
          <div className="flex gap-4 h-full">
            <div className={`flex-1 ${showAIAssistant ? 'w-2/3' : 'w-full'}`}>
              <Toolbar editor={editor} onToggleAI={toggleAIAssistant} showAI={showAIAssistant} />
              <div className="border rounded-md p-4 mt-2 min-h-[500px] slate-content bg-white dark:bg-slate-900 shadow-inner">
                <div className="mb-4 px-4 py-2 bg-secure/10 rounded-md border border-secure/20">
                  <div className="flex items-center gap-2 text-secure">
                    <Shield size={16} />
                    <span className="text-sm font-medium">Secure Document Editor</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use security blocks to highlight important security information
                  </p>
                </div>
                <Slate 
                  editor={editor} 
                  initialValue={value}
                  onChange={handleChange}
                >
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Begin documenting your security practices..."
                    spellCheck
                    autoFocus
                    className="min-h-[500px] focus:outline-none"
                  />
                </Slate>
              </div>
            </div>
            
            {showAIAssistant && (
              <div className="w-1/3">
                <AIAssistantPanel editor={editor} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentEditor;

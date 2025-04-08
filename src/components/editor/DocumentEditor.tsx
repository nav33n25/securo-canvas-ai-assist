
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
import { Button } from '@/components/ui/button';

interface DocumentEditorProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
  title?: string;
  onSave?: () => void;
}

// Default valid empty slate content
const emptyEditorContent: Descendant[] = [{ 
  type: 'paragraph' as const, 
  children: [{ text: '' }] 
}];

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  initialValue, 
  onChange, 
  title = "Untitled Security Document",
  onSave 
}) => {
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-secure">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={toggleAIAssistant}
            variant={showAIAssistant ? "default" : "outline"}
            className={showAIAssistant ? "bg-secure hover:bg-secure-darker" : ""}
          >
            AI Assistant
          </Button>
          
          {onSave && (
            <Button onClick={onSave} className="bg-blue-500 hover:bg-blue-600">
              Save
            </Button>
          )}
        </div>
      </div>
      
      <Card className="shadow-md border-secure/20 bg-slate-900 text-white">
        <CardContent className="p-0">
          <div className="flex gap-4 h-full">
            <div className={`flex-1 ${showAIAssistant ? 'w-2/3' : 'w-full'}`}>
              <Toolbar editor={editor} onToggleAI={toggleAIAssistant} showAI={showAIAssistant} />
              <div className="border border-slate-700 rounded-md p-4 mt-2 min-h-[500px] slate-content bg-slate-900 shadow-inner">
                <Slate 
                  editor={editor} 
                  initialValue={value}
                  onChange={handleChange}
                >
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Create your security documentation here..."
                    spellCheck
                    autoFocus
                    className="min-h-[500px] focus:outline-none text-slate-100"
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

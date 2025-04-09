
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { renderElement, renderLeaf } from './RenderElements';
import { Card, CardContent } from '@/components/ui/card';
import { withSecurityBlocks } from './withSecurityBlocks';
import { Shield, Save, Eye, Clock, AlertTriangle } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import { toast } from '@/components/ui/use-toast';
import { CustomElement } from '@/types/slate';
import { Button } from '@/components/ui/button';

interface DocumentEditorProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
  title?: string;
  onSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
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
  onSave,
  isSaving = false,
  lastSaved = null
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
  const [securityScore, setSecurityScore] = useState<number>(0);
  
  const editor = useMemo(() => {
    return withSecurityBlocks(withHistory(withReact(createEditor())));
  }, []);

  // If initialValue changes (e.g., when document is loaded), update the editor
  useEffect(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      // Additional validation to ensure content conforms to expected types
      try {
        setValue(initialValue);
        calculateSecurityScore(initialValue);
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

  // Calculate a basic security score based on document content
  const calculateSecurityScore = useCallback((content: Descendant[]) => {
    if (!Array.isArray(content)) return 0;
    
    let score = 0;
    const totalBlocks = content.length;
    let securityBlocks = 0;
    
    // Count security-specific blocks
    content.forEach(node => {
      const type = (node as CustomElement).type;
      if (type === 'security-note' || type === 'vulnerability' || 
          type === 'compliance' || type === 'warning') {
        securityBlocks++;
        score += 10;
      }
      
      // Check for security keywords in text content
      const textContent = JSON.stringify(node);
      const securityKeywords = ['security', 'vulnerability', 'risk', 'threat', 'compliance', 'policy', 'control'];
      securityKeywords.forEach(keyword => {
        if (textContent.toLowerCase().includes(keyword.toLowerCase())) {
          score += 2;
        }
      });
    });
    
    // Add points for document length/complexity
    score += Math.min(totalBlocks * 2, 30);
    
    setSecurityScore(Math.min(score, 100));
  }, []);

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  const handleChange = useCallback((newValue: Descendant[]) => {
    // Validate the value to ensure it's properly structured
    if (Array.isArray(newValue) && newValue.length > 0) {
      setValue(newValue);
      onChange(newValue);
      calculateSecurityScore(newValue);
    } else {
      console.error('Invalid editor value:', newValue);
      // Prevent saving invalid content that could break the editor
    }
  }, [onChange, calculateSecurityScore]);

  const handleSave = useCallback(() => {
    if (onSave) {
      console.log('Saving document with content:', value);
      onSave();
    }
  }, [onSave, value]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-secure">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        
        <div className="flex gap-2 items-center">
          {lastSaved && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          
          <div className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full">
            <AlertTriangle className={`h-4 w-4 ${securityScore > 70 ? 'text-green-500' : securityScore > 40 ? 'text-yellow-500' : 'text-red-500'}`} />
            <span className="text-sm">Security Score: {securityScore}</span>
          </div>
          
          <Button 
            onClick={toggleAIAssistant}
            variant={showAIAssistant ? "default" : "outline"}
            className={showAIAssistant ? "bg-secure hover:bg-secure-darker" : ""}
          >
            AI Assistant
          </Button>
          
          <Button 
            onClick={handleSave} 
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
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

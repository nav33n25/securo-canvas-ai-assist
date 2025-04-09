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

  // Calculate a more robust security score based on document content
  const calculateSecurityScore = useCallback((content: Descendant[]) => {
    if (!Array.isArray(content) || content.length === 0) return 0;
    
    let score = 0;
    const totalBlocks = content.length;
    const totalLength = JSON.stringify(content).length;
    let securityBlocks = 0;
    
    // Security categories with weights
    const securityCategories = {
      securityNote: { weight: 8, count: 0 },
      vulnerability: { weight: 10, count: 0 },
      compliance: { weight: 12, count: 0 },
      warning: { weight: 6, count: 0 },
      control: { weight: 10, count: 0 },
    };
    
    // Security keywords with weights
    const securityKeywords = {
      'security': 2,
      'vulnerability': 3,
      'risk': 2,
      'threat': 3,
      'compliance': 2,
      'policy': 2,
      'control': 2,
      'mitigation': 4,
      'encryption': 5,
      'authentication': 4,
      'authorization': 4,
      'audit': 3,
      'protect': 1,
      'defense': 2,
      'incident': 3,
      'response': 1,
      'firewall': 2,
      'monitoring': 2,
      'patch': 3,
    };
    
    // Count security-specific blocks
    content.forEach(node => {
      const type = (node as CustomElement).type;
      if (type === 'security-note') securityCategories.securityNote.count++;
      if (type === 'vulnerability') securityCategories.vulnerability.count++;
      if (type === 'compliance') securityCategories.compliance.count++;
      if (type === 'warning') securityCategories.warning.count++;
      if (type === 'control') securityCategories.control.count++;
      
      // Check for security keywords in text content
      const textContent = JSON.stringify(node).toLowerCase();
      Object.entries(securityKeywords).forEach(([keyword, weight]) => {
        // Count occurrences of each keyword
        const matches = textContent.match(new RegExp(keyword.toLowerCase(), 'g'));
        if (matches) {
          // Cap the score contribution per keyword to prevent keyword stuffing
          const occurrences = Math.min(matches.length, 5);
          score += occurrences * weight;
        }
      });
    });
    
    // Add scores for security blocks with diminishing returns
    Object.entries(securityCategories).forEach(([category, data]) => {
      securityBlocks += data.count;
      // Apply diminishing returns to prevent gaming the score with excess blocks
      score += Math.min(data.count, 10) * data.weight;
    });
    
    // Add points for document complexity based on length with a cap
    const lengthScore = Math.min(totalLength / 500, 15);
    score += lengthScore;
    
    // Add points for document structure (variety of block types)
    const uniqueBlockTypes = new Set(content.map(node => (node as CustomElement).type)).size;
    score += uniqueBlockTypes * 3;
    
    // Normalize the score to a 0-100 scale
    const normalizedScore = Math.min(Math.round(score), 100);
    setSecurityScore(normalizedScore);
    
    return normalizedScore;
  }, []);

  // Validate content structure to ensure security
  const validateContent = useCallback((content: any): Descendant[] => {
    if (!Array.isArray(content)) {
      console.error('Invalid content format:', content);
      return emptyEditorContent;
    }
    
    try {
      // Ensure each node has required properties
      const sanitizedContent = content.map(node => {
        // Ensure node has a valid type
        if (typeof node.type !== 'string') {
          return { type: 'paragraph', children: [{ text: '' }] };
        }
        
        // Ensure node has children array
        if (!Array.isArray(node.children)) {
          return { ...node, children: [{ text: '' }] };
        }
        
        // Sanitize children to ensure they have text property
        const sanitizedChildren = node.children.map((child: any) => {
          if (typeof child === 'object') {
            return { text: typeof child.text === 'string' ? child.text : '', ...child };
          }
          return { text: '' };
        });
        
        return { ...node, children: sanitizedChildren };
      });
      
      return sanitizedContent;
    } catch (error) {
      console.error('Content validation error:', error);
      return emptyEditorContent;
    }
  }, []);

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  const handleChange = useCallback((newValue: Descendant[]) => {
    // Validate and sanitize the value to ensure it's properly structured
    const validatedContent = validateContent(newValue);
    
    // First update local state for the editor
    setValue(validatedContent);
    
    // Then notify parent component of the change
    // Using a short timeout to ensure we're not calling the parent too frequently
    // and to ensure that React has processed the state update
    setTimeout(() => {
      console.log('Sending content update to parent:', validatedContent);
      onChange(validatedContent);
    }, 0);
    
    calculateSecurityScore(validatedContent);
  }, [onChange, calculateSecurityScore, validateContent]);

  const handleSave = useCallback(() => {
    if (onSave) {
      // Use the latest value from state to ensure we have the most recent changes
      console.log('Saving document with content from state:', value);
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

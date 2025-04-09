import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Node } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { renderElement, renderLeaf } from './RenderElements';
import { Card, CardContent } from '@/components/ui/card';
import { withSecurityBlocks } from './withSecurityBlocks';
import { Shield, Save, Clock } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import { toast } from '@/components/ui/use-toast';
import { CustomElement, CustomText } from '@/types/slate';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentEditorProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
  title?: string;
  onSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  readOnly?: boolean;
}

// Default valid empty slate content
const emptyEditorContent: Descendant[] = [{ 
  type: 'paragraph' as const, 
  children: [{ text: '' }] 
}];

// Define template option type
interface SecurityTemplateOption {
  title: string;
  roles: string[];
  template: CustomElement[];
}

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
  
  if (Array.isArray(initialValue) && initialValue.length > 0) {
    console.log('First node type:', (initialValue[0] as any).type);
    console.log('First node children:', (initialValue[0] as any).children);
  }

  // Use initialValue from props, but fallback to empty content if it's empty or invalid
  const defaultValue = useMemo(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      // Validate that content elements have proper type strings that match our CustomElement types
      const isValid = initialValue.every(node => 
        typeof (node as any).type === 'string' && Array.isArray((node as any).children)
      );
      console.log('Initial content is valid:', isValid);
      if (isValid) {
        console.log('Using provided initial value');
        return initialValue;
      }
    }
    console.log('Using empty content because initialValue is invalid');
    return emptyEditorContent;
  }, [initialValue]);
  
  const [value, setValue] = useState<Descendant[]>(defaultValue);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const previousValueRef = useRef<string>(JSON.stringify(defaultValue));
  const contentChangeTimeoutRef = useRef<number | null>(null);
  const isInitialRender = useRef<boolean>(true);
  const editorRef = useRef<Editor | null>(null);
  
  const editor = useMemo(() => {
    const e = withSecurityBlocks(withHistory(withReact(createEditor())));
    editorRef.current = e;
    return e;
  }, []);

  // If initialValue changes (e.g., when document is loaded), update the editor
  useEffect(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      // Additional validation to ensure content conforms to expected types
      try {
        console.log('Updating editor content from new initialValue, length:', initialValue.length);
        
        // Reset the editor to clear any existing content
        editor.children = initialValue;
        editor.selection = { anchor: { path: [0, 0], offset: 0 }, focus: { path: [0, 0], offset: 0 } };
        
        // Update the React state
        setValue([...initialValue]);
        previousValueRef.current = JSON.stringify(initialValue);
        isInitialRender.current = false;
        
        console.log('Editor content set successfully to:', initialValue);
      } catch (error) {
        console.error('Error setting editor value:', error);
        toast({
          variant: "destructive",
          title: "Editor Error",
          description: "There was an issue loading the document content.",
        });
        
        // Set to empty content if there was an error
        setValue([...emptyEditorContent]);
      }
    } else {
      console.warn('Received invalid initialValue, using empty content');
      setValue([...emptyEditorContent]);
    }
  }, [initialValue, editor]);

  // Normalize slate content to ensure it's valid
  const normalizeSlateContent = useCallback((content: any[]): Descendant[] => {
    if (!Array.isArray(content) || content.length === 0) {
      return emptyEditorContent;
    }

    // Ensure each node has a valid structure
    return content.map(node => {
      // Make sure node has a type
      if (typeof node.type !== 'string') {
        return { type: 'paragraph', children: [{ text: '' }] };
      }

      // Ensure children array exists and has at least one text node
      if (!Array.isArray(node.children) || node.children.length === 0) {
        return { ...node, children: [{ text: '' }] };
      }

      // Process each child to ensure it has text property
      const children = node.children.map((child: any) => {
        if (typeof child !== 'object' || child === null) {
          return { text: '' };
        }
        
        // If it's a text node
        if (typeof child.text === 'string') {
          return child;
        }
        
        // If it's a nested element
        if (typeof child.type === 'string' && Array.isArray(child.children)) {
          const normalizedChildren = child.children.map((grandchild: any) => {
            return typeof grandchild.text === 'string' ? grandchild : { text: '' };
          });
          return { ...child, children: normalizedChildren };
        }
        
        return { text: '' };
      });

      return { ...node, children };
    });
  }, []);

  // Handle content changes with debounce
  const handleChange = useCallback((newValue: Descendant[]) => {
    console.log('Editor content changed, length:', newValue.length);
    
    // Set the value immediately for the editor
    setValue(newValue);
    
    // Clear any existing timeout
    if (contentChangeTimeoutRef.current) {
      window.clearTimeout(contentChangeTimeoutRef.current);
    }
    
    // Debounce the notification to parent to avoid too many updates
    contentChangeTimeoutRef.current = window.setTimeout(() => {
      // Deep normalize content to ensure it's valid
      const normalizedContent = normalizeSlateContent(newValue);
      
      // Only update if content actually changed
      const contentString = JSON.stringify(normalizedContent);
      if (contentString !== previousValueRef.current) {
        console.log('Content changed, notifying parent, length:', normalizedContent.length);
        previousValueRef.current = contentString;
        onChange(normalizedContent);
      }
    }, 300);
  }, [onChange, normalizeSlateContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (contentChangeTimeoutRef.current) {
        window.clearTimeout(contentChangeTimeoutRef.current);
      }
    };
  }, []);

  // Force content sync before save
  const handleSave = useCallback(() => {
    if (onSave) {
      // Normalize current editor value
      const normalizedContent = normalizeSlateContent(value);
      
      // Force update parent with latest content before saving
      onChange(normalizedContent);
      console.log('Saving normalized document content, length:', normalizedContent.length);
      
      // Small delay to ensure state updates propagate
      setTimeout(() => {
        onSave();
      }, 50);
    }
  }, [onSave, value, onChange, normalizeSlateContent]);

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  // Add role-based access
  const { role } = useAuth();
  
  // Add security template functionality
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  
  // Define security-specific blocks based on roles
  const securityTemplateOptions = [
    {
      title: 'Vulnerability Details',
      roles: ['individual', 'team_member', 'team_manager', 'administrator'],
      template: [
        { type: 'heading', level: 2, children: [{ text: 'Vulnerability Details' }] },
        { type: 'paragraph', children: [{ text: 'Description: ' }] },
        { type: 'paragraph', children: [{ text: 'Severity: High/Medium/Low' }] },
        { type: 'paragraph', children: [{ text: 'Affected Components: ' }] },
        { type: 'paragraph', children: [{ text: 'Reproduction Steps: ' }] },
      ]
    },
    {
      title: 'Risk Assessment',
      roles: ['team_member', 'team_manager', 'administrator'],
      template: [
        { type: 'heading', level: 2, children: [{ text: 'Risk Assessment' }] },
        { type: 'paragraph', children: [{ text: 'Impact: ' }] },
        { type: 'paragraph', children: [{ text: 'Likelihood: ' }] },
        { type: 'paragraph', children: [{ text: 'Overall Risk: ' }] },
        { type: 'paragraph', children: [{ text: 'Business Context: ' }] },
      ]
    },
    {
      title: 'Compliance Requirements',
      roles: ['team_manager', 'administrator'],
      template: [
        { type: 'heading', level: 2, children: [{ text: 'Compliance Requirements' }] },
        { type: 'paragraph', children: [{ text: 'Regulatory Standards: ' }] },
        { type: 'paragraph', children: [{ text: 'Control Requirements: ' }] },
        { type: 'paragraph', children: [{ text: 'Audit Evidence: ' }] },
      ]
    },
    {
      title: 'Executive Summary',
      roles: ['team_manager', 'administrator'],
      template: [
        { type: 'heading', level: 2, children: [{ text: 'Executive Summary' }] },
        { type: 'paragraph', children: [{ text: 'Key Findings: ' }] },
        { type: 'paragraph', children: [{ text: 'Business Impact: ' }] },
        { type: 'paragraph', children: [{ text: 'Recommended Actions: ' }] },
        { type: 'paragraph', children: [{ text: 'Timeline: ' }] },
      ]
    }
  ];
  
  // Filter template options based on user role
  const availableTemplateOptions = securityTemplateOptions.filter(option => {
    if (!role) return false;
    return option.roles.includes(role);
  });

  // Update the insertSecurityTemplate function with proper typing
  const insertSecurityTemplate = useCallback((templateOption: SecurityTemplateOption) => {
    editor.insertNodes(templateOption.template);
    setShowSecurityOptions(false);
  }, [editor]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 text-secure">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md">{title}</h1>
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
          {lastSaved && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="bg-secure hover:bg-secure-darker"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button 
            onClick={toggleAIAssistant}
            variant={showAIAssistant ? "default" : "outline"}
            className={showAIAssistant ? "bg-secure hover:bg-secure-darker" : ""}
            size="sm"
          >
            AI Assistant
          </Button>
        </div>
      </div>
      
      <Card className="shadow-md border-secure/20 bg-slate-900 text-white">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            <div className={`flex-1 ${showAIAssistant ? 'lg:w-2/3' : 'w-full'}`}>
              <Toolbar editor={editor} onToggleAI={toggleAIAssistant} showAI={showAIAssistant} />
              <div className="border border-slate-700 rounded-md p-2 sm:p-4 mt-2 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] slate-content bg-slate-900 shadow-inner">
                <Slate 
                  editor={editor} 
                  initialValue={value}
                  onChange={handleChange}
                  key={`editor-${title}-${value.length}`} // Force recreation on major changes
                >
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Create your security documentation here..."
                    spellCheck
                    autoFocus
                    className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px] focus:outline-none text-slate-100"
                  />
                </Slate>
              </div>
            </div>
            
            {showAIAssistant && (
              <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
                <AIAssistantPanel editor={editor} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Add a security templates toolbar */}
      {!readOnly && (
        <div className="mb-2 flex items-center">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecurityOptions(!showSecurityOptions)}
              className="flex items-center gap-2 mr-2"
            >
              <Shield className="h-4 w-4" />
              <span>Security Templates</span>
            </Button>
            
            {showSecurityOptions && (
              <div className="absolute top-full left-0 mt-1 w-64 z-50 bg-background border rounded-md shadow-md p-2">
                <div className="text-sm font-medium mb-2">Insert Security Content</div>
                <div className="space-y-1">
                  {availableTemplateOptions.map((option) => (
                    <Button 
                      key={option.title} 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-left"
                      onClick={() => insertSecurityTemplate(option)}
                    >
                      {option.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Add role indicator badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="ml-auto">
                  {role === 'individual' && 'Individual Access'}
                  {role === 'team_member' && 'Team Member Access'}
                  {role === 'team_manager' && 'Team Manager Access'} 
                  {role === 'administrator' && 'Administrator Access'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current access level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;

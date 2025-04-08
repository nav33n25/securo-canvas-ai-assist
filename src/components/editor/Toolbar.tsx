
import React from 'react';
import { Editor, Transforms, Element as SlateElement, Node } from 'slate';
import { useSlate } from 'slate-react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote,
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckSquare,
  BrainCircuit,
  X
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { CustomElement } from '@/types/slate';

interface ToolbarProps {
  editor: Editor;
  onToggleAI?: () => void;  // Make this prop optional
  showAI?: boolean;         // Make this prop optional
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, onToggleAI, showAI }) => {
  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const isBlockActive = (format: string) => {
    const nodeEntries = Editor.nodes(editor, {
      match: n => 
        !Editor.isEditor(n) && 
        SlateElement.isElement(n) && 
        (n as CustomElement).type === format,
    });
    
    const match = Array.from(nodeEntries)[0];
    return !!match;
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : format } as Partial<CustomElement>,
      { 
        match: (n): n is SlateElement => {
          return !Editor.isEditor(n) && SlateElement.isElement(n);
        }
      }
    );
  };

  return (
    <div className="border rounded-md p-1 flex flex-wrap gap-1 bg-background justify-between">
      <div className="flex flex-wrap gap-1">
        <Toggle 
          pressed={isMarkActive('bold')}
          onPressedChange={() => toggleMark('bold')}
          size="sm"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isMarkActive('italic')}
          onPressedChange={() => toggleMark('italic')}
          size="sm"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isMarkActive('underline')}
          onPressedChange={() => toggleMark('underline')}
          size="sm"
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isMarkActive('code')}
          onPressedChange={() => toggleMark('code')}
          size="sm"
          aria-label="Code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <Toggle 
          pressed={isBlockActive('heading-one')}
          onPressedChange={() => toggleBlock('heading-one')}
          size="sm"
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('heading-two')}
          onPressedChange={() => toggleBlock('heading-two')}
          size="sm"
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('heading-three')}
          onPressedChange={() => toggleBlock('heading-three')}
          size="sm"
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <Toggle 
          pressed={isBlockActive('bulleted-list')}
          onPressedChange={() => toggleBlock('bulleted-list')}
          size="sm"
          aria-label="Bulleted List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('numbered-list')}
          onPressedChange={() => toggleBlock('numbered-list')}
          size="sm"
          aria-label="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('block-quote')}
          onPressedChange={() => toggleBlock('block-quote')}
          size="sm"
          aria-label="Block Quote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        
        <Toggle 
          pressed={isBlockActive('security-note')}
          onPressedChange={() => toggleBlock('security-note')}
          size="sm"
          aria-label="Security Note"
          className="text-secure"
        >
          <Shield className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('vulnerability')}
          onPressedChange={() => toggleBlock('vulnerability')}
          size="sm"
          aria-label="Vulnerability"
          className="text-threat"
        >
          <AlertTriangle className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('warning')}
          onPressedChange={() => toggleBlock('warning')}
          size="sm"
          aria-label="Warning"
          className="text-warning"
        >
          <AlertCircle className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={isBlockActive('compliance')}
          onPressedChange={() => toggleBlock('compliance')}
          size="sm"
          aria-label="Compliance"
          className="text-safe"
        >
          <CheckSquare className="h-4 w-4" />
        </Toggle>
      </div>
      
      {/* Add AI Assistant toggle button if the handler is provided */}
      {onToggleAI && (
        <Button 
          variant={showAI ? "default" : "outline"} 
          size="sm" 
          onClick={onToggleAI}
          className={showAI ? "bg-secure hover:bg-secure-darker" : ""}
        >
          {showAI ? (
            <X className="h-4 w-4 mr-1" />
          ) : (
            <BrainCircuit className="h-4 w-4 mr-1" />
          )}
          AI Assistant
        </Button>
      )}
    </div>
  );
};

export default Toolbar;

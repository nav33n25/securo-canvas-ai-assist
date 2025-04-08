
import React from 'react';
import { Editor, Element as SlateElement, Transforms } from 'slate';
import { 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered,
  Quote,
  Shield,
  AlertTriangle,
  Info,
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ToolbarProps {
  editor: Editor;
  onToggleAI?: () => void;
  showAI?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, onToggleAI, showAI }) => {
  // Helper functions for formatting
  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(editor, format);
    
    Transforms.unwrapNodes(editor, {
      match: n => 
        !Editor.isEditor(n) && 
        SlateElement.isElement(n) && 
        ['bulleted-list', 'numbered-list'].includes((n as any).type),
      split: true,
    });

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : format,
    };

    Transforms.setNodes(editor, newProperties);

    if (!isActive && ['bulleted-list', 'numbered-list'].includes(format)) {
      const block = { type: format === 'bulleted-list' ? 'list-item' : 'list-item', children: [] };
      Transforms.wrapNodes(editor, block as any);
    }
  };

  const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
      match: n => 
        !Editor.isEditor(n) && 
        SlateElement.isElement(n) && 
        (n as any).type === format,
    });
    
    return !!match;
  };

  const insertSecurityBlock = (type: string) => {
    const securityBlock = {
      type,
      children: [{ text: '' }]
    };
    
    Transforms.insertNodes(editor, securityBlock as any);
  };

  return (
    <div className="border rounded-md bg-background/95 p-1 flex flex-wrap items-center justify-between gap-1">
      <div className="flex items-center flex-wrap gap-1">
        {/* Text formatting */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleMark('bold')}
                className={isMarkActive(editor, 'bold') ? 'bg-accent' : ''}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleMark('italic')}
                className={isMarkActive(editor, 'italic') ? 'bg-accent' : ''}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleMark('underline')}
                className={isMarkActive(editor, 'underline') ? 'bg-accent' : ''}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleMark('code')}
                className={isMarkActive(editor, 'code') ? 'bg-accent' : ''}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        {/* Headings */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBlock('heading-one')}
                className={isBlockActive(editor, 'heading-one') ? 'bg-accent' : ''}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBlock('heading-two')}
                className={isBlockActive(editor, 'heading-two') ? 'bg-accent' : ''}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBlock('heading-three')}
                className={isBlockActive(editor, 'heading-three') ? 'bg-accent' : ''}
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBlock('bulleted-list')}
                className={isBlockActive(editor, 'bulleted-list') ? 'bg-accent' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bulleted List</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBlock('numbered-list')}
                className={isBlockActive(editor, 'numbered-list') ? 'bg-accent' : ''}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        {/* Quote */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => toggleBlock('block-quote')}
                className={isBlockActive(editor, 'block-quote') ? 'bg-accent' : ''}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Quote</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        {/* Security blocks */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={`bg-secure/10 text-secure hover:text-secure hover:bg-secure/20 ${
                  isBlockActive(editor, 'security-note') ? 'bg-secure/30' : ''
                }`}
                size="icon"
                onClick={() => insertSecurityBlock('security-note')}
              >
                <Shield className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Security Note</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={`bg-threat/10 text-threat hover:text-threat hover:bg-threat/20 ${
                  isBlockActive(editor, 'vulnerability') ? 'bg-threat/30' : ''
                }`}
                size="icon"
                onClick={() => insertSecurityBlock('vulnerability')}
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Vulnerability</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={`bg-warning/10 text-warning hover:text-warning hover:bg-warning/20 ${
                  isBlockActive(editor, 'warning') ? 'bg-warning/30' : ''
                }`}
                size="icon"
                onClick={() => insertSecurityBlock('warning')}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Warning</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={`bg-safe/10 text-safe hover:text-safe hover:bg-safe/20 ${
                  isBlockActive(editor, 'compliance') ? 'bg-safe/30' : ''
                }`}
                size="icon"
                onClick={() => insertSecurityBlock('compliance')}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Compliance Item</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {onToggleAI && (
        <Button
          onClick={onToggleAI}
          className={`text-xs px-3 py-1 ${
            showAI ? 'bg-secure text-white hover:bg-secure/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          size="sm"
        >
          AI Assistant {showAI ? 'On' : 'Off'}
        </Button>
      )}
    </div>
  );
};

export default Toolbar;

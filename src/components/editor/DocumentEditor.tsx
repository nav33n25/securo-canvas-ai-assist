
import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { renderElement, renderLeaf } from './RenderElements';
import { Card, CardContent } from '@/components/ui/card';
import { withSecurityBlocks } from './withSecurityBlocks';
import { Shield, Save } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';

interface DocumentEditorProps {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ initialValue, onChange }) => {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const editor = useMemo(() => {
    return withSecurityBlocks(withHistory(withReact(createEditor())));
  }, []);

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
    onChange(newValue);
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

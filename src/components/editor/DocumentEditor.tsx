
import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import { renderElement, renderLeaf } from './RenderElements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { withSecurityBlocks } from './withSecurityBlocks';
import { Shield, Save } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Create your security documentation here...' }],
  },
];

const DocumentEditor: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [documentTitle, setDocumentTitle] = useState('Untitled Security Document');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const editor = useMemo(() => {
    return withSecurityBlocks(withHistory(withReact(createEditor())));
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };

  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-secure" />
              <input
                type="text"
                value={documentTitle}
                onChange={handleTitleChange}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={toggleAIAssistant}
                className="text-secure-darker border-secure-darker hover:bg-secure/10"
              >
                AI Assistant
              </Button>
              <Button 
                variant="default"
                className="bg-secure hover:bg-secure-darker"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 h-full">
            <div className={`flex-1 ${showAIAssistant ? 'w-2/3' : 'w-full'}`}>
              <Toolbar editor={editor} />
              <div className="border rounded-md p-4 mt-2 min-h-[500px] slate-content">
                <Slate 
                  editor={editor} 
                  value={value}
                  onChange={newValue => setValue(newValue)}
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

import React, { useState } from 'react';
import { EditorContent } from "novel";
import { Editor } from "novel";
import { EditorInstance } from "novel";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SecureNovelEditor from '@/components/editor/SecureNovelEditor';
import { toast } from '@/components/ui/use-toast';

const SecureEditorExamplePage = () => {
  // State to store editor content
  const [content, setContent] = useState<string | undefined>("<p>Start typing here to test the secure editor...</p>");
  const [savedContent, setSavedContent] = useState<string | undefined>();

  // Handler for saving content
  const handleSave = () => {
    setSavedContent(content);
    toast({
      title: "Content saved",
      description: "Your secure document has been saved successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Secure Editor Example</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>SecureNovelEditor Component</CardTitle>
              <CardDescription>
                This is an example of the SecureNovelEditor component with basic configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecureNovelEditor
                content={content}
                setContent={setContent}
                title="Test Document"
                sensitivity="confidential"
                complianceFrameworks={["GDPR", "HIPAA"]}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setContent("<p>Reset content...</p>")}>
                Reset
              </Button>
              <Button onClick={handleSave}>Save Content</Button>
            </CardFooter>
          </Card>

          {savedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Content</CardTitle>
                <CardDescription>Preview of the saved document</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border rounded-md p-4 bg-gray-50"
                  dangerouslySetInnerHTML={{ __html: savedContent }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SecureEditorExamplePage; 
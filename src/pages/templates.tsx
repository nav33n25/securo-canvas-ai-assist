
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTemplates, createDocumentFromTemplate, DocumentTemplate } from '@/services/documentService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, FileText } from 'lucide-react';

const TemplatesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates
  });

  const handleCreateDocument = async () => {
    if (!selectedTemplate || !documentTitle.trim() || !user) return;
    
    try {
      setIsCreating(true);
      const document = await createDocumentFromTemplate(selectedTemplate, documentTitle, user.id);
      setDialogOpen(false);
      toast({
        title: "Document created",
        description: "Your new document has been created successfully.",
      });
      navigate(`/document/${document.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const openCreateDialog = (templateId: string) => {
    setSelectedTemplate(templateId);
    setDocumentTitle('');
    setDialogOpen(true);
  };
  
  // Group templates by category
  const templatesByCategory: Record<string, DocumentTemplate[]> = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, DocumentTemplate[]>);

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Templates</h1>
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            Error loading templates. Please try again later.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Security Document Templates</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{template.name}</CardTitle>
                            <CardDescription className="mt-1">{template.description}</CardDescription>
                          </div>
                          <Shield className="h-5 w-5 text-secure" />
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="line-clamp-3">
                          This template provides a structured framework for creating standardized security documentation.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => openCreateDialog(template.id)}
                          className="w-full bg-secure hover:bg-secure-darker"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Enter a title for your new document based on this template.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Document Title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateDocument} 
                disabled={isCreating || !documentTitle.trim()}
                className="bg-secure hover:bg-secure-darker"
              >
                {isCreating ? 'Creating...' : 'Create Document'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default TemplatesPage;

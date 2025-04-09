
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, Document } from '@/services/documentService';
import { toast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { FilePlus, MoreHorizontal, Pencil, Trash2, FileText, Copy } from 'lucide-react';
import { format } from 'date-fns';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments
  });

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim() || !user) return;
    
    try {
      setIsCreating(true);
      const document = await createDocument({
        title: newDocTitle,
        content: [{ type: 'paragraph', children: [{ text: '' }] }],
        user_id: user.id,
        status: 'draft'
      });
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
      setNewDocTitle('');
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Documents</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secure hover:bg-secure-darker">
                <FilePlus className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>
                  Enter a title for your new security document.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Document Title"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateDocument} 
                  disabled={isCreating || !newDocTitle.trim()}
                  className="bg-secure hover:bg-secure-darker"
                >
                  {isCreating ? 'Creating...' : 'Create Document'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
          </div>
        ) : documents.length > 0 ? (
          <div className="bg-background rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer" onClick={() => navigate(`/document/${doc.id}`)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-secure" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell>{renderStatus(doc.status)}</TableCell>
                    <TableCell>{format(new Date(doc.updated_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>v{doc.version}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/document/${doc.id}`);
                          }}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md bg-background">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No documents yet</h3>
            <p className="text-muted-foreground mb-4">Create your first security document to get started.</p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-secure hover:bg-secure-darker"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Create Document
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;

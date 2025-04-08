
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Document {
  id: string;
  title: string;
  updatedAt: string;
  author: string;
  tags: string[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Information Security Policy',
    updatedAt: '2023-04-05T14:48:00',
    author: 'John Smith',
    tags: ['Policy', 'ISO 27001'],
  },
  {
    id: '2',
    title: 'Incident Response Plan',
    updatedAt: '2023-04-02T10:23:00',
    author: 'Alice Johnson',
    tags: ['IR', 'Procedure'],
  },
  {
    id: '3',
    title: 'Vendor Risk Assessment Template',
    updatedAt: '2023-03-28T16:15:00',
    author: 'David Williams',
    tags: ['Assessment', 'Vendors'],
  },
  {
    id: '4',
    title: 'Network Security Architecture',
    updatedAt: '2023-03-25T09:30:00',
    author: 'Sarah Miller',
    tags: ['Architecture', 'Technical'],
  },
];

const DocumentsList: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
        <CardDescription>
          Your recently updated security documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockDocuments.map((doc) => (
            <a 
              key={doc.id} 
              href={`/document/${doc.id}`}
              className="block border rounded-lg p-3 hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 mt-0.5 text-secure" />
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <User className="h-3 w-3" />
                      <span>{doc.author}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsList;


import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export interface RecentDocument {
  id: string;
  title: string;
  updated_at: string;
  status?: string;
}

interface RecentDocumentsSectionProps {
  documents: RecentDocument[];
  isLoading: boolean;
}

const RecentDocumentsSection: React.FC<RecentDocumentsSectionProps> = ({ documents, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
          Recent Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : documents.length > 0 ? (
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{doc.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    Last updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/document/${doc.id}`}>
                    <span>Open</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No documents found</p>
            <Button className="mt-4" asChild>
              <Link to="/documents?new=true">
                Create Your First Document
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link to="/documents">
              All Documents
            </Link>
          </Button>
          <Button className="flex-1 bg-secure hover:bg-secure-darker" asChild>
            <Link to="/documents?new=true">
              New Document
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecentDocumentsSection;

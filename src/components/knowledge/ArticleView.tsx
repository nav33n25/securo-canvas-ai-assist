
import React from 'react';
import { KnowledgeBaseArticle } from '@/types/security';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Clock, User, Tag, ExternalLink } from 'lucide-react';

interface ArticleViewProps {
  article: KnowledgeBaseArticle;
  onClose: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Updated {new Date(article.last_updated).toLocaleDateString()}</span>
            </div>
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{article.category}</Badge>
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-line">{article.content}</p>
        </div>

        {article.related_articles && article.related_articles.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-medium mb-3">Related Articles</h3>
              <div className="space-y-2">
                {article.related_articles.map((relatedId) => (
                  <Link 
                    key={relatedId} 
                    to="#"
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent"
                  >
                    <span>Article #{relatedId}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="default" className="bg-secure hover:bg-secure-darker">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Full Article
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleView;

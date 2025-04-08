
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getKnowledgeBaseArticles } from '@/services/securityDataService';
import { KnowledgeBaseArticle } from '@/types/security';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Book, Search, Clock, Tag, User } from 'lucide-react';
import KnowledgeBaseArticleView from '@/components/knowledge/ArticleView';

const KnowledgeBasePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: getKnowledgeBaseArticles
  });

  const categories = [...new Set(articles.map(article => article.category))];

  const filteredArticles = searchQuery 
    ? articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : articles;

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Book className="h-8 w-8 text-secure" />
            Knowledge Base
          </h1>
          <p className="text-muted-foreground">
            Centralized security knowledge repository to help your team access critical security information.
          </p>
        </div>

        <div className="flex gap-6">
          <div className={`${selectedArticle ? 'w-1/3' : 'w-full'} transition-all duration-300`}>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search knowledge base..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Articles</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 gap-4">
                      {filteredArticles.map((article) => (
                        <ArticleCard 
                          key={article.id} 
                          article={article} 
                          onClick={() => setSelectedArticle(article)} 
                          isSelected={selectedArticle?.id === article.id}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        {filteredArticles
                          .filter((article) => article.category === category)
                          .map((article) => (
                            <ArticleCard 
                              key={article.id} 
                              article={article} 
                              onClick={() => setSelectedArticle(article)} 
                              isSelected={selectedArticle?.id === article.id}
                            />
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </>
              )}
            </Tabs>
          </div>

          {selectedArticle && (
            <div className="w-2/3 transition-all duration-300">
              <KnowledgeBaseArticleView 
                article={selectedArticle} 
                onClose={() => setSelectedArticle(null)}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

interface ArticleCardProps {
  article: KnowledgeBaseArticle;
  onClick: () => void;
  isSelected: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, isSelected }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-secure ${isSelected ? 'border-secure' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{article.title}</CardTitle>
        <CardDescription>{article.content.substring(0, 100)}...</CardDescription>
      </CardHeader>
      <CardFooter className="pt-3 flex flex-wrap gap-2 justify-between border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            Updated {new Date(article.last_updated).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-1 mt-2 w-full">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">+{article.tags.length - 3}</Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default KnowledgeBasePage;

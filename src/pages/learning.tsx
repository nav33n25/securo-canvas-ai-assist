
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, PlayCircle, CheckCircle, Lock, Clock, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  url: string;
  premium: boolean;
  completed?: boolean;
}

const mockLearningResources: LearningResource[] = [
  {
    id: '1',
    title: 'Introduction to Cybersecurity Documentation',
    description: 'Learn the fundamentals of creating effective security documentation.',
    type: 'article',
    duration: '15 min',
    difficulty: 'beginner',
    tags: ['documentation', 'basics'],
    url: '#',
    premium: false
  },
  {
    id: '2',
    title: 'Advanced Threat Modeling Documentation',
    description: 'Discover how to document complex threat models for enterprise systems.',
    type: 'video',
    duration: '45 min',
    difficulty: 'advanced',
    tags: ['threat modeling', 'enterprise'],
    url: '#',
    premium: true
  },
  {
    id: '3',
    title: 'Compliance Documentation Masterclass',
    description: 'A complete guide to writing compliant security documentation for regulatory frameworks.',
    type: 'course',
    duration: '3 hours',
    difficulty: 'intermediate',
    tags: ['compliance', 'regulations'],
    url: '#',
    premium: true
  },
  {
    id: '4',
    title: 'Security Policy Templates',
    description: 'Learn how to use and customize security policy templates effectively.',
    type: 'article',
    duration: '25 min',
    difficulty: 'beginner',
    tags: ['templates', 'policies'],
    url: '#',
    premium: false,
    completed: true
  },
  {
    id: '5',
    title: 'Vulnerability Documentation Best Practices',
    description: 'Learn how to document vulnerabilities in a clear and actionable way.',
    type: 'video',
    duration: '35 min',
    difficulty: 'intermediate',
    tags: ['vulnerabilities', 'best practices'],
    url: '#',
    premium: false
  },
  {
    id: '6',
    title: 'Security Incident Response Documentation',
    description: 'How to create and maintain effective incident response documentation.',
    type: 'course',
    duration: '2 hours',
    difficulty: 'intermediate',
    tags: ['incident response', 'documentation'],
    url: '#',
    premium: true
  }
];

const LearningHubPage = () => {
  // In production, this would fetch from the Supabase database
  const { data: resources = mockLearningResources, isLoading } = useQuery({
    queryKey: ['learning-resources'],
    queryFn: async () => {
      // This would be replaced with actual Supabase query in production
      // For now we're using the mock data
      return mockLearningResources;
    }
  });

  const handleStartLearning = (resource: LearningResource) => {
    if (resource.premium) {
      toast({
        title: "Premium Content",
        description: "This resource requires a premium subscription.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Resource Opened",
      description: `Now viewing: ${resource.title}`
    });
    // In production, this would track progress in the database
  };

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      case 'video':
        return <PlayCircle className="h-4 w-4" />;
      case 'course':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Advanced</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Security Learning Hub</h1>
          <p className="text-muted-foreground">
            Enhance your cybersecurity documentation skills with our curated learning resources.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="my-progress">My Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {resources.map((resource) => (
                  <Card key={resource.id} className={resource.completed ? "border-green-300" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderTypeIcon(resource.type)}
                            <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                            {resource.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        {resource.premium && (
                          <Badge className="bg-amber-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{resource.duration}</span>
                        </div>
                        {renderDifficultyBadge(resource.difficulty)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resource.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleStartLearning(resource)} 
                        className="w-full bg-secure hover:bg-secure-darker"
                      >
                        {resource.completed ? "Review Again" : "Start Learning"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {resources
                .filter(r => r.type === 'article')
                .map((resource) => (
                  <Card key={resource.id} className={resource.completed ? "border-green-300" : ""}>
                    {/* Same card structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderTypeIcon(resource.type)}
                            <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                            {resource.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        {resource.premium && (
                          <Badge className="bg-amber-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{resource.duration}</span>
                        </div>
                        {renderDifficultyBadge(resource.difficulty)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resource.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleStartLearning(resource)} 
                        className="w-full bg-secure hover:bg-secure-darker"
                      >
                        {resource.completed ? "Review Again" : "Start Learning"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {resources
                .filter(r => r.type === 'video')
                .map((resource) => (
                  <Card key={resource.id} className={resource.completed ? "border-green-300" : ""}>
                    {/* Same card structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderTypeIcon(resource.type)}
                            <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                            {resource.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        {resource.premium && (
                          <Badge className="bg-amber-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{resource.duration}</span>
                        </div>
                        {renderDifficultyBadge(resource.difficulty)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resource.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleStartLearning(resource)} 
                        className="w-full bg-secure hover:bg-secure-darker"
                      >
                        {resource.completed ? "Review Again" : "Start Learning"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {resources
                .filter(r => r.type === 'course')
                .map((resource) => (
                  <Card key={resource.id} className={resource.completed ? "border-green-300" : ""}>
                    {/* Same card structure as above */}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderTypeIcon(resource.type)}
                            <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                            {resource.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                        </div>
                        {resource.premium && (
                          <Badge className="bg-amber-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{resource.duration}</span>
                        </div>
                        {renderDifficultyBadge(resource.difficulty)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {resource.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleStartLearning(resource)} 
                        className="w-full bg-secure hover:bg-secure-darker"
                      >
                        {resource.completed ? "Review Again" : "Start Learning"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="my-progress">
            <div className="mt-6">
              {resources.filter(r => r.completed).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources
                    .filter(r => r.completed)
                    .map((resource) => (
                      <Card key={resource.id} className="border-green-300">
                        {/* Same card structure as above */}
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                {renderTypeIcon(resource.type)}
                                <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                              <CardTitle className="text-lg">{resource.title}</CardTitle>
                            </div>
                            {resource.premium && (
                              <Badge className="bg-amber-500">
                                <Lock className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2">{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{resource.duration}</span>
                            </div>
                            {renderDifficultyBadge(resource.difficulty)}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {resource.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            onClick={() => handleStartLearning(resource)} 
                            className="w-full bg-secure hover:bg-secure-darker"
                          >
                            Review Again
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md bg-background">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No completed resources yet</h3>
                  <p className="text-muted-foreground mb-4">Start learning to track your progress.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LearningHubPage;


import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { KnowledgeBaseArticle } from '@/types/security';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ArticleView from '@/components/knowledge/ArticleView';
import { 
  Search, 
  BookOpen, 
  Filter, 
  Tag,
  User,
  Clock,
  PlusCircle,
  BookOpenCheck,
  BookOpenText,
  ShieldAlert,
  Lock,
  Database
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Mock articles for the Knowledge Base
const mockArticles: KnowledgeBaseArticle[] = [
  {
    id: "kb-1",
    title: "Understanding OWASP Top 10 Vulnerabilities",
    content: `
The OWASP Top 10 is a regularly updated document that outlines the most critical security risks to web applications. It represents a consensus among security experts about the most significant web application security flaws.

## Current OWASP Top 10 (2021)
1. **Broken Access Control**
   - Moving up from #5 in 2017, 94% of applications were tested for some form of broken access control
   - Notable Common Weakness Enumerations (CWEs) include CWE-200, CWE-201, CWE-352

2. **Cryptographic Failures**
   - Previously known as "Sensitive Data Exposure" 
   - Focuses on failures related to cryptography that often lead to sensitive data exposure
   - Related to protection of data in transit and at rest

3. **Injection**
   - Dropping from #1 in 2017
   - Includes SQL injection, NoSQL injection, OS command injection, and more
   - Preventable through input validation, parameterized queries, and escaping special characters

4. **Insecure Design**
   - A new category for 2021
   - Focuses on risks related to design flaws rather than implementation flaws
   - Requires threat modeling, secure design patterns, and reference architectures

5. **Security Misconfiguration**
   - Moving up from #6 in 2017
   - Includes missing security hardening, improperly configured permissions, unnecessary features enabled
   - Preventable through automated scanning and hardening processes

6. **Vulnerable and Outdated Components**
   - Previously titled "Using Components with Known Vulnerabilities"
   - Refers to using libraries, frameworks, and modules that have known security vulnerabilities
   - Preventable through continuous inventory and monitoring of component versions

7. **Identification and Authentication Failures**
   - Previously "Broken Authentication"
   - Includes weaknesses in session management, credential handling, and identity verification
   - Preventable through multi-factor authentication and secure session management

8. **Software and Data Integrity Failures**
   - A new category focusing on assumptions related to software updates, critical data, and CI/CD pipelines
   - Includes cases where infrastructure is compromised to inject malicious code

9. **Security Logging and Monitoring Failures**
   - Previously "Insufficient Logging & Monitoring"
   - Focuses on the ability to detect and respond to breaches
   - Preventable through effective logging, monitoring, and incident response

10. **Server-Side Request Forgery (SSRF)**
    - A new entry in the Top 10
    - Occurs when a web application fetches a remote resource without validating the user-supplied URL
    - Particularly dangerous in modern architectures with cloud services

## Mitigation Strategies
- Use frameworks that automatically escape for the specific context
- Implement strong authentication mechanisms
- Keep all software components updated
- Apply the principle of least privilege
- Conduct regular security testing

For more details, visit the [official OWASP Top 10 website](https://owasp.org/Top10/).
`,
    category: "Web Security",
    tags: ["OWASP", "Vulnerabilities", "Web Security", "Application Security"],
    author: "Security Expert",
    published_date: "2023-07-15T14:22:00Z",
    last_updated: "2023-11-03T09:45:00Z",
    related_articles: ["kb-3", "kb-5"]
  },
  {
    id: "kb-2",
    title: "Implementing Zero Trust Architecture",
    content: "Detailed guide on implementing Zero Trust principles in your organization...",
    category: "Network Security",
    tags: ["Zero Trust", "Network Security", "Access Control", "Architecture"],
    author: "Network Specialist",
    published_date: "2023-06-22T10:15:00Z",
    last_updated: "2023-10-18T16:30:00Z",
    related_articles: ["kb-4"]
  },
  {
    id: "kb-3",
    title: "Secure Coding Practices for Developers",
    content: "A comprehensive guide to secure coding practices across different programming languages...",
    category: "Application Security",
    tags: ["Secure Coding", "Development", "SSDLC", "Best Practices"],
    author: "Senior Security Developer",
    published_date: "2023-05-07T09:30:00Z",
    last_updated: "2023-09-14T13:20:00Z",
    related_articles: ["kb-1", "kb-6"]
  },
  {
    id: "kb-4",
    title: "Cloud Security Best Practices",
    content: "Essential security controls and configurations for major cloud platforms...",
    category: "Cloud Security",
    tags: ["Cloud", "AWS", "Azure", "GCP", "IaaS", "PaaS"],
    author: "Cloud Architect",
    published_date: "2023-08-01T11:45:00Z",
    last_updated: "2023-11-10T10:15:00Z",
    related_articles: ["kb-2", "kb-7"]
  },
  {
    id: "kb-5",
    title: "Introduction to Security Headers",
    content: "Overview of important HTTP security headers and how to implement them...",
    category: "Web Security",
    tags: ["HTTP Headers", "CSP", "HSTS", "XSS Protection"],
    author: "Web Security Analyst",
    published_date: "2023-03-12T16:20:00Z",
    last_updated: "2023-10-05T14:40:00Z",
    related_articles: ["kb-1"]
  },
  {
    id: "kb-6",
    title: "Secure API Design Guidelines",
    content: "Best practices for designing, implementing, and securing APIs...",
    category: "API Security",
    tags: ["API", "REST", "GraphQL", "OAuth", "JWT"],
    author: "API Security Expert",
    published_date: "2023-09-04T08:55:00Z",
    last_updated: "2023-11-02T11:30:00Z",
    related_articles: ["kb-3"]
  },
  {
    id: "kb-7",
    title: "Container Security Fundamentals",
    content: "Security considerations for containerized environments including Docker and Kubernetes...",
    category: "Container Security",
    tags: ["Containers", "Docker", "Kubernetes", "Orchestration"],
    author: "DevSecOps Engineer",
    published_date: "2023-04-18T13:10:00Z",
    last_updated: "2023-10-22T15:45:00Z",
    related_articles: ["kb-4"]
  }
];

// Categories with their icons for display
const categories = [
  { name: "All Categories", icon: BookOpen },
  { name: "Web Security", icon: ShieldAlert },
  { name: "Network Security", icon: Lock },
  { name: "Application Security", icon: BookOpenCheck },
  { name: "Cloud Security", icon: BookOpenText },
  { name: "API Security", icon: Database },
  { name: "Container Security", icon: Database },
];

const KnowledgeBasePage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTab, setSelectedTab] = useState("browse");
  
  // Filter articles based on search query and selected category
  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                         
    const matchesCategory = selectedCategory === "All Categories" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get all unique tags across articles
  const allTags = Array.from(
    new Set(mockArticles.flatMap(article => article.tags))
  ).sort();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Explore security knowledge articles, guides, and best practices
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>

          <TabsContent value="browse" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Sidebar */}
              <div className="w-full md:w-64 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <category.icon className="mr-2 h-4 w-4" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Popular Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {allTags.slice(0, 10).map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => setSearchQuery(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {selectedArticle ? (
                  <ArticleView article={selectedArticle} onClose={() => setSelectedArticle(null)} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        {selectedCategory === "All Categories" 
                          ? "All Articles" 
                          : `${selectedCategory} Articles`}
                      </h2>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-3 w-3" />
                        Filter
                      </Button>
                    </div>
                    
                    {filteredArticles.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                          <BookOpen className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No articles found</h3>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filter criteria
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {filteredArticles.map((article) => (
                          <Card 
                            key={article.id} 
                            className="cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription className="flex gap-4">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="text-xs">{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-xs">Updated {new Date(article.last_updated).toLocaleDateString()}</span>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm line-clamp-2">
                                {article.content.substring(0, 150)}...
                              </p>
                            </CardContent>
                            <CardFooter>
                              <div className="flex gap-1 flex-wrap">
                                <Badge variant="secondary">{article.category}</Badge>
                                {article.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {article.tags.length > 3 && (
                                  <Badge variant="outline">+{article.tags.length - 3} more</Badge>
                                )}
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Articles</CardTitle>
                <CardDescription>Articles you've marked as favorites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You haven't added any favorite articles yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recently Viewed</CardTitle>
                <CardDescription>Articles you've viewed recently</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your recently viewed articles will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default KnowledgeBasePage;

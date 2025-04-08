
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
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
import {
  Search,
  Filter,
  FileText,
  Clock,
  Star,
  PlusCircle,
  Grid,
  AlignRight,
  FilePlus,
  FileCheck,
  ArrowUpRight,
  UserCircle,
  Download,
  Copy
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Template categories
const categories = [
  "All Templates",
  "Policies",
  "Procedures",
  "Controls",
  "Reports",
  "Assessments",
  "Checklists",
  "Plans"
];

// Mock templates
const mockTemplates = [
  {
    id: "t1",
    name: "Information Security Policy",
    description: "A comprehensive information security policy covering all key security domains",
    category: "Policies",
    tags: ["ISO 27001", "Security Policy", "Governance"],
    author: "Security Team",
    createdAt: "2023-08-15T14:22:00Z",
    updatedAt: "2023-10-03T09:45:00Z",
    stars: 24,
    premium: false
  },
  {
    id: "t2",
    name: "Incident Response Plan",
    description: "Detailed incident response procedures and contact information for security incidents",
    category: "Plans",
    tags: ["Incident Response", "NIST", "Crisis Management"],
    author: "IR Team",
    createdAt: "2023-07-22T10:15:00Z",
    updatedAt: "2023-11-18T16:30:00Z",
    stars: 42,
    premium: false
  },
  {
    id: "t3",
    name: "Vulnerability Assessment Report",
    description: "Template for documenting vulnerability assessment findings and recommendations",
    category: "Reports",
    tags: ["Vulnerability Management", "Reporting", "Assessment"],
    author: "Pentest Team",
    createdAt: "2023-06-07T09:30:00Z",
    updatedAt: "2023-09-14T13:20:00Z",
    stars: 18,
    premium: true
  },
  {
    id: "t4",
    name: "NIST CSF Assessment",
    description: "Framework for evaluating security posture against NIST Cybersecurity Framework",
    category: "Assessments",
    tags: ["NIST CSF", "Compliance", "Assessment"],
    author: "Compliance Team",
    createdAt: "2023-09-01T11:45:00Z",
    updatedAt: "2023-10-10T10:15:00Z",
    stars: 31,
    premium: true
  },
  {
    id: "t5",
    name: "Access Control Policy",
    description: "Policy defining access control requirements and procedures",
    category: "Policies",
    tags: ["Access Control", "Zero Trust", "IAM"],
    author: "Security Team",
    createdAt: "2023-05-12T16:20:00Z",
    updatedAt: "2023-08-05T14:40:00Z",
    stars: 15,
    premium: false
  },
  {
    id: "t6",
    name: "Security Awareness Training Plan",
    description: "Annual security awareness training plan and curriculum",
    category: "Plans",
    tags: ["Awareness", "Training", "Education"],
    author: "Training Team",
    createdAt: "2023-04-04T08:55:00Z",
    updatedAt: "2023-11-02T11:30:00Z",
    stars: 27,
    premium: false
  },
  {
    id: "t7",
    name: "Disaster Recovery Procedure",
    description: "Step-by-step procedures for recovering IT systems following a disaster",
    category: "Procedures",
    tags: ["DR", "BC", "Recovery"],
    author: "Operations Team",
    createdAt: "2023-10-18T13:10:00Z",
    updatedAt: "2023-10-22T15:45:00Z",
    stars: 36,
    premium: true
  },
  {
    id: "t8",
    name: "Security Control Matrix",
    description: "Comprehensive mapping of security controls across multiple frameworks",
    category: "Controls",
    tags: ["Controls", "Mapping", "Frameworks", "SOC2", "ISO27001", "NIST"],
    author: "Compliance Team",
    createdAt: "2023-03-21T09:15:00Z",
    updatedAt: "2023-11-05T10:20:00Z",
    stars: 48,
    premium: true
  }
];

// View type options
type ViewType = "grid" | "list";

const TemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [viewType, setViewType] = useState<ViewType>("grid");
  
  // Filter templates based on search and category
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                         
    const matchesCategory = selectedCategory === "All Templates" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Templates</h1>
            <p className="text-muted-foreground">
              Browse, customize, and create security documentation templates
            </p>
          </div>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
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
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="mb-2 text-sm font-medium">Status</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4 text-amber-500" />
                  Starred Templates
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Recently Used
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <UserCircle className="mr-2 h-4 w-4" />
                  My Templates
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCategory === "All Templates" 
                  ? "All Templates" 
                  : `${selectedCategory} Templates`}
                <Badge className="ml-2" variant="outline">{filteredTemplates.length}</Badge>
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant={viewType === "grid" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewType("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewType === "list" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewType("list")}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {viewType === "grid" ? (
              // Grid view
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                  <Card key={template.id} className="group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-secure transition-colors">
                        {template.name}
                        {template.premium && (
                          <Badge variant="default" className="ml-2 bg-amber-500">Premium</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="secondary">{template.category}</Badge>
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                        {template.tags.length > 2 && (
                          <Badge variant="outline">+{template.tags.length - 2}</Badge>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>By {template.author}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                          {template.stars}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              // List view
              <div className="space-y-2">
                {filteredTemplates.map(template => (
                  <Card key={template.id} className="group">
                    <div className="flex p-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium group-hover:text-secure transition-colors">
                            {template.name}
                          </h3>
                          {template.premium && (
                            <Badge variant="default" className="ml-2 bg-amber-500">Premium</Badge>
                          )}
                          <div className="ml-auto flex items-center">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                            {template.stars}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">{template.category}</Badge>
                          {template.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline">+{template.tags.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm">Use</Button>
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No templates found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TemplatesPage;

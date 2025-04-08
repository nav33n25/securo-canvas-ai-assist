
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, Clock, FileCheck, ChevronRight, ArrowRight, Shield, CheckSquare, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-started';
  requirements: number;
  completedRequirements: number;
  lastUpdated: string;
  nextAssessment?: string;
  icon: React.ReactNode;
}

interface RequirementItem {
  id: string;
  control: string;
  title: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'in-progress' | 'not-started';
  evidence?: string[];
  dueDate?: string;
  assignedTo?: string;
}

const mockFrameworks: ComplianceFramework[] = [
  {
    id: '1',
    name: 'ISO 27001',
    description: 'Information security management system (ISMS) standard',
    progress: 85,
    status: 'in-progress',
    requirements: 114,
    completedRequirements: 97,
    lastUpdated: '2023-11-12T10:30:00Z',
    nextAssessment: '2024-01-15T00:00:00Z',
    icon: <Shield className="h-8 w-8 text-secure" />
  },
  {
    id: '2',
    name: 'SOC 2',
    description: 'Service Organization Control 2 - Trust Services Criteria',
    progress: 92,
    status: 'compliant',
    requirements: 64,
    completedRequirements: 64,
    lastUpdated: '2023-10-28T14:45:00Z',
    nextAssessment: '2024-06-30T00:00:00Z',
    icon: <CheckSquare className="h-8 w-8 text-blue-500" />
  },
  {
    id: '3',
    name: 'GDPR',
    description: 'General Data Protection Regulation',
    progress: 78,
    status: 'in-progress',
    requirements: 89,
    completedRequirements: 69,
    lastUpdated: '2023-11-05T09:15:00Z',
    nextAssessment: '2024-02-28T00:00:00Z',
    icon: <Shield className="h-8 w-8 text-yellow-500" />
  },
  {
    id: '4',
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act',
    progress: 63,
    status: 'in-progress',
    requirements: 72,
    completedRequirements: 45,
    lastUpdated: '2023-11-15T11:20:00Z',
    nextAssessment: '2024-03-15T00:00:00Z',
    icon: <AlertCircle className="h-8 w-8 text-red-500" />
  },
  {
    id: '5',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    progress: 90,
    status: 'compliant',
    requirements: 78,
    completedRequirements: 70,
    lastUpdated: '2023-10-18T16:10:00Z',
    nextAssessment: '2024-04-30T00:00:00Z',
    icon: <FileCheck className="h-8 w-8 text-green-500" />
  }
];

const iso27001Requirements: RequirementItem[] = [
  {
    id: 'A.5.1',
    control: 'A.5.1',
    title: 'Information Security Policies',
    description: 'Management direction for information security',
    status: 'compliant',
    evidence: ['Information Security Policy v2.3', 'Annual Review Documentation'],
    dueDate: '2023-12-01T00:00:00Z',
    assignedTo: 'John Smith'
  },
  {
    id: 'A.6.1',
    control: 'A.6.1',
    title: 'Internal Organization',
    description: 'Information security roles and responsibilities',
    status: 'compliant',
    evidence: ['Organization Chart', 'Security Responsibility Matrix'],
    dueDate: '2023-11-15T00:00:00Z',
    assignedTo: 'Maria Garcia'
  },
  {
    id: 'A.7.1',
    control: 'A.7.1',
    title: 'Mobile Devices and Teleworking',
    description: 'Security of mobile devices and teleworking',
    status: 'in-progress',
    dueDate: '2023-12-10T00:00:00Z',
    assignedTo: 'David Wilson'
  },
  {
    id: 'A.8.1',
    control: 'A.8.1',
    title: 'Asset Management',
    description: 'Responsibility for assets',
    status: 'non-compliant',
    dueDate: '2023-11-30T00:00:00Z',
    assignedTo: 'Lisa Chen'
  },
  {
    id: 'A.9.1',
    control: 'A.9.1',
    title: 'Access Control',
    description: 'Business requirements of access control',
    status: 'compliant',
    evidence: ['Access Control Policy', 'Quarterly Access Review Results'],
    dueDate: '2023-11-20T00:00:00Z',
    assignedTo: 'Robert Johnson'
  }
];

const CompliancePage = () => {
  const [selectedFramework, setSelectedFramework] = useState<string>('1');
  
  // In production, this would fetch from the Supabase database
  const { data: frameworks = mockFrameworks, isLoading } = useQuery({
    queryKey: ['compliance-frameworks'],
    queryFn: async () => {
      // This would be replaced with actual Supabase query in production
      return mockFrameworks;
    }
  });
  
  // In production, this would fetch from the Supabase database based on selectedFramework
  const { data: requirements = iso27001Requirements } = useQuery({
    queryKey: ['compliance-requirements', selectedFramework],
    queryFn: async () => {
      // This would be replaced with actual Supabase query in production
      return iso27001Requirements;
    }
  });

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Compliant</Badge>;
      case 'non-compliant':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Non-Compliant</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Not Started</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'non-compliant':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Compliance Management</h1>
          <p className="text-muted-foreground">
            Track and manage your organization's compliance with security frameworks and regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>
                Current status of compliance frameworks and regulations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secure"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {frameworks.map((framework) => (
                    <div 
                      key={framework.id} 
                      className={`border rounded-lg p-4 cursor-pointer hover:border-secure hover:bg-accent/50 ${selectedFramework === framework.id ? 'border-secure bg-accent/50' : ''}`}
                      onClick={() => setSelectedFramework(framework.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {framework.icon}
                          <div>
                            <h3 className="text-lg font-medium">{framework.name}</h3>
                            <p className="text-sm text-muted-foreground">{framework.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStatusBadge(framework.status)}
                          <ChevronRight className="ml-2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{framework.progress}%</span>
                        </div>
                        <Progress value={framework.progress} className="h-2" />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <div>Last updated: {new Date(framework.lastUpdated).toLocaleDateString()}</div>
                        <div>{framework.completedRequirements} of {framework.requirements} requirements met</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>
                Overall compliance metrics for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-accent rounded-full">
                  <div className="text-3xl font-bold">82%</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Overall Compliance Score</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Status Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Compliant</span>
                    </div>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Non-Compliant</span>
                    </div>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm">Not Started</span>
                    </div>
                    <span className="text-sm font-medium">6%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Upcoming Assessments</h4>
                <div className="space-y-2">
                  {frameworks
                    .filter(f => f.nextAssessment)
                    .sort((a, b) => new Date(a.nextAssessment!).getTime() - new Date(b.nextAssessment!).getTime())
                    .slice(0, 3)
                    .map((framework) => (
                      <div key={framework.id} className="border rounded p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{framework.name}</span>
                          <Badge variant="outline">{new Date(framework.nextAssessment!).toLocaleDateString()}</Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={framework.progress} className="h-1 flex-1" />
                          <span className="text-xs">{framework.progress}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedFrameworkData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedFrameworkData.icon}
                    <span>{selectedFrameworkData.name} Details</span>
                  </CardTitle>
                  <CardDescription>{selectedFrameworkData.description}</CardDescription>
                </div>
                {renderStatusBadge(selectedFrameworkData.status)}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="controls" className="w-full">
                <TabsList>
                  <TabsTrigger value="controls">Controls & Requirements</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="history">Assessment History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="controls">
                  <div className="mt-4 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Control Requirements</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Completed:</span>
                        <span className="font-medium">{selectedFrameworkData.completedRequirements}/{selectedFrameworkData.requirements}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-background rounded border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Control</TableHead>
                              <TableHead className="w-[300px]">Title</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Assigned To</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requirements.map((req) => (
                              <TableRow key={req.id}>
                                <TableCell>{req.control}</TableCell>
                                <TableCell>
                                  <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={req.id} className="border-none">
                                      <AccordionTrigger className="py-0 hover:no-underline">
                                        <span className="font-medium">{req.title}</span>
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <div className="pt-2 pb-1">
                                          <p className="text-sm text-muted-foreground">{req.description}</p>
                                          {req.evidence && req.evidence.length > 0 && (
                                            <div className="mt-2">
                                              <span className="text-xs font-medium">Evidence:</span>
                                              <ul className="list-disc list-inside text-xs text-muted-foreground mt-1">
                                                {req.evidence.map((item, i) => (
                                                  <li key={i}>{item}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {renderStatusIcon(req.status)}
                                    <span>{renderStatusBadge(req.status)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {req.dueDate ? new Date(req.dueDate).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>{req.assignedTo || 'Unassigned'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documentation">
                  <div className="mt-4 space-y-4">
                    <Card>
                      <CardHeader className="py-4">
                        <CardTitle className="text-lg">Required Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <FileCheck className="h-5 w-5 text-green-500" />
                              <div>
                                <h4 className="font-medium">Information Security Policy</h4>
                                <p className="text-xs text-muted-foreground">Last Updated: Nov 15, 2023</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                          <div className="border rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <FileCheck className="h-5 w-5 text-green-500" />
                              <div>
                                <h4 className="font-medium">Risk Assessment Report</h4>
                                <p className="text-xs text-muted-foreground">Last Updated: Oct 28, 2023</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                          <div className="border rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                              <div>
                                <h4 className="font-medium">Business Continuity Plan</h4>
                                <p className="text-xs text-muted-foreground">Last Updated: Sep 10, 2023 (Update Required)</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                          <div className="border rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <FileCheck className="h-5 w-5 text-green-500" />
                              <div>
                                <h4 className="font-medium">Access Control Procedure</h4>
                                <p className="text-xs text-muted-foreground">Last Updated: Nov 5, 2023</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                          <div className="border rounded p-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                              <div>
                                <h4 className="font-medium">Incident Response Plan</h4>
                                <p className="text-xs text-muted-foreground">Not Yet Created</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Create</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="mt-4 space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assessment Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Assessor</TableHead>
                          <TableHead className="text-right">Report</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Nov 12, 2023</TableCell>
                          <TableCell>Internal Audit</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>
                          </TableCell>
                          <TableCell>85%</TableCell>
                          <TableCell>Maria Garcia</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Report</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Aug 15, 2023</TableCell>
                          <TableCell>External Audit</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800 border-green-300">Passed</Badge>
                          </TableCell>
                          <TableCell>82%</TableCell>
                          <TableCell>ABC Certifications Inc.</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Report</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>May 3, 2023</TableCell>
                          <TableCell>Gap Analysis</TableCell>
                          <TableCell>
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300">Remediation Required</Badge>
                          </TableCell>
                          <TableCell>68%</TableCell>
                          <TableCell>Internal Team</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Report</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jan 20, 2023</TableCell>
                          <TableCell>Internal Audit</TableCell>
                          <TableCell>
                            <Badge className="bg-red-100 text-red-800 border-red-300">Failed</Badge>
                          </TableCell>
                          <TableCell>59%</TableCell>
                          <TableCell>Security Team</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Report</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Report</Button>
              <Button className="bg-secure hover:bg-secure-darker">
                Update Compliance Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default CompliancePage;

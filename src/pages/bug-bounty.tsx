
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BugIcon, Laptop, Server, Globe, Shield, AlertTriangle, DollarSign, Award, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'triaging' | 'accepted' | 'rejected' | 'fixed';
  category: 'web' | 'api' | 'mobile' | 'network' | 'other';
  submittedAt: string;
  bounty?: number;
}

const mockBugReports: BugReport[] = [
  {
    id: '1',
    title: 'XSS Vulnerability in Profile Page',
    description: 'I found that the profile page is vulnerable to XSS attacks through the bio field.',
    severity: 'high',
    status: 'accepted',
    category: 'web',
    submittedAt: '2023-11-15T12:30:00Z',
    bounty: 750
  },
  {
    id: '2',
    title: 'IDOR Vulnerability in API Endpoint',
    description: 'The /api/documents/:id endpoint allows access to documents owned by other users.',
    severity: 'critical',
    status: 'fixed',
    category: 'api',
    submittedAt: '2023-11-10T09:15:00Z',
    bounty: 1500
  },
  {
    id: '3',
    title: 'SQL Injection in Search Function',
    description: 'The search function is vulnerable to SQL injection attacks.',
    severity: 'critical',
    status: 'triaging',
    category: 'web',
    submittedAt: '2023-11-18T14:45:00Z'
  },
  {
    id: '4',
    title: 'Insecure Direct Object References in User API',
    description: 'User API endpoints allow unauthorized access to user data.',
    severity: 'high',
    status: 'new',
    category: 'api',
    submittedAt: '2023-11-20T10:30:00Z'
  },
  {
    id: '5',
    title: 'Authentication Bypass in Mobile App',
    description: 'Found a way to bypass authentication in the mobile app.',
    severity: 'high',
    status: 'rejected',
    category: 'mobile',
    submittedAt: '2023-11-05T16:20:00Z'
  }
];

interface LeaderboardEntry {
  rank: number;
  username: string;
  reports: number;
  points: number;
  earnings: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'security_wizard', reports: 12, points: 1850, earnings: 5500 },
  { rank: 2, username: 'h4ck3rm4n', reports: 8, points: 1430, earnings: 3750 },
  { rank: 3, username: 'cyber_hunter', reports: 6, points: 1100, earnings: 2800 },
  { rank: 4, username: 'exploit_master', reports: 5, points: 950, earnings: 2200 },
  { rank: 5, username: 'bug_finder', reports: 4, points: 780, earnings: 1500 },
];

const BugBountyPage = () => {
  const { user } = useAuth();
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [bugSeverity, setBugSeverity] = useState<string>('medium');
  const [bugCategory, setBugCategory] = useState<string>('web');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBugReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bugTitle.trim() || !bugDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In production, this would submit to Supabase
      // const { data, error } = await supabase
      //   .from('bug_reports')
      //   .insert([
      //     { 
      //       title: bugTitle,
      //       description: bugDescription,
      //       severity: bugSeverity,
      //       category: bugCategory,
      //       user_id: user?.id,
      //       status: 'new'
      //     }
      //   ])
      //   .select();
      
      // if (error) throw error;
      
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Bug Report Submitted",
        description: "Your report has been submitted for review. Thank you!",
      });
      
      // Reset form
      setBugTitle('');
      setBugDescription('');
      setBugSeverity('medium');
      setBugCategory('web');
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting your report.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'triaging':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Triaging</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'fixed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Fixed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Globe className="h-4 w-4" />;
      case 'api':
        return <Server className="h-4 w-4" />;
      case 'mobile':
        return <Laptop className="h-4 w-4" />;
      case 'network':
        return <Globe className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Bug Bounty Program</h1>
          <p className="text-muted-foreground">
            Help us improve security by finding and reporting vulnerabilities in our systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secure" />
                Program Overview
              </CardTitle>
              <CardDescription>
                Our bug bounty program rewards security researchers for responsibly disclosing vulnerabilities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Rewards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>
                      <span>Severity</span>
                    </div>
                    <span className="font-semibold">$100-$300</span>
                  </div>
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>
                      <span>Severity</span>
                    </div>
                    <span className="font-semibold">$300-$600</span>
                  </div>
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High</Badge>
                      <span>Severity</span>
                    </div>
                    <span className="font-semibold">$600-$1,200</span>
                  </div>
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>
                      <span>Severity</span>
                    </div>
                    <span className="font-semibold">$1,200-$5,000</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Scope</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-secure" />
                    <span>Web application (*.securecanvas.com)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-secure" />
                    <span>API endpoints (api.securecanvas.com)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-secure" />
                    <span>Mobile applications (iOS and Android)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Out of Scope</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Third-party services</li>
                  <li>Social engineering attacks</li>
                  <li>Physical security issues</li>
                  <li>Rate limiting issues</li>
                  <li>DoS/DDoS attacks</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BugIcon className="h-5 w-5 text-secure" />
                Program Stats
              </CardTitle>
              <CardDescription>
                Current statistics for our bug bounty program.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="text-2xl font-semibold">$42,500</div>
                <div className="text-sm text-muted-foreground">Total Bounties Paid</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-xl font-semibold">157</div>
                  <div className="text-sm text-muted-foreground">Reports Received</div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-xl font-semibold">68</div>
                  <div className="text-sm text-muted-foreground">Vulnerabilities Fixed</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <div className="text-lg font-semibold">24h</div>
                  <div className="text-xs text-muted-foreground text-center">Average Triage Time</div>
                </div>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <div className="text-lg font-semibold">7d</div>
                  <div className="text-xs text-muted-foreground text-center">Average Fix Time</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Hall of Fame
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="submit" className="w-full">
          <TabsList>
            <TabsTrigger value="submit">Submit Report</TabsTrigger>
            <TabsTrigger value="my-reports">My Reports</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-secure" />
                  Submit Bug Report
                </CardTitle>
                <CardDescription>
                  Please provide detailed information about the vulnerability you've discovered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmitBugReport}>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Brief description of the vulnerability" 
                        value={bugTitle}
                        onChange={(e) => setBugTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severity</Label>
                        <Select value={bugSeverity} onValueChange={setBugSeverity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={bugCategory} onValueChange={setBugCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web">Web Application</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="mobile">Mobile App</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Detailed description of the vulnerability, including steps to reproduce, impact, and potential mitigations." 
                        rows={8}
                        value={bugDescription}
                        onChange={(e) => setBugDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secure hover:bg-secure-darker"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-reports">
            <Card>
              <CardHeader>
                <CardTitle>My Submissions</CardTitle>
                <CardDescription>
                  Track the status of your submitted bug reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockBugReports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Bounty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBugReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {renderCategoryIcon(report.category)}
                              <span className="capitalize">{report.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>{renderSeverityBadge(report.severity)}</TableCell>
                          <TableCell>{renderStatusBadge(report.status)}</TableCell>
                          <TableCell>{new Date(report.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {report.bounty ? (
                              <span className="font-semibold text-green-700">${report.bounty}</span>
                            ) : (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <BugIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No submitted reports yet</h3>
                    <p className="text-muted-foreground mb-4">Start submitting to see your reports here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-secure" />
                  Leaderboard
                </CardTitle>
                <CardDescription>
                  Top security researchers in our program.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Researcher</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLeaderboard.map((entry) => (
                      <TableRow key={entry.username}>
                        <TableCell>
                          {entry.rank === 1 ? (
                            <span className="flex items-center">
                              <Award className="h-4 w-4 text-yellow-500 mr-1" />
                              {entry.rank}
                            </span>
                          ) : entry.rank === 2 ? (
                            <span className="flex items-center">
                              <Award className="h-4 w-4 text-gray-400 mr-1" />
                              {entry.rank}
                            </span>
                          ) : entry.rank === 3 ? (
                            <span className="flex items-center">
                              <Award className="h-4 w-4 text-amber-700 mr-1" />
                              {entry.rank}
                            </span>
                          ) : (
                            entry.rank
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{entry.username}</TableCell>
                        <TableCell>{entry.reports}</TableCell>
                        <TableCell>{entry.points}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-700">${entry.earnings}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">Updated monthly</p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default BugBountyPage;

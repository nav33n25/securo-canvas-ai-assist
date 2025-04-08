
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Cog,
  Users,
  Bell,
  Key,
  Shield,
  Server,
  Database,
  UserPlus,
  Save,
  Lock,
  Bot,
  Mail,
  FileCheck,
  FileWarning
} from 'lucide-react';

const WorkspaceSettingsPage = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cog className="h-8 w-8 text-secure" />
            Workspace Settings
          </h1>
          <p className="text-muted-foreground">
            Configure and manage your SecureCanvas workspace environment.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex overflow-auto pb-2">
            <TabsList className="h-auto flex-wrap">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Team Members</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span>Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Workspace Information</CardTitle>
                    <CardDescription>
                      Basic details about your security workspace.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workspaceName">Workspace Name</Label>
                      <Input id="workspaceName" defaultValue="Security Operations" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workspaceDescription">Description</Label>
                      <Input id="workspaceDescription" defaultValue="Enterprise security operations workspace for XYZ Corporation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industryType">Industry</Label>
                      <Select defaultValue="technology">
                        <SelectTrigger id="industryType">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-secure hover:bg-secure-darker">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Workspace Plan</CardTitle>
                    <CardDescription>Current subscription details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Current Plan:</span>
                      <Badge className="bg-secure">Enterprise</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Member Seats:</span>
                      <span>25/50 Used</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Storage:</span>
                      <span>256GB / 1TB Used</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Renewal Date:</span>
                      <span>Jan 15, 2026</span>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage user access to your workspace.
                  </CardDescription>
                </div>
                <Button className="bg-secure hover:bg-secure-darker">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="grid grid-cols-5 p-4 border-b">
                    <div>John Smith</div>
                    <div>jsmith@example.com</div>
                    <div>Admin</div>
                    <div><Badge className="bg-green-500">Active</Badge></div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 p-4 border-b">
                    <div>Sarah Johnson</div>
                    <div>sjohnson@example.com</div>
                    <div>Security Analyst</div>
                    <div><Badge className="bg-green-500">Active</Badge></div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div>Mike Davis</div>
                    <div>mdavis@example.com</div>
                    <div>Compliance Manager</div>
                    <div><Badge variant="outline">Invited</Badge></div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>
                    Configure how users access your workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all workspace members
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Single Sign-On (SSO)</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable SSO for enterprise identity providers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Time before inactive users are logged out
                      </p>
                    </div>
                    <Select defaultValue="60">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-secure hover:bg-secure-darker">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Controls</CardTitle>
                  <CardDescription>
                    Additional security settings for your workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP Restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Device Management</Label>
                      <p className="text-sm text-muted-foreground">
                        Control which devices can access your workspace
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Document Watermarking</Label>
                      <p className="text-sm text-muted-foreground">
                        Add watermarks to exported documents
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Retention Policy</Label>
                      <p className="text-sm text-muted-foreground">
                        Configure how long data is stored
                      </p>
                    </div>
                    <Select defaultValue="365">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-secure hover:bg-secure-darker">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for integrating with external systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 font-medium border-b">
                      <div>Name</div>
                      <div>Created</div>
                      <div>Last Used</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="grid grid-cols-4 p-4 border-b">
                      <div>
                        <div>Production API Key</div>
                        <div className="text-xs text-muted-foreground">••••••••••••••••</div>
                      </div>
                      <div>Jan 10, 2025</div>
                      <div>Today</div>
                      <div className="text-right space-x-2">
                        <Button variant="outline" size="sm">Copy</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div>
                        <div>Test Environment Key</div>
                        <div className="text-xs text-muted-foreground">••••••••••••••••</div>
                      </div>
                      <div>Dec 5, 2024</div>
                      <div>2 days ago</div>
                      <div className="text-right space-x-2">
                        <Button variant="outline" size="sm">Copy</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-secure hover:bg-secure-darker">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Integrations</CardTitle>
                  <CardDescription>
                    Services currently connected to your workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-6 w-6" />
                        <div>
                          <div className="font-medium">PostgreSQL Database</div>
                          <div className="text-xs text-muted-foreground">Connected since Jan 5, 2025</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        <div>
                          <div className="font-medium">SMTP Email Service</div>
                          <div className="text-xs text-muted-foreground">Connected since Jan 10, 2025</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        <div>
                          <div className="font-medium">AI Assistant</div>
                          <div className="text-xs text-muted-foreground">Connected since Jan 15, 2025</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Integrations</CardTitle>
                  <CardDescription>
                    Additional services you can connect to.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-6 w-6" />
                        <div>
                          <div className="font-medium">Document Management</div>
                          <div className="text-xs text-muted-foreground">Store and manage documents securely</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileWarning className="h-6 w-6" />
                        <div>
                          <div className="font-medium">Vulnerability Scanner</div>
                          <div className="text-xs text-muted-foreground">Automated security scanning</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-6 w-6" />
                        <div>
                          <div className="font-medium">Compliance Manager</div>
                          <div className="text-xs text-muted-foreground">Automate compliance workflows</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive alerts and notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Events</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Critical Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Highest priority security events
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="email-critical" defaultChecked />
                          <Label htmlFor="email-critical">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="sms-critical" defaultChecked />
                          <Label htmlFor="sms-critical">SMS</Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>High Risk Vulnerabilities</Label>
                        <p className="text-sm text-muted-foreground">
                          Newly discovered high-risk issues
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="email-high" defaultChecked />
                          <Label htmlFor="email-high">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="sms-high" />
                          <Label htmlFor="sms-high">SMS</Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Platform updates and maintenance
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="email-updates" defaultChecked />
                          <Label htmlFor="email-updates">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="sms-updates" />
                          <Label htmlFor="sms-updates">SMS</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-8">Team Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Document Changes</Label>
                        <p className="text-sm text-muted-foreground">
                          Updates to critical documents
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="email-docs" defaultChecked />
                          <Label htmlFor="email-docs">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="sms-docs" />
                          <Label htmlFor="sms-docs">SMS</Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compliance Status</Label>
                        <p className="text-sm text-muted-foreground">
                          Changes to compliance status
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="email-compliance" defaultChecked />
                          <Label htmlFor="email-compliance">Email</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="sms-compliance" />
                          <Label htmlFor="sms-compliance">SMS</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-secure hover:bg-secure-darker">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WorkspaceSettingsPage;


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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bot,
  Settings,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  Lock,
  FileText,
  KeyRound,
  BookOpen,
  ShieldAlert,
  Sparkles,
  BrainCircuit
} from 'lucide-react';

const AIConfigPage = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-secure" />
            AI Assistant Configuration
          </h1>
          <p className="text-muted-foreground">
            Customize and configure the AI security assistant for your workspace.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex overflow-auto pb-2">
            <TabsList className="h-auto">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Knowledge Base</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="capabilities" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Capabilities</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assistant Settings</CardTitle>
                    <CardDescription>
                      Configure basic behavior of your security AI assistant.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiName">Assistant Name</Label>
                      <Input id="aiName" defaultValue="SecureAI" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aiDescription">Assistant Description</Label>
                      <Textarea 
                        id="aiDescription" 
                        defaultValue="AI security assistant trained to help with security documentation, vulnerability assessment, and compliance monitoring."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aiModel">AI Model</Label>
                      <Select defaultValue="llama-3.1-sonar-large-128k-online">
                        <SelectTrigger id="aiModel">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small (8B)</SelectItem>
                          <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Sonar Large (70B)</SelectItem>
                          <SelectItem value="llama-3.1-sonar-huge-128k-online">Llama 3.1 Sonar Huge (405B)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Document Editor Integration</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable AI assistance in document editor
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Chat Interface</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable global AI chat interface for users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Security Scanning</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow AI to automatically scan for security issues
                        </p>
                      </div>
                      <Switch defaultChecked />
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
                    <CardTitle>Usage Limits</CardTitle>
                    <CardDescription>AI assistant usage statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Current Plan:</span>
                      <Badge className="bg-secure">Enterprise</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Monthly Queries:</span>
                      <span>3,542 / 10,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tokens Used:</span>
                      <span>1.2M / 5M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Resets On:</span>
                      <span>Jan 15, 2026</span>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full">
                      View Usage Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Management</CardTitle>
                <CardDescription>
                  Configure custom knowledge sources and documents for your AI assistant.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Documents & Knowledge</h3>
                    <Button className="bg-secure hover:bg-secure-darker">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Knowledge Source
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 p-4 font-medium border-b">
                      <div>Source Name</div>
                      <div>Type</div>
                      <div>Last Updated</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="grid grid-cols-4 p-4 border-b">
                      <div>
                        <div className="font-medium">Security Policies</div>
                        <div className="text-xs text-muted-foreground">Corporate security policies and procedures</div>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Documents</span>
                      </div>
                      <div>Jan 10, 2025</div>
                      <div className="text-right space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4 border-b">
                      <div>
                        <div className="font-medium">CVE Database</div>
                        <div className="text-xs text-muted-foreground">Common vulnerabilities and exposures database</div>
                      </div>
                      <div className="flex items-center">
                        <Bot className="h-4 w-4 mr-2" />
                        <span>API Source</span>
                      </div>
                      <div>Auto-Updated</div>
                      <div className="text-right space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div>
                        <div className="font-medium">Compliance Frameworks</div>
                        <div className="text-xs text-muted-foreground">ISO 27001, NIST, PCI DSS guidelines</div>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Documents</span>
                      </div>
                      <div>Dec 15, 2024</div>
                      <div className="text-right space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Custom Instructions</h3>
                  <div className="space-y-2">
                    <Label htmlFor="customInstructions">AI Behavior Instructions</Label>
                    <Textarea 
                      id="customInstructions" 
                      className="min-h-[150px]" 
                      defaultValue="When answering security questions, always cite relevant compliance frameworks and best practices. Prioritize answers based on the latest industry standards, and flag if any recommendations might be outdated. Always suggest multiple approaches when addressing security vulnerabilities."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-secure hover:bg-secure-darker">
                  <Save className="h-4 w-4 mr-2" />
                  Save Knowledge Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Security Settings</CardTitle>
                <CardDescription>
                  Configure security guardrails and access controls for the AI assistant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Access Controls</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Role-Based Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Restrict AI functionality based on user roles
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>User Access Levels</Label>
                      <div className="border rounded-md">
                        <div className="grid grid-cols-4 p-4 font-medium border-b">
                          <div>Role</div>
                          <div>Features</div>
                          <div>Knowledge Access</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="grid grid-cols-4 p-4 border-b">
                          <div className="font-medium">Admin</div>
                          <div>Full Access</div>
                          <div>All Documents</div>
                          <div className="text-right">
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 p-4 border-b">
                          <div className="font-medium">Security Analyst</div>
                          <div>Full Access</div>
                          <div>Limited PII Access</div>
                          <div className="text-right">
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 p-4">
                          <div className="font-medium">General User</div>
                          <div>Basic Features</div>
                          <div>Public Documents Only</div>
                          <div className="text-right">
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Guardrails</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Loss Prevention</Label>
                        <p className="text-sm text-muted-foreground">
                          Prevent AI from sharing sensitive information
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Personal Information Detection</Label>
                        <p className="text-sm text-muted-foreground">
                          Block PII from AI inputs and outputs
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Content Moderation</Label>
                        <p className="text-sm text-muted-foreground">
                          Filter inappropriate or harmful content
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Compliance & Logging</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Activity Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Log all AI interactions for audit purposes
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Log Retention Period</Label>
                        <p className="text-sm text-muted-foreground">
                          How long to keep AI interaction logs
                        </p>
                      </div>
                      <Select defaultValue="90">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-secure hover:bg-secure-darker">
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="capabilities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Features & Capabilities</CardTitle>
                  <CardDescription>
                    Enable or disable specific AI assistant features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Document Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Analyze security documents and provide insights
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Vulnerability Assessment</Label>
                      <p className="text-sm text-muted-foreground">
                        Identify and assess security vulnerabilities
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Compliance Mapping</Label>
                      <p className="text-sm text-muted-foreground">
                        Map security controls to compliance frameworks
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Risk Assessment</Label>
                      <p className="text-sm text-muted-foreground">
                        Evaluate security risks and provide mitigation advice
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Code Security Review</Label>
                      <p className="text-sm text-muted-foreground">
                        Review code for security vulnerabilities
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-secure hover:bg-secure-darker">
                    <Save className="h-4 w-4 mr-2" />
                    Save Feature Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Capabilities</CardTitle>
                  <CardDescription>
                    Configure how the AI interfaces with other systems.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">External API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to query external security data sources
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">CVE Database Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Access live vulnerability database information
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Asset Scanning</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to access asset management system
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Ticket System Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Create and update security tickets automatically
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">SIEM Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Access security event and incident management data
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-secure hover:bg-secure-darker">
                    <Save className="h-4 w-4 mr-2" />
                    Save Integration Settings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced AI Configuration</CardTitle>
                <CardDescription>
                  Fine-tune advanced AI parameters and behavior.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-md bg-yellow-50 dark:bg-yellow-950">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Advanced Settings Warning</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        These settings are for advanced users. Incorrect configuration may affect AI performance and security.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Model Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature</Label>
                      <p className="text-xs text-muted-foreground">Controls randomness in responses (0-1)</p>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="temperature" 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          defaultValue="0.3"
                          className="w-full" 
                        />
                        <span className="font-mono w-8 text-right">0.3</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topP">Top P</Label>
                      <p className="text-xs text-muted-foreground">Nucleus sampling parameter (0-1)</p>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="topP" 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05" 
                          defaultValue="0.9"
                          className="w-full" 
                        />
                        <span className="font-mono w-8 text-right">0.9</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Response Length</Label>
                      <p className="text-xs text-muted-foreground">Maximum tokens in AI responses</p>
                      <Select defaultValue="1000">
                        <SelectTrigger id="maxTokens">
                          <SelectValue placeholder="Select token limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512">512 tokens</SelectItem>
                          <SelectItem value="1000">1000 tokens</SelectItem>
                          <SelectItem value="2048">2048 tokens</SelectItem>
                          <SelectItem value="4096">4096 tokens</SelectItem>
                          <SelectItem value="8192">8192 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
                      <p className="text-xs text-muted-foreground">Prevents repetition in responses (-2 to 2)</p>
                      <div className="flex items-center gap-4">
                        <Input 
                          id="frequencyPenalty" 
                          type="range" 
                          min="-2" 
                          max="2" 
                          step="0.1" 
                          defaultValue="0.5"
                          className="w-full" 
                        />
                        <span className="font-mono w-8 text-right">0.5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Configuration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="apiKey" 
                        type="password" 
                        defaultValue="••••••••••••••••••••••••••••••"
                        className="flex-1" 
                      />
                      <Button variant="outline" className="flex-none">
                        <KeyRound className="h-4 w-4 mr-2" />
                        Reveal
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">Custom API Endpoint</Label>
                    <Input 
                      id="apiEndpoint" 
                      defaultValue="https://api.perplexity.ai/chat/completions" 
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Security</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Response Auditing</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable human review of AI responses
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Prompt Injection Protection</Label>
                      <p className="text-sm text-muted-foreground">
                        Advanced detection of prompt manipulation attempts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-medium">End-to-End Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt all AI interactions end-to-end
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  Reset to Defaults
                </Button>
                <Button className="bg-secure hover:bg-secure-darker">
                  <Save className="h-4 w-4 mr-2" />
                  Save Advanced Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AIConfigPage;

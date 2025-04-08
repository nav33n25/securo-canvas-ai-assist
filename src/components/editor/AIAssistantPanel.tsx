
import React, { useState } from 'react';
import { Editor, Transforms } from 'slate';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BrainCircuit, 
  ClipboardCheck, 
  FileText, 
  Loader2, 
  Send, 
  ShieldAlert
} from 'lucide-react';
import { SECURITY_PROMPTS } from '@/services/perplexityAI';

interface AIAssistantPanelProps {
  editor: Editor;
}

interface Template {
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
}

const securityTemplates: Template[] = [
  {
    title: "Vulnerability Assessment",
    description: "Analyze a system or component for security vulnerabilities",
    prompt: SECURITY_PROMPTS.vulnerabilityAssessment,
    icon: <ShieldAlert className="h-5 w-5 text-threat" />,
  },
  {
    title: "Security Policy",
    description: "Generate a security policy for your organization",
    prompt: SECURITY_PROMPTS.securityPolicyGeneration,
    icon: <FileText className="h-5 w-5 text-secure" />,
  },
  {
    title: "Compliance Check",
    description: "Check compliance against security frameworks",
    prompt: SECURITY_PROMPTS.complianceCheck,
    icon: <ClipboardCheck className="h-5 w-5 text-safe" />,
  },
  {
    title: "Incident Response",
    description: "Create an incident response plan",
    prompt: SECURITY_PROMPTS.incidentResponse,
    icon: <ShieldAlert className="h-5 w-5 text-warning" />,
  },
];

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ editor }) => {
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();
  
  const handleSendQuery = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity AI API key",
        variant: "destructive",
      });
      return;
    }
    
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query for the AI assistant",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setResponse('');
    
    try {
      // This is a mock response since we don't want to make actual API calls in this demo
      // In a real implementation, you would call queryPerplexityAI here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = `# Security Analysis

Based on your request, here's what you should consider:

## Key Findings

1. Ensure your authentication system uses multi-factor authentication
2. Implement proper session management
3. Use TLS/SSL for all communications
4. Regularly update and patch systems

## Recommendations

- Use OAuth 2.0 with OpenID Connect for authentication
- Implement proper CSRF protection
- Ensure secure password storage using bcrypt
- Set appropriate security headers

This analysis is based on current best practices in cybersecurity.`;
      
      setResponse(mockResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive",
      });
      console.error("AI Assistant Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const insertResponseToEditor = () => {
    if (!response) return;
    
    // For simplicity, just insert as a paragraph
    // In a real application, you would parse the markdown and insert appropriate elements
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: response }],
    });
    
    toast({
      title: "Content Inserted",
      description: "AI-generated content has been added to your document",
    });
  };
  
  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setQuery(template.prompt);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-secure" />
          Security AI Assistant
        </CardTitle>
        <CardDescription>
          Get AI-powered security guidance for your documentation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="ask">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ask">Ask AI</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ask" className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="api-key">Perplexity AI API Key</Label>
              <Input 
                id="api-key" 
                type="password" 
                placeholder="Enter your API key" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="query">Security Query</Label>
              <Textarea 
                id="query" 
                placeholder="Ask about security best practices, compliance requirements, threat modeling, etc."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="resize-none h-24"
              />
            </div>
            
            {selectedTemplate && (
              <div className="bg-muted p-2 rounded-md text-xs">
                <p className="font-semibold">{selectedTemplate.title}</p>
                <p>{selectedTemplate.description}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="mt-2">
            <div className="space-y-2">
              {securityTemplates.map((template, idx) => (
                <Button 
                  key={idx}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => selectTemplate(template)}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">{template.icon}</span>
                    <div>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {response && (
          <div className="mt-4 space-y-2">
            <Label>AI Response</Label>
            <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
              {response}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={insertResponseToEditor}
          disabled={!response || loading}
        >
          Insert to Document
        </Button>
        
        <Button 
          onClick={handleSendQuery} 
          disabled={loading || !query.trim()}
          className="bg-secure hover:bg-secure-darker"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAssistantPanel;

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
import { SECURITY_PROMPTS, queryPerplexityAI } from '@/services/perplexityAI';

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
  const [apiKey, setApiKey] = useState('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');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();
  
  const handleSendQuery = async () => {
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
      const result = await queryPerplexityAI(
        query,
        apiKey,
        "You are a cybersecurity expert assistant that helps with security documentation, threat analysis, and compliance guidance."
      );
      const aiResponse = result.choices[0].message.content;
      setResponse(aiResponse);
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
    <Card className="h-full flex flex-col bg-slate-800 border-slate-700 text-slate-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-secure">
          <BrainCircuit className="h-5 w-5" />
          Security AI Assistant
        </CardTitle>
        <CardDescription className="text-slate-300">
          Get AI-powered security guidance for your documentation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-auto">
        <Tabs defaultValue="ask">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="ask" className="data-[state=active]:bg-secure">Ask AI</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-secure">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ask" className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="query" className="text-slate-300">Security Query</Label>
              <Textarea 
                id="query" 
                placeholder="Ask about security best practices, compliance requirements, threat modeling, etc."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="resize-none h-24 bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>
            
            {selectedTemplate && (
              <div className="bg-slate-700 p-2 rounded-md text-xs">
                <p className="font-semibold text-slate-200">{selectedTemplate.title}</p>
                <p className="text-slate-300">{selectedTemplate.description}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="mt-2">
            <div className="space-y-2">
              {securityTemplates.map((template, idx) => (
                <Button 
                  key={idx}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3 bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-100"
                  onClick={() => selectTemplate(template)}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">{template.icon}</span>
                    <div>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-xs text-slate-400">{template.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {response && (
          <div className="mt-4 space-y-2">
            <Label className="text-slate-300">AI Response</Label>
            <div className="bg-slate-900 p-3 rounded-md text-sm whitespace-pre-wrap max-h-48 overflow-y-auto text-slate-200">
              {response}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-slate-700 pt-4 flex justify-between">
        <Button 
          variant="outline"
          onClick={insertResponseToEditor}
          disabled={!response || loading}
          className="bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800 hover:text-slate-100"
        >
          Insert to Document
        </Button>
        
        <Button 
          onClick={handleSendQuery}
          disabled={loading || !query.trim()}
          className="bg-secure hover:bg-secure-darker flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAssistantPanel;

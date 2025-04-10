
import React, { useCallback, useState, useEffect } from 'react';
import { Editor as NovelEditor } from "novel";
import { Shield, Lock, Save, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';

interface SecurityEditorProps {
  initialContent?: any;
  title?: string;
  onSave?: () => void;
  onContentChange?: (content: any) => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  readOnly?: boolean;
}

const SecurityEditor: React.FC<SecurityEditorProps> = ({
  initialContent,
  title = "Untitled Security Document",
  onSave,
  onContentChange,
  isSaving = false,
  lastSaved = null,
  readOnly = false
}) => {
  const [content, setContent] = useState<any>(initialContent);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { role } = useAuth();
  
  // Handle content change
  const handleContentChange = useCallback((newContent: any) => {
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  }, [onContentChange]);

  // Security template options based on user role
  const securityTemplateOptions = [
    {
      title: 'Vulnerability Details',
      roles: ['individual', 'team_member', 'team_manager', 'administrator'],
      template: `## Vulnerability Details

Description: 

Severity: High/Medium/Low

Affected Components:

Reproduction Steps:
`
    },
    {
      title: 'Risk Assessment',
      roles: ['team_member', 'team_manager', 'administrator'],
      template: `## Risk Assessment

Impact: 

Likelihood:

Overall Risk:

Business Context:
`
    },
    {
      title: 'Compliance Requirements',
      roles: ['team_manager', 'administrator'],
      template: `## Compliance Requirements

Regulatory Standards:

Control Requirements:

Audit Evidence:
`
    },
    {
      title: 'Executive Summary',
      roles: ['team_manager', 'administrator'],
      template: `## Executive Summary

Key Findings:

Business Impact:

Recommended Actions:

Timeline:
`
    }
  ];

  // Filter template options based on user role
  const availableTemplateOptions = securityTemplateOptions.filter(option => {
    if (!role) return false;
    return option.roles.includes(role);
  });

  // Toggle AI assistant panel
  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  // Novel editor extensions and configuration
  const editorProps = {
    disableLocalStorage: true,
    defaultValue: initialContent || { 
      type: 'doc', 
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] 
    },
    onUpdate: ({ editor }) => {
      // Get JSON content from editor
      const json = editor.getJSON();
      handleContentChange(json);
    },
    extensions: [],
    className: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none max-w-full",
    completionApi: "/api/ai/editor-completion",
  };

  const [showSecurityOptions, setShowSecurityOptions] = useState(false);

  // Insert security template into editor
  const insertSecurityTemplate = useCallback((template: string) => {
    if (onContentChange) {
      // This is a simplified version - in a real implementation
      // you would need to convert the template string to Novel's JSON format
      // and merge it with the existing content
      onContentChange({
        ...content,
        content: [...(content?.content || []), { type: 'paragraph', content: [{ type: 'text', text: template }] }]
      });
    }
    setShowSecurityOptions(false);
  }, [content, onContentChange]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 text-secure">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md">{title}</h1>
          <Lock className="h-4 w-4 text-orange-500" title="Security document" />
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
          {lastSaved && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          
          <Button 
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="bg-secure hover:bg-secure-darker"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button 
            onClick={toggleAIAssistant}
            variant={showAIAssistant ? "default" : "outline"}
            className={showAIAssistant ? "bg-secure hover:bg-secure-darker" : ""}
            size="sm"
          >
            AI Assistant
          </Button>
        </div>
      </div>
      
      <Card className="shadow-md border-secure/20 bg-slate-950 text-white">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            <div className={`flex-1 ${showAIAssistant ? 'lg:w-2/3' : 'w-full'}`}>
              <div className="border border-slate-700 rounded-md mt-2 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] bg-slate-900 shadow-inner">
                <NovelEditor {...editorProps} />
              </div>
            </div>
            
            {showAIAssistant && (
              <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
                <div className="bg-slate-800 p-4 rounded-md h-full">
                  <h3 className="text-lg font-medium mb-4">Security Assistant</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    AI assistance for security documentation:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-orange-500/10 p-1">
                        <Shield className="h-4 w-4 text-orange-500" />
                      </div>
                      <span>Type <code>++</code> to activate AI suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-orange-500/10 p-1">
                        <Shield className="h-4 w-4 text-orange-500" />
                      </div>
                      <span>Use slash menu for security templates</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Security templates toolbar */}
      {!readOnly && (
        <div className="mb-2 flex items-center">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecurityOptions(!showSecurityOptions)}
              className="flex items-center gap-2 mr-2"
            >
              <Shield className="h-4 w-4" />
              <span>Security Templates</span>
            </Button>
            
            {showSecurityOptions && (
              <div className="absolute top-full left-0 mt-1 w-64 z-50 bg-background border rounded-md shadow-md p-2">
                <div className="text-sm font-medium mb-2">Insert Security Content</div>
                <div className="space-y-1">
                  {availableTemplateOptions.map((option) => (
                    <Button 
                      key={option.title} 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-left"
                      onClick={() => insertSecurityTemplate(option.template)}
                    >
                      {option.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Role indicator badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="ml-auto">
                  {role === 'individual' && 'Individual Access'}
                  {role === 'team_member' && 'Team Member Access'}
                  {role === 'team_manager' && 'Team Manager Access'} 
                  {role === 'administrator' && 'Administrator Access'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current access level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default SecurityEditor;


export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    text?: string;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface PerplexityOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function queryPerplexityAI(
  message: string, 
  apiKey: string,
  systemPrompt: string = "You are a cybersecurity expert assistant that helps with security documentation, threat analysis, and compliance guidance.",
  options: PerplexityOptions = {}
): Promise<PerplexityResponse> {
  const { 
    model = "llama-3.1-sonar-small-128k-online", 
    temperature = 0.2, 
    maxTokens = 1000 
  } = options;
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature,
        max_tokens: maxTokens,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: ['perplexity.ai'],
        search_recency_filter: 'month'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to query Perplexity AI');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error querying Perplexity AI:', error);
    throw error;
  }
}

// Security-specific prompts
export const SECURITY_PROMPTS = {
  vulnerabilityAssessment: "Please analyze the following system for vulnerabilities and provide recommendations: ",
  securityPolicyGeneration: "Please generate a security policy for the following topic: ",
  threatAnalysis: "Please analyze the following security threat and provide mitigation strategies: ",
  complianceCheck: "Please check if the following practices comply with {framework} requirements: ",
  incidentResponse: "Help me create an incident response plan for: "
};

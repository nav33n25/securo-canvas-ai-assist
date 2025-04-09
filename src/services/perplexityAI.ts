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
  
  // Validate inputs before making API call
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }
  
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Invalid API key');
  }
  
  // Mask API key for logging (only show first 4 and last 4 chars)
  const maskedKey = apiKey.length > 8 
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : '********';
  
  try {
    console.log(`Querying Perplexity AI with model: ${model}, key: ${maskedKey}`);
    
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
      const errorText = await response.text();
      let errorMessage = 'Failed to query Perplexity AI';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If error response isn't valid JSON, use status text
        errorMessage = `${response.status}: ${response.statusText || errorMessage}`;
      }
      
      console.error('Perplexity API error:', {
        status: response.status,
        error: errorMessage
      });
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || !data.choices.length) {
      throw new Error('Invalid response from Perplexity AI');
    }
    
    return data;
  } catch (error) {
    console.error('Error querying Perplexity AI:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unexpected error when querying Perplexity AI');
  }
}

// Security-specific prompts
export const SECURITY_PROMPTS = {
  vulnerabilityAssessment: `Please help me create a vulnerability assessment for the following system: 
[System Description]

Please include:
1. Identified vulnerabilities
2. Risk ratings
3. Potential impact
4. Recommended mitigations`,

  securityPolicyGeneration: `Help me create a security policy for:
[Organization/System]

Please include:
1. Policy purpose and scope
2. Roles and responsibilities
3. Security requirements
4. Compliance requirements
5. Enforcement mechanisms`,

  complianceCheck: `Analyze the following for compliance with [Framework] requirements:
[Description]

Please provide:
1. Compliance status assessment
2. Gaps identified
3. Recommended actions to achieve compliance`,

  incidentResponse: `Help me create an incident response plan for:
[Organization/System]

Please include:
1. Incident classification
2. Roles and responsibilities
3. Detection and reporting procedures
4. Containment, eradication, and recovery steps
5. Post-incident activities`
};

// Security utilities for API keys
export const securityUtils = {
  /**
   * Securely store an API key in localStorage with encryption
   * Note: This is still not 100% secure, but better than plain text
   */
  storeApiKey: (key: string, userId: string): void => {
    if (!key || !userId) return;
    
    try {
      // Simple obfuscation, not true encryption (would require a proper library)
      const obfuscated = btoa(`${userId}:${key}:${Date.now()}`);
      localStorage.setItem('pplx_api_key', obfuscated);
    } catch (err) {
      console.error('Failed to store API key');
    }
  },
  
  /**
   * Retrieve a stored API key
   */
  getApiKey: (userId: string): string | null => {
    try {
      const stored = localStorage.getItem('pplx_api_key');
      if (!stored) return null;
      
      const decoded = atob(stored);
      const [storedUserId, key] = decoded.split(':');
      
      // Only return key if it matches the current user
      if (storedUserId === userId) {
        return key;
      }
      return null;
    } catch (err) {
      console.error('Failed to retrieve API key');
      return null;
    }
  },
  
  /**
   * Clear stored API key
   */
  clearApiKey: (): void => {
    localStorage.removeItem('pplx_api_key');
  }
};

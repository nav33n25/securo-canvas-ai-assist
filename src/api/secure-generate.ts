import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Security patterns to detect potentially sensitive information
const sensitivePatterns = [
  /password\s*[:=]\s*\S+/i,
  /api[-_]?key\s*[:=]\s*\S+/i,
  /secret\s*[:=]\s*\S+/i,
  /token\s*[:=]\s*\S+/i,
  /ssn\s*[:=]?\s*\d{3}[-\s]?\d{2}[-\s]?\d{4}/i,
  /\b(?:\d[ -]*?){13,16}\b/ // Credit card pattern
];

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response('Unauthorized', { status: 401 });
    }

    // Check rate limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count, error: countError } = await supabase
      .from('ai_completions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString());
      
    if (countError) {
      console.error('Error checking rate limit:', countError);
      return new Response('Error checking rate limit', { status: 500 });
    }
    
    if (count && count >= 50) { // 50 completions per day
      return new Response('Daily AI generation limit reached', { status: 429 });
    }

    // Parse request
    const { prompt, sensitivity = 'internal' } = await req.json();
    
    // Check if prompt contains sensitive information
    if (sensitivity === 'confidential' || sensitivity === 'restricted') {
      const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(prompt));
      
      if (hasSensitiveData) {
        // Log the attempt
        await supabase.from('security_audit_log').insert({
          user_id: user.id,
          action: 'blocked_ai_generation',
          resource_type: 'document',
          details: { reason: 'sensitive_data_detected', sensitivity }
        });
        
        return new Response('Content appears to contain sensitive data that cannot be sent to external AI services', 
          { status: 403 });
      }
    }

    // Call Perplexity API
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3-8b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are an AI writing assistant that continues existing text based on context from prior text.
                      Give more weight/priority to the later characters than the beginning ones.
                      Limit your response to no more than 200 characters, but make sure to construct complete sentences.
                      Use Markdown formatting when appropriate.
                      Never include sensitive data like API keys, passwords, or personal identifiers in your response.
                      Security-focused writing is preferred.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: true
      })
    });

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.text();
      console.error('Perplexity API error:', errorData);
      return new Response(`AI service error: ${perplexityResponse.statusText}`, 
        { status: perplexityResponse.status });
    }

    // Log the completion
    await supabase.from('ai_completions').insert({
      user_id: user.id,
      prompt_length: prompt.length,
      sensitivity_level: sensitivity,
      created_at: new Date().toISOString()
    });

    // Stream the response
    return new Response(perplexityResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return new Response(`Server error: ${error.message}`, { status: 500 });
  }
} 
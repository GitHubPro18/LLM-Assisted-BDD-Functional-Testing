/**
 * LLM Client Wrapper
 * Provides a single async send(prompt: string) method.
 * This module is easily replaceable or mockable for testing.
 */
/*export interface LlmClient {
  send(prompt: string): Promise<string>;
}

export class DefaultLlmClient implements LlmClient {
  async send(prompt: string): Promise<string> {
    // Implement actual LLM API call here
    // For now, throw to indicate not implemented
    throw new Error('LLM client not implemented. Replace with actual API logic.');
  }
}
*/
// llm/llm_client.ts
import 'dotenv/config';

import fetch from 'node-fetch';

export interface LlmClient {
  send(prompt: string): Promise<string>;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAILlmClient implements LlmClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly endpoint: string;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = 'https://clarifai.com/openai/chat-completion/models/gpt-oss-120b';
    this.endpoint = 'https://api.clarifai.com/v2/ext/openai/v1/chat/completions';
  }

  async send(prompt: string): Promise<string> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM request failed: ${response.status} ${error}`);
    }

    const data = await response.json() as OpenAIResponse;
    const content = data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      throw new Error('Invalid LLM response format');
    }

    return content.trim();
  }
}

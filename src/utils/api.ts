import { logError } from './analytics';

const API_URL = 'https://api.openai.com/v1/chat/completions';

interface GeneratePromptResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export const generatePrompt = async (input: string): Promise<GeneratePromptResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error('API key not found');
    logError(error, 'api_key_missing');
    throw error;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate prompt');
    }

    return response.json();
  } catch (error) {
    logError(error instanceof Error ? error : new Error('API request failed'), 'api_request');
    throw error;
  }
};

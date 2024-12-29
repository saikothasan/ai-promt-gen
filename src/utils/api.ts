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

  // Ensure the API key exists
  if (!apiKey) {
    const error = new Error('API key not found');
    logError(error, 'api_key_missing');
    throw error;
  }

  try {
    // Prepare the request payload
    const payload = {
      model: 'gpt-4o-mini', // Ensure this model exists in your OpenAI account
      messages: [
        { role: 'system', content: 'Write an advanced prompt:' },
        { role: 'user', content: input },
      ],
      temperature: 0.7,
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2)); // Debug the payload

    // Send the request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    // Log raw response for debugging
    console.log('Raw response:', response);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null); // Catch JSON parse errors
      const errorMessage =
        errorData?.error?.message || `HTTP error ${response.status}: ${response.statusText}`;
      logError(new Error(errorMessage), 'api_response_error');
      throw new Error(errorMessage);
    }

    // Parse and return JSON response
    try {
      const jsonResponse: GeneratePromptResponse = await response.json();
      console.log('Parsed response:', jsonResponse); // Debug the response
      return jsonResponse;
    } catch (parseError) {
      logError(new Error('Failed to parse JSON response'), 'json_parse');
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    // Log and rethrow errors
    logError(error instanceof Error ? error : new Error('Unknown error'), 'api_request');
    throw error;
  }
};

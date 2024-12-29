import { useState, useRef, useCallback } from 'react';
import { generatePrompt } from '../api';
import { usePromptStore } from '../../store/useStore';
import { logError, logEvent } from '../analytics';

export const usePromptInput = (onToast: (message: string, type: 'success' | 'error') => void) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addPrompt = usePromptStore((state) => state.addPrompt);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    logEvent('prompt_submission_started', { category });

    try {
      const response = await generatePrompt(input);
      const result = response.candidates[0].content.parts[0].text;
      
      addPrompt({
        content: input,
        category,
        response: result,
      });
      
      setInput('');
      onToast('Prompt generated successfully!', 'success');
      logEvent('prompt_submission_success', { category });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate prompt';
      onToast(errorMessage, 'error');
      logError(error instanceof Error ? error : new Error(errorMessage), 'prompt_submission');
    } finally {
      setIsLoading(false);
    }
  }, [input, category, addPrompt, onToast]);

  return {
    input,
    setInput,
    isLoading,
    category,
    setCategory,
    textareaRef,
    handleSubmit,
  };
};
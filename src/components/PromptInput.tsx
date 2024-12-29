import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { usePromptStore } from '../store/useStore';
import { generatePrompt } from '../utils/api';
import { categories } from '../utils/constants';

interface PromptInputProps {
  onToast: (message: string, type: 'success' | 'error') => void;
}

export const PromptInput = ({ onToast }: PromptInputProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addPrompt = usePromptStore((state) => state.addPrompt);

  useEffect(() => {
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    adjustHeight();
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
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
    } catch (error) {
      onToast(error instanceof Error ? error.message : 'Failed to generate prompt', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex gap-2 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => {
            setInput(input + ' [Be creative and detailed]');
            textareaRef.current?.focus();
          }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20 hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Add Creativity
        </button>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt idea..."
          className="w-full min-h-[100px] p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300 resize-none"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white disabled:opacity-50 transition-all duration-300 hover:scale-105 animate-pulse-ring"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Press Enter to submit, Shift + Enter for new line
      </div>
    </form>
  );
};
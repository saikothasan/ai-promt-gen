import { Copy, Share2, Trash2 } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onCopy: (text: string) => void;
}

export const PromptCard = ({ prompt, onDelete, onCopy }: PromptCardProps) => {
  const sharePrompt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChatGPT Prompt',
          text: prompt.content,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-2 transition-all duration-300 hover:bg-white/10">
      <div className="flex justify-between items-start gap-2">
        <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
          {prompt.category}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onCopy(prompt.content)}
            className="p-1 rounded hover:bg-white/10 transition-colors duration-300"
            aria-label="Copy prompt"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={sharePrompt}
            className="p-1 rounded hover:bg-white/10 transition-colors duration-300"
            aria-label="Share prompt"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-1 rounded hover:bg-white/10 transition-colors duration-300"
            aria-label="Delete prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{prompt.content}</p>
      {prompt.response && (
        <div className="mt-2 p-2 rounded bg-white/5">
          <p className="text-sm text-gray-300">{prompt.response}</p>
        </div>
      )}
      <time className="text-xs text-gray-400">
        {new Date(prompt.createdAt).toLocaleDateString()}
      </time>
    </div>
  );
};
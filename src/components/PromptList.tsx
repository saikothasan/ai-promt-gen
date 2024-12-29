import { usePromptStore } from '../store/useStore';
import { PromptCard } from './PromptCard';
import { useState } from 'react';

const PromptList = ({ onToast }: { onToast: (message: string, type: 'success' | 'error') => void }) => {
  const { prompts, removePrompt } = usePromptStore();
  const [filter, setFilter] = useState('all');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast('Copied to clipboard!', 'success');
    } catch (err) {
      onToast('Failed to copy text', 'error');
    }
  };

  const handleDelete = (id: string) => {
    removePrompt(id);
    onToast('Prompt deleted', 'success');
  };

  const filteredPrompts = filter === 'all' 
    ? prompts 
    : prompts.filter(prompt => prompt.category === filter);

  const categories = ['all', ...new Set(prompts.map(p => p.category))];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
              filter === category
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onDelete={handleDelete}
            onCopy={handleCopy}
          />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No prompts found. Start by generating some prompts!
        </p>
      )}
    </div>
  );
};

export default PromptList;
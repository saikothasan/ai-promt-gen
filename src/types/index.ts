export interface Prompt {
  id: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface Theme {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface PromptStore {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt'>) => void;
  removePrompt: (id: string) => void;
}
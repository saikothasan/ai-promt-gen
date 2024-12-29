export const validatePrompt = (prompt: string): string | null => {
  if (!prompt.trim()) {
    return 'Prompt cannot be empty';
  }
  if (prompt.length > 1000) {
    return 'Prompt is too long (max 1000 characters)';
  }
  return null;
};

export const validateCategory = (category: string, validCategories: string[]): string | null => {
  if (!validCategories.includes(category)) {
    return 'Invalid category selected';
  }
  return null;
};
import { useEffect } from 'react';

export const useKeyboardShortcuts = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  handleSubmit: (e: any) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && textareaRef.current === document.activeElement) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, textareaRef]);
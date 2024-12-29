import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Theme, PromptStore } from '../types';
import { logError } from '../utils/analytics';

const STORAGE_KEY = 'prompt-storage';

export const useThemeStore = create<Theme>()(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const usePromptStore = create<PromptStore>()(
  persist(
    (set) => ({
      prompts: [],
      addPrompt: (prompt) =>
        set((state) => ({
          prompts: [
            {
              ...prompt,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.prompts,
          ],
        })),
      removePrompt: (id) =>
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
        })),
      clearPrompts: () => set({ prompts: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch (error) {
            logError(error instanceof Error ? error : new Error('Storage error'), 'storage_get');
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch (error) {
            logError(error instanceof Error ? error : new Error('Storage error'), 'storage_set');
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            logError(error instanceof Error ? error : new Error('Storage error'), 'storage_remove');
          }
        },
      })),
      onError: (error) => {
        logError(error instanceof Error ? error : new Error('Store error'), 'store_persist');
      },
    }
  )
);
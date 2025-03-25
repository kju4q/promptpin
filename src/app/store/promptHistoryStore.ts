import { create } from "zustand";
import { Prompt } from "../types/prompt";

interface PromptHistoryStore {
  history: Prompt[];
  addToHistory: (prompt: Prompt) => void;
  clearHistory: () => void;
}

export const usePromptHistoryStore = create<PromptHistoryStore>((set) => ({
  history: [],
  addToHistory: (prompt: Prompt) =>
    set((state) => ({
      history: [prompt, ...state.history].slice(0, 50), // Keep last 50 prompts
    })),
  clearHistory: () => set({ history: [] }),
}));

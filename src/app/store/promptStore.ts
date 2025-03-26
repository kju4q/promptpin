import { create } from "zustand";
import { Prompt } from "../types/prompt";

interface PromptStore {
  prompts: Prompt[];
  setPrompts: (prompts: Prompt[]) => void;
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (prompt: Prompt) => void;
  deletePrompt: (id: string) => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
  prompts: [],
  setPrompts: (prompts: Prompt[]) => set({ prompts }),
  addPrompt: (prompt: Prompt) =>
    set((state) => ({ prompts: [...state.prompts, prompt] })),
  updatePrompt: (prompt: Prompt) =>
    set((state) => ({
      prompts: state.prompts.map((p) => (p.id === prompt.id ? prompt : p)),
    })),
  deletePrompt: (id: string) =>
    set((state) => ({
      prompts: state.prompts.filter((p) => p.id !== id),
    })),
}));

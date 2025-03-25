import { create } from "zustand";
import { Prompt } from "../types/prompt";

interface PromptStore {
  prompts: Prompt[];
  setPrompts: (prompts: Prompt[]) => void;
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (prompt: Prompt) => void;
  deletePrompt: (id: string) => void;
}

type SetState = (
  partial:
    | PromptStore
    | Partial<PromptStore>
    | ((state: PromptStore) => PromptStore | Partial<PromptStore>),
  replace?: boolean
) => void;

export const usePromptStore = create<PromptStore>((set: SetState) => ({
  prompts: [],
  setPrompts: (prompts: Prompt[]) => set({ prompts }),
  addPrompt: (prompt: Prompt) =>
    set((state: PromptStore) => ({ prompts: [...state.prompts, prompt] })),
  updatePrompt: (prompt: Prompt) =>
    set((state: PromptStore) => ({
      prompts: state.prompts.map((p: Prompt) =>
        p.id === prompt.id ? prompt : p
      ),
    })),
  deletePrompt: (id: string) =>
    set((state: PromptStore) => ({
      prompts: state.prompts.filter((p: Prompt) => p.id !== id),
    })),
}));

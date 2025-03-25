import { create } from "zustand";
import { Prompt } from "../types/prompt";

interface SavedPromptsStore {
  savedPrompts: Prompt[];
  savedPromptIds: Set<string>;
  savePrompt: (prompt: Prompt) => void;
  unsavePrompt: (prompt: Prompt) => void;
  isPromptSaved: (id: string) => boolean;
}

export const useSavedPromptsStore = create<SavedPromptsStore>((set, get) => ({
  savedPrompts: [],
  savedPromptIds: new Set<string>(),
  savePrompt: (prompt: Prompt) =>
    set((state) => ({
      savedPrompts: [...state.savedPrompts, prompt],
      savedPromptIds: new Set([...state.savedPromptIds, prompt.id]),
    })),
  unsavePrompt: (prompt: Prompt) =>
    set((state) => {
      const newSavedPrompts = state.savedPrompts.filter(
        (p) => p.id !== prompt.id
      );
      const newSavedPromptIds = new Set(
        Array.from(state.savedPromptIds).filter((id) => id !== prompt.id)
      );
      return {
        savedPrompts: newSavedPrompts,
        savedPromptIds: newSavedPromptIds,
      };
    }),
  isPromptSaved: (id: string) => get().savedPromptIds.has(id),
}));

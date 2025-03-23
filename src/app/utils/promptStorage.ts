import { Prompt } from "../data/prompts";

const SAVED_PROMPTS_KEY = "promptpin-saved-prompts";
const USER_PROMPTS_KEY = "promptpin-user-prompts";

// Save prompt IDs to localStorage
export const savePrompt = (promptId: string): void => {
  if (typeof window === "undefined") return;

  const savedPrompts = getSavedPrompts();
  if (!savedPrompts.includes(promptId)) {
    savedPrompts.push(promptId);
    localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(savedPrompts));
  }
};

// Remove prompt ID from localStorage
export const unsavePrompt = (promptId: string): void => {
  if (typeof window === "undefined") return;

  const savedPrompts = getSavedPrompts();
  const updatedPrompts = savedPrompts.filter((id) => id !== promptId);
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updatedPrompts));
};

// Get all saved prompt IDs from localStorage
export const getSavedPrompts = (): string[] => {
  if (typeof window === "undefined") return [];

  const savedPrompts = localStorage.getItem(SAVED_PROMPTS_KEY);
  return savedPrompts ? JSON.parse(savedPrompts) : [];
};

// Check if a prompt is saved
export const isPromptSaved = (promptId: string): boolean => {
  return getSavedPrompts().includes(promptId);
};

// Add a user-created prompt to localStorage
export const addUserPrompt = (prompt: Omit<Prompt, "id">): Prompt => {
  if (typeof window === "undefined") return { id: "", ...prompt };

  const userPrompts = getUserPrompts();
  const newPrompt: Prompt = {
    ...prompt,
    id: `user-${Date.now()}`,
  };

  userPrompts.push(newPrompt);
  localStorage.setItem(USER_PROMPTS_KEY, JSON.stringify(userPrompts));

  return newPrompt;
};

// Get all user-created prompts from localStorage
export const getUserPrompts = (): Prompt[] => {
  if (typeof window === "undefined") return [];

  const userPrompts = localStorage.getItem(USER_PROMPTS_KEY);
  return userPrompts ? JSON.parse(userPrompts) : [];
};

import { Prompt } from "../types/prompt";

const SAVED_PROMPTS_KEY = "promptpin-saved-prompts";
const USER_PROMPTS_KEY = "promptpin-user-prompts";
const ALL_PROMPTS_KEY = "promptpin-all-prompts";

// Helper function to ensure prompt has all required fields
const ensurePromptFields = (prompt: Partial<Prompt>): Prompt => {
  const now = new Date().toISOString();
  return {
    ...prompt,
    createdAt: prompt.createdAt || now,
    updatedAt: prompt.updatedAt || now,
    severity: prompt.severity || "low",
  } as Prompt;
};

// Save prompt IDs to localStorage
export const savePrompt = (promptId: string): void => {
  if (typeof window === "undefined") return;

  // Add to saved prompts list
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
  if (typeof window === "undefined")
    return ensurePromptFields({ id: "", ...prompt });

  const userPrompts = getUserPrompts();
  const newPrompt = ensurePromptFields({
    ...prompt,
    id: `user-${Date.now()}`,
  });

  userPrompts.push(newPrompt);
  localStorage.setItem(USER_PROMPTS_KEY, JSON.stringify(userPrompts));

  // Also add to all prompts
  addToAllPrompts(newPrompt);

  return newPrompt;
};

// Store all prompts (including API-generated ones) for retrieval by ID
export const storeAllPrompts = (prompts: Prompt[]): void => {
  if (typeof window === "undefined") return;

  const existingPrompts = getAllPrompts();

  // Merge existing prompts with new ones, avoiding duplicates by ID
  const promptMap = new Map();

  // Add existing prompts to the map
  existingPrompts.forEach((prompt) => {
    promptMap.set(prompt.id, prompt);
  });

  // Add or update with new prompts
  prompts.forEach((prompt) => {
    promptMap.set(prompt.id, prompt);
  });

  // Convert back to array
  const allPrompts = Array.from(promptMap.values());

  localStorage.setItem(ALL_PROMPTS_KEY, JSON.stringify(allPrompts));
};

// Add a single prompt to all prompts
export const addToAllPrompts = (prompt: Prompt): void => {
  if (typeof window === "undefined") return;

  const allPrompts = getAllPrompts();

  // Check if prompt already exists and update it
  const existingIndex = allPrompts.findIndex((p) => p.id === prompt.id);

  if (existingIndex >= 0) {
    allPrompts[existingIndex] = prompt;
  } else {
    allPrompts.push(prompt);
  }

  localStorage.setItem(ALL_PROMPTS_KEY, JSON.stringify(allPrompts));
};

// Get all prompts from localStorage
export const getAllPrompts = (): Prompt[] => {
  if (typeof window === "undefined") return [];

  const allPrompts = localStorage.getItem(ALL_PROMPTS_KEY);
  return allPrompts ? JSON.parse(allPrompts) : [];
};

// Get all user-created prompts from localStorage
export const getUserPrompts = (): Prompt[] => {
  if (typeof window === "undefined") return [];

  const userPrompts = localStorage.getItem(USER_PROMPTS_KEY);
  return userPrompts ? JSON.parse(userPrompts) : [];
};

// Get all saved prompts as full prompt objects
export const getSavedPromptsData = (): Prompt[] => {
  if (typeof window === "undefined") return [];

  const savedIds = getSavedPrompts();
  if (savedIds.length === 0) return [];

  // Get all possible prompts from different sources
  const allPrompts = getAllPrompts();
  const userPrompts = getUserPrompts();

  // Create a map of all available prompts by ID
  const promptsMap = new Map<string, Prompt>();
  [...allPrompts, ...userPrompts].forEach((prompt) => {
    promptsMap.set(prompt.id, prompt);
  });

  // Filter to only include saved prompts
  return savedIds
    .map((id) => promptsMap.get(id))
    .filter((prompt) => prompt !== undefined) as Prompt[];
};

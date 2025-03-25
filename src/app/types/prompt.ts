export interface Prompt {
  id: string;
  title: string;
  description?: string;
  promptText: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  severity?: "low" | "medium" | "high";
}

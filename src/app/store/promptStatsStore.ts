import { create } from "zustand";
import { Prompt } from "../types/prompt";

interface PromptStats {
  views: number;
  saves: number;
  uses: number;
}

interface PromptStatsStore {
  stats: Record<string, PromptStats>;
  incrementViews: (promptId: string) => void;
  incrementSaves: (promptId: string) => void;
  incrementUses: (promptId: string) => void;
  getStats: (promptId: string) => PromptStats;
}

export const usePromptStatsStore = create<PromptStatsStore>((set, get) => ({
  stats: {},
  incrementViews: (promptId: string) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [promptId]: {
          ...state.stats[promptId],
          views: (state.stats[promptId]?.views || 0) + 1,
        },
      },
    })),
  incrementSaves: (promptId: string) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [promptId]: {
          ...state.stats[promptId],
          saves: (state.stats[promptId]?.saves || 0) + 1,
        },
      },
    })),
  incrementUses: (promptId: string) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [promptId]: {
          ...state.stats[promptId],
          uses: (state.stats[promptId]?.uses || 0) + 1,
        },
      },
    })),
  getStats: (promptId: string) =>
    get().stats[promptId] || { views: 0, saves: 0, uses: 0 },
}));

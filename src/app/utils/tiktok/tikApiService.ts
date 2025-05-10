import axios from "axios";
import { rewriteFallbackPrompt } from "../openai";
import {
  TIKAPI_BASE_URL,
  TIKAPI_KEY,
  TIKAPI_ACCOUNT_KEY,
  SubtitleInfo,
  TextExtra,
  TikTokComment,
} from "../tiktok-config";

/**
 * Check if the TikTok API is working by attempting to fetch trending prompts
 * @returns Boolean indicating if the API is working
 */
const checkApiKeyStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/tiktok?type=trending");
    return response.ok;
  } catch (error) {
    console.error("Error checking API status:", error);
    return false;
  }
};

/**
 * Fetch trending TikTok videos and extract prompts
 * @returns Array of extracted prompts
 */
const fetchTrendingPrompts = async (): Promise<ExtractedPrompt[]> => {
  try {
    const response = await fetch("/api/tiktok?type=trending");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch trending prompts: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.prompts || [];
  } catch (error) {
    console.error("Error fetching trending prompts:", error);
    return [];
  }
};

export type ExtractedPrompt = {
  prompt: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  digg_count?: number;
  sourceType: "description" | "comment" | "generated";
  creativeTitle?: string;
};

export { checkApiKeyStatus, fetchTrendingPrompts };

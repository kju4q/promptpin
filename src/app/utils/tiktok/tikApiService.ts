// Remove all Node.js-specific imports
import { fetchTrendingPrompts as fetchTrendingPromptsFromMain } from "../tiktok";

// Interface for TikTok video data
interface TikTokVideo {
  id: string;
  video_id: string;
  region: string;
  title: string;
  cover: string;
  origin_cover: string;
  duration: number;
  play: string;
  play_addr: string;
  download_addr: string;
  share_url: string;
  comment_count: number;
  digg_count: number;
  collect_count: number;
  share_count: number;
  create_time: number;
  author: {
    id: string;
    unique_id: string;
    nickname: string;
    avatar: string;
    signature: string;
    verified: boolean;
    region: string;
  };
  music: {
    id: string;
    title: string;
    play: string;
    cover: string;
    author: string;
    duration: number;
  };
  statistics: {
    comment_count: number;
    digg_count: number;
    share_count: number;
    collect_count: number;
    play_count: number;
  };
  text: string; // Video caption
  is_ad: boolean;
  is_top: boolean;
  is_original: boolean;
  is_private: boolean;
  is_duet: boolean;
  is_stitch: boolean;
}

// Interface for API response
interface TikApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

/**
 * Interface for extracted prompt from TikTok video
 */
export interface ExtractedPrompt {
  prompt: string;
  creativeTitle?: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  digg_count?: number;
}

/**
 * Check if the API is working
 * @returns Boolean indicating if the API is working
 */
const checkApiKeyStatus = async (): Promise<boolean> => {
  try {
    // Directly check if we can fetch trending prompts
    await fetchTrendingPromptsFromMain();
    return true;
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
    // Use the main implementation directly
    return await fetchTrendingPromptsFromMain();
  } catch (error) {
    console.error("Error fetching trending prompts:", error);
    return [];
  }
};

export { checkApiKeyStatus, fetchTrendingPrompts, type TikTokVideo };

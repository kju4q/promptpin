// TikTok API Configuration
export const TIKAPI_BASE_URL = "https://api.tikapi.io";
export const TIKAPI_KEY = process.env.NEXT_PUBLIC_TIKAPI_KEY;
export const TIKAPI_ACCOUNT_KEY = process.env.NEXT_PUBLIC_TIKAPI_ACCOUNT_KEY;

// TikTok API Types
export interface SubtitleInfo {
  LanguageCodeName: string;
  Url: string;
}

export interface TextExtra {
  type: number;
  hashtagName?: string;
}

export interface ExtractedPrompt {
  prompt: string;
  creativeTitle?: string;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  digg_count?: number;
  sourceType: "description" | "comment" | "generated";
}

export interface TikTokComment {
  id: string;
  text: string;
  author: {
    nickname: string;
    uniqueId: string;
  };
  digg_count: number;
}

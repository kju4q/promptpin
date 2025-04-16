import axios from "axios";

// TikAPI configuration
const TIKAPI_BASE_URL = "https://api.tikapi.io/public";
const TIKAPI_KEY = process.env.NEXT_PUBLIC_TIKAPI_KEY;

// Interface for TikTok video data
export interface TikTokVideo {
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
 * Fetch TikTok videos by hashtag
 * @param hashtag The hashtag to search for (without the # symbol)
 * @param count Number of videos to fetch (default: 30)
 * @returns Array of TikTok videos
 */
export const fetchVideosByHashtag = async (
  hashtag: string,
  count: number = 5
) => {
  const response = await fetch(
    `/api/tiktok?hashtag=${encodeURIComponent(hashtag)}&count=${count}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch videos");
  }
  const data = await response.json();
  // The TikAPI response structure: { status, data: { videos: [...] }, ... }
  return data.data?.videos || [];
};

/**
 * Fetch multiple TikTok videos by multiple hashtags
 * @param hashtags Array of hashtags to search for (without the # symbol)
 * @param countPerHashtag Number of videos to fetch per hashtag (default: 5)
 * @returns Array of TikTok videos
 */
export const fetchVideosByMultipleHashtags = async (
  hashtags: string[],
  countPerHashtag: number = 5
): Promise<TikTokVideo[]> => {
  const allVideos: TikTokVideo[] = [];
  for (const hashtag of hashtags) {
    try {
      const videos = await fetchVideosByHashtag(hashtag, countPerHashtag);
      allVideos.push(...videos);
    } catch (error) {
      // handle error or continue
    }
  }
  // Remove duplicates by video_id
  return allVideos.filter(
    (video, index, self) =>
      index === self.findIndex((v) => v.video_id === video.video_id)
  );
};

/**
 * Extract potential prompts from video captions and comments
 * @param video TikTok video object
 * @returns Array of potential prompts
 */
export const extractPromptsFromVideo = (video: TikTokVideo): string[] => {
  const prompts: string[] = [];

  // Extract from caption
  if (video.text) {
    // Look for patterns that might indicate a prompt
    // This is a simple implementation and can be enhanced
    const captionLines = video.text.split("\n");
    for (const line of captionLines) {
      if (
        line.toLowerCase().includes("prompt:") ||
        line.toLowerCase().includes("chatgpt:") ||
        line.toLowerCase().includes("ai prompt:") ||
        line.toLowerCase().includes("prompt engineering:")
      ) {
        prompts.push(line.trim());
      }
    }
  }

  return prompts;
};

/**
 * Interface for extracted prompt from TikTok video
 */
export interface ExtractedPrompt {
  prompt: string; // extracted from caption
  author: string; // TikTok username
  videoUrl: string;
  thumbnailUrl: string;
}

/**
 * Fetch trending TikTok posts and extract prompt-like text
 * @returns Array of extracted prompts
 */
export const fetchTrendingPrompts = async (): Promise<ExtractedPrompt[]> => {
  const API_KEY = process.env.NEXT_PUBLIC_TIKAPI_KEY;
  const ACCOUNT_KEY = process.env.NEXT_PUBLIC_TIKAPI_ACCOUNT_KEY;

  if (!API_KEY || !ACCOUNT_KEY) {
    throw new Error("TikAPI keys not configured");
  }

  try {
    // Fetch trending posts from TikTok
    const response = await axios.get(`${TIKAPI_BASE_URL}/post/trending`, {
      params: { count: 30 }, // Max items per request: 30
      headers: {
        "X-API-KEY": API_KEY,
        "X-ACCOUNT-KEY": ACCOUNT_KEY,
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const videos = response.data.data?.videos || [];
    const extractedPrompts: ExtractedPrompt[] = [];

    // Keywords to look for in captions
    const promptKeywords = [
      "prompt:",
      "chatgpt:",
      "ai prompt",
      "try this prompt",
      "prompt engineering",
      "gpt prompt",
      "ai prompt:",
      "prompt for",
      "prompt to",
    ];

    // Process each video
    for (const video of videos) {
      if (!video.text) continue;

      // Check if caption contains any of the prompt keywords
      const captionLower = video.text.toLowerCase();
      const hasPromptKeyword = promptKeywords.some((keyword) =>
        captionLower.includes(keyword.toLowerCase())
      );

      if (hasPromptKeyword) {
        // Extract the prompt text - this is a simple implementation
        // In a real implementation, you might want to use more sophisticated parsing
        let promptText = video.text;

        // Try to extract just the prompt part if possible
        for (const keyword of promptKeywords) {
          const keywordIndex = captionLower.indexOf(keyword.toLowerCase());
          if (keywordIndex !== -1) {
            // Extract text after the keyword
            promptText = video.text
              .substring(keywordIndex + keyword.length)
              .trim();
            break;
          }
        }

        extractedPrompts.push({
          prompt: promptText,
          author: video.author.nickname || video.author.unique_id,
          videoUrl: video.share_url,
          thumbnailUrl: video.cover,
        });
      }
    }

    return extractedPrompts;
  } catch (error: any) {
    console.error("Error fetching trending prompts:", error);
    throw new Error(`Failed to fetch trending prompts: ${error.message}`);
  }
};

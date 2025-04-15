import axios from "axios";

// TikAPI configuration
const TIKAPI_BASE_URL = "https://api.tikapi.io/public";
const TIKAPI_KEY = process.env.NEXT_PUBLIC_TIKAPI_KEY || "";

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
  count: number = 30
): Promise<TikTokVideo[]> => {
  try {
    if (!TIKAPI_KEY) {
      console.error("TikAPI key is not set");
      return [];
    }

    const response = await axios.get<TikApiResponse<{ videos: TikTokVideo[] }>>(
      `${TIKAPI_BASE_URL}/hashtag/${hashtag}/feed`,
      {
        params: {
          count,
        },
        headers: {
          Accept: "application/json",
          "X-TikAPI-Key": TIKAPI_KEY,
        },
      }
    );

    if (response.data.status === "success") {
      return response.data.data.videos;
    } else {
      console.error("TikAPI error:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching TikTok videos:", error);
    return [];
  }
};

/**
 * Fetch multiple TikTok videos by multiple hashtags
 * @param hashtags Array of hashtags to search for (without the # symbol)
 * @param countPerHashtag Number of videos to fetch per hashtag (default: 10)
 * @returns Array of TikTok videos
 */
export const fetchVideosByMultipleHashtags = async (
  hashtags: string[],
  countPerHashtag: number = 10
): Promise<TikTokVideo[]> => {
  try {
    const allVideos: TikTokVideo[] = [];

    for (const hashtag of hashtags) {
      const videos = await fetchVideosByHashtag(hashtag, countPerHashtag);
      allVideos.push(...videos);
    }

    // Remove duplicates based on video_id
    const uniqueVideos = allVideos.filter(
      (video, index, self) =>
        index === self.findIndex((v) => v.video_id === video.video_id)
    );

    return uniqueVideos;
  } catch (error) {
    console.error("Error fetching videos by multiple hashtags:", error);
    return [];
  }
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
